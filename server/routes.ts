import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { storage } from "./storage";
// import { insertContactSubmissionSchema } from "@shared/schema"; // Replaced with Firebase-specific validation
import { ContactFormData } from "@shared/types";
import { adminDb, adminStorage } from "./firebase-admin";
import { ImageManager } from "./image-manager";
import { collection, addDoc, getDocs, orderBy, query, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { ObjectStorageService, ObjectNotFoundError } from "./objectStorage";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/jpg',
      'image/png'
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOC, DOCX, JPG, and PNG files are allowed.'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Contact form submission endpoint with Firebase integration
  app.post("/api/contact", upload.array('documents', 5), async (req, res) => {
    try {
      // Debug: Log what we're actually receiving
      console.log('\n=== FORM SUBMISSION DEBUG ===');
      console.log('Request method:', req.method);
      console.log('Content-Type:', req.get('Content-Type'));
      console.log('Request body:', req.body);
      console.log('Request body keys:', Object.keys(req.body));
      console.log('Request body values:', Object.values(req.body));
      console.log('Request files:', req.files);
      console.log('============================\n');
      
      const files = req.files as Express.Multer.File[];
      const documentUrls: string[] = [];
      
      // Upload files to Firebase Storage
      if (files && files.length > 0) {
        for (const file of files) {
          const fileName = `documents/${Date.now()}_${uuidv4()}.${file.originalname.split('.').pop()}`;
          const storageRef = ref(adminStorage, fileName);
          
          const uploadResult = await uploadBytes(storageRef, file.buffer, {
            contentType: file.mimetype,
            customMetadata: {
              originalName: file.originalname
            }
          });
          
          const publicUrl = await getDownloadURL(uploadResult.ref);
          documentUrls.push(publicUrl);
        }
      }
      
      // Prepare form data for Firestore
      const submissionData: ContactFormData = {
        fullName: req.body.fullName,
        phoneNumber: req.body.phoneNumber,
        emailAddress: req.body.emailAddress,
        policyType: req.body.policyType,
        coverageLevel: req.body.coverageLevel,
        additionalInformation: req.body.additionalInformation || '',
        attachedDocuments: documentUrls,
        submittedAt: new Date(),
        status: 'pending'
      };

      // Simple validation schema (no Firebase dependencies)
      const contactSchema = z.object({
        fullName: z.string().min(2, "Full name must be at least 2 characters"),
        phoneNumber: z.string().min(10, "Please enter a valid phone number"),
        emailAddress: z.string().email("Please enter a valid email address"),
        policyType: z.string().min(1, "Please select a policy type"),
        coverageLevel: z.string().optional(),
        additionalInformation: z.string().optional()
      });
      
      // Validate form data
      const validatedData = contactSchema.parse({
        fullName: submissionData.fullName,
        phoneNumber: submissionData.phoneNumber,
        emailAddress: submissionData.emailAddress,
        policyType: submissionData.policyType,
        coverageLevel: submissionData.coverageLevel,
        additionalInformation: submissionData.additionalInformation
      });
      
      // Log the submission (Firebase will be configured later)
      console.log('✅ Contact form submission received and validated:');
      console.log('Contact Data:', validatedData);
      console.log('Files uploaded:', documentUrls.length, 'documents');
      if (documentUrls.length > 0) {
        console.log('Document URLs:', documentUrls);
      }
      
      // TODO: Enable Firestore saving after configuring security rules
      const docRef = { id: `temp_${Date.now()}` };
      
      res.json({ 
        success: true, 
        message: "Contact form submitted successfully!",
        submissionId: docRef.id 
      });
    } catch (error) {
      console.error('Contact form submission error:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Validation error", 
          errors: error.errors 
        });
      } else {
        res.status(500).json({ 
          success: false, 
          message: "Failed to submit contact form" 
        });
      }
    }
  });

  // Get all contact submissions from Firestore (for admin purposes)
  app.get("/api/contact", async (req, res) => {
    try {
      const contactSubmissions = collection(adminDb, 'contact_submissions');
      const q = query(contactSubmissions, orderBy('submittedAt', 'desc'));
      const snapshot = await getDocs(q);
      
      const submissions = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      res.json(submissions);
    } catch (error) {
      console.error('Error fetching contact submissions:', error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to retrieve contact submissions" 
      });
    }
  });

  // Upload image to Firebase Storage
  app.post("/api/upload-image", upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No image file uploaded' });
      }

      const file = req.file;
      const fileName = `images/${Date.now()}_${uuidv4()}.${file.originalname.split('.').pop()}`;
      const storageRef = ref(adminStorage, fileName);
      
      const uploadResult = await uploadBytes(storageRef, file.buffer, {
        contentType: file.mimetype,
        customMetadata: {
          originalName: file.originalname
        }
      });
      
      const publicUrl = await getDownloadURL(uploadResult.ref);
      
      // Save image reference to Firestore
      const uploadedImages = collection(adminDb, 'uploaded_images');
      await addDoc(uploadedImages, {
        url: publicUrl,
        path: fileName,
        uploadedAt: Timestamp.fromDate(new Date()),
        originalName: file.originalname
      });
      
      res.json({
        success: true,
        url: publicUrl,
        fileName: fileName
      });
    } catch (error) {
      console.error('Image upload error:', error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to upload image" 
      });
    }
  });

  // Get all uploaded images (for admin/content management)
  app.get("/api/images", async (req, res) => {
    try {
      const uploadedImages = collection(adminDb, 'uploaded_images');
      const q = query(uploadedImages, orderBy('uploadedAt', 'desc'));
      const snapshot = await getDocs(q);
      
      const images = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      res.json(images);
    } catch (error) {
      console.error('Error fetching images:', error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to retrieve images" 
      });
    }
  });

  // Get carousel images configuration
  app.get("/api/carousel-images", async (req, res) => {
    try {
      const images = await ImageManager.getCarouselImages();
      res.json(images || { carouselImages: {} });
    } catch (error) {
      console.error('Error fetching carousel images:', error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to retrieve carousel images" 
      });
    }
  });

  // Update carousel image
  app.post("/api/carousel-images/:type", upload.single('image'), async (req, res) => {
    try {
      const insuranceType = req.params.type as any;
      const validTypes = ['auto', 'home', 'life', 'health', 'commercial'];
      
      if (!validTypes.includes(insuranceType)) {
        return res.status(400).json({ error: 'Invalid insurance type' });
      }

      if (!req.file) {
        return res.status(400).json({ error: 'No image file uploaded' });
      }

      // Upload to Firebase Storage
      const publicUrl = await ImageManager.uploadCarouselImage(
        req.file.buffer, 
        req.file.originalname, 
        req.file.mimetype
      );
      
      // Update in Firestore
      await ImageManager.updateCarouselImage(insuranceType, publicUrl);
      
      res.json({
        success: true,
        url: publicUrl,
        type: insuranceType
      });
    } catch (error) {
      console.error('Carousel image upload error:', error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to upload carousel image" 
      });
    }
  });

  // Static image endpoints for server-side rendered images (excluding carousel)
  app.get("/api/images/hero-bg", (req, res) => {
    const imageUrl = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&h=1080';
    res.redirect(imageUrl);
  });

  app.get("/api/images/about-team", (req, res) => {
    const imageUrl = 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=600';
    res.redirect(imageUrl);
  });

  app.get("/api/images/auto-consultation", (req, res) => {
    const imageUrl = 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=600';
    res.redirect(imageUrl);
  });

  app.get("/api/images/commercial-building", (req, res) => {
    const imageUrl = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=600';
    res.redirect(imageUrl);
  });

  app.get("/api/images/health-consultation", (req, res) => {
    const imageUrl = 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=600';
    res.redirect(imageUrl);
  });

  app.get("/api/images/home-exterior", (req, res) => {
    const imageUrl = 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=600';
    res.redirect(imageUrl);
  });

  app.get("/api/images/life-family", (req, res) => {
    const imageUrl = 'https://images.unsplash.com/photo-1511895426328-dc8714191300?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=600';
    res.redirect(imageUrl);
  });

  // Strategic Suggestions API endpoints
  app.get("/api/suggestions", async (req, res) => {
    try {
      const q = query(
        collection(adminDb, 'strategic_suggestions'),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const suggestions: any[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        suggestions.push({
          id: doc.id,
          title: data.title,
          description: data.description,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt ? data.updatedAt.toDate() : undefined
        });
      });

      res.json(suggestions);
    } catch (error) {
      console.error('Error getting suggestions:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to retrieve suggestions' 
      });
    }
  });

  app.post("/api/suggestions", async (req, res) => {
    try {
      const suggestionSchema = z.object({
        title: z.string().min(1, "Title is required"),
        description: z.string().optional().default('')
      });

      const validatedData = suggestionSchema.parse(req.body);

      const docRef = await addDoc(collection(adminDb, 'strategic_suggestions'), {
        title: validatedData.title,
        description: validatedData.description,
        createdAt: Timestamp.fromDate(new Date())
      });

      res.json({ 
        success: true, 
        id: docRef.id,
        message: 'Suggestion added successfully' 
      });
    } catch (error) {
      console.error('Error adding suggestion:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: 'Validation error',
          errors: error.errors 
        });
      } else {
        res.status(500).json({ 
          success: false, 
          message: 'Failed to add suggestion' 
        });
      }
    }
  });

  app.patch("/api/suggestions/:id", async (req, res) => {
    try {
      const { id } = req.params;
      
      const updateSchema = z.object({
        title: z.string().min(1).optional(),
        description: z.string().optional()
      });

      const validatedData = updateSchema.parse(req.body);

      const { updateDoc, doc } = await import('firebase/firestore');
      const docRef = doc(adminDb, 'strategic_suggestions', id);
      
      await updateDoc(docRef, {
        ...validatedData,
        updatedAt: Timestamp.fromDate(new Date())
      });

      res.json({ 
        success: true, 
        message: 'Suggestion updated successfully' 
      });
    } catch (error) {
      console.error('Error updating suggestion:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: 'Validation error',
          errors: error.errors 
        });
      } else {
        res.status(500).json({ 
          success: false, 
          message: 'Failed to update suggestion' 
        });
      }
    }
  });

  app.delete("/api/suggestions/:id", async (req, res) => {
    try {
      const { id } = req.params;
      
      const { deleteDoc, doc } = await import('firebase/firestore');
      const docRef = doc(adminDb, 'strategic_suggestions', id);
      
      await deleteDoc(docRef);

      res.json({ 
        success: true, 
        message: 'Suggestion deleted successfully' 
      });
    } catch (error) {
      console.error('Error deleting suggestion:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to delete suggestion' 
      });
    }
  });

  // Policy Application endpoints
  
  // Submit policy application from chatbot
  app.post("/api/policy-applications", async (req, res) => {
    try {
      const policyApplicationSchema = z.object({
        applicantName: z.string().min(2, "Name must be at least 2 characters"),
        email: z.string().email("Please enter a valid email address"),
        phone: z.string().min(10, "Please enter a valid phone number"),
        policyType: z.enum(['auto', 'home', 'life'], {
          errorMap: () => ({ message: "Please select a valid policy type" })
        }),
        preferredContactMethod: z.enum(['phone', 'email', 'text']).optional(),
        coreDetails: z.string().optional(), // JSON string
        autoDetails: z.string().optional(), // JSON string
        homeDetails: z.string().optional(), // JSON string
        lifeDetails: z.string().optional(), // JSON string
        documents: z.array(z.string()).optional(),
        notes: z.string().optional()
      });

      const validatedData = policyApplicationSchema.parse(req.body);

      // Generate a temporary ID for demo purposes
      const tempId = `app_${Date.now()}_${Math.random().toString(36).substring(7)}`;

      // Log the application (for demo/development)
      console.log('✅ Policy application submitted (logged):');
      console.log('Application ID:', tempId);
      console.log('Policy Type:', validatedData.policyType);
      console.log('Applicant:', validatedData.applicantName);
      console.log('Email:', validatedData.email);
      console.log('Phone:', validatedData.phone);
      console.log('Contact Method:', validatedData.preferredContactMethod);
      console.log('Documents:', validatedData.documents?.length || 0, 'uploaded');
      
      // Parse and log policy-specific details
      if (validatedData.autoDetails) {
        console.log('Auto Details:', JSON.parse(validatedData.autoDetails));
      }
      if (validatedData.homeDetails) {
        console.log('Home Details:', JSON.parse(validatedData.homeDetails));
      }
      if (validatedData.lifeDetails) {
        console.log('Life Details:', JSON.parse(validatedData.lifeDetails));
      }

      // TODO: Enable Firestore saving after configuring security rules
      // For now, applications are logged to console for development/demo
      // try {
      //   const docRef = await addDoc(collection(adminDb, 'policy_applications'), {
      //     ...validatedData,
      //     status: 'pending',
      //     createdAt: Timestamp.fromDate(new Date())
      //   });
      //   tempId = docRef.id;
      // } catch (firebaseError) {
      //   console.warn('Firestore write failed (using temp ID):', firebaseError.message);
      // }

      res.json({
        success: true,
        message: "Policy application submitted successfully!",
        applicationId: tempId
      });
    } catch (error) {
      console.error('Policy application submission error:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.errors
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Failed to submit policy application"
        });
      }
    }
  });

  // Get all policy applications (for admin purposes)
  app.get("/api/policy-applications", async (req, res) => {
    try {
      const policyApplications = collection(adminDb, 'policy_applications');
      const q = query(policyApplications, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);

      const applications = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      res.json(applications);
    } catch (error) {
      console.error('Error fetching policy applications:', error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve policy applications"
      });
    }
  });

  // Upload policy document (used by chatbot during conversation)
  app.post("/api/policy-documents", upload.single('document'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ 
          success: false,
          error: 'No document file uploaded' 
        });
      }

      const file = req.file;
      const fileName = `policy-documents/${Date.now()}_${uuidv4()}.${file.originalname.split('.').pop()}`;
      const storageRef = ref(adminStorage, fileName);

      const uploadResult = await uploadBytes(storageRef, file.buffer, {
        contentType: file.mimetype,
        customMetadata: {
          originalName: file.originalname
        }
      });

      const publicUrl = await getDownloadURL(uploadResult.ref);

      console.log('✅ Policy document uploaded:', {
        fileName: file.originalname,
        size: file.size,
        url: publicUrl
      });

      res.json({
        success: true,
        url: publicUrl,
        storagePath: fileName,
        originalName: file.originalname,
        size: file.size
      });
    } catch (error) {
      console.error('Policy document upload error:', error);
      res.status(500).json({
        success: false,
        message: "Failed to upload document"
      });
    }
  });

  // Object Storage routes for policy applications (referenced from blueprint:javascript_object_storage)
  
  // Get presigned URL for object upload
  app.post("/api/objects/upload", async (req, res) => {
    try {
      const objectStorageService = new ObjectStorageService();
      const uploadURL = await objectStorageService.getObjectEntityUploadURL();
      res.json({ uploadURL });
    } catch (error) {
      console.error('Error getting upload URL:', error);
      res.status(500).json({ error: "Failed to get upload URL" });
    }
  });

  // Serve uploaded objects (public access for policy documents)
  app.get("/objects/:objectPath(*)", async (req, res) => {
    try {
      const objectStorageService = new ObjectStorageService();
      const objectFile = await objectStorageService.getObjectEntityFile(req.path);
      objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      console.error("Error accessing object:", error);
      if (error instanceof ObjectNotFoundError) {
        return res.sendStatus(404);
      }
      return res.sendStatus(500);
    }
  });

  // Reset carousel images to use new different images
  ImageManager.resetCarouselImages().catch(err => 
    console.error('Failed to reset carousel images:', err)
  );

  const httpServer = createServer(app);
  return httpServer;
}
