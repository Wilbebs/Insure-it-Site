import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { storage } from "./pgStorage"; // CHANGED: Use PostgreSQL storage
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { PutObjectCommand } from '@aws-sdk/client-s3'; // NEW: AWS S3 SDK
import { s3Client, S3_BUCKET } from './s3Client'; // NEW: S3 client

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
  
  // Contact form submission endpoint
  app.post("/api/contact", upload.array('documents', 5), async (req, res) => {
    try {
      console.log('\n=== FORM SUBMISSION DEBUG ===');
      console.log('Request method:', req.method);
      console.log('Content-Type:', req.get('Content-Type'));
      console.log('Request body:', req.body);
      console.log('============================\n');
      
      const files = req.files as Express.Multer.File[];
      const documentUrls: string[] = [];
      
      // CHANGED: Upload files to AWS S3
      if (files && files.length > 0) {
        for (const file of files) {
          try {
            // Generate unique filename
            const fileExtension = file.originalname.split('.').pop();
            const uniqueFileName = `${uuidv4()}.${fileExtension}`;
            const s3Key = `contact-documents/${uniqueFileName}`;
            
            // Upload to S3
            await s3Client.send(new PutObjectCommand({
              Bucket: S3_BUCKET,
              Key: s3Key,
              Body: file.buffer,
              ContentType: file.mimetype,
            }));
            
            documentUrls.push(s3Key);
            console.log(`✅ Uploaded file to S3: ${s3Key}`);
          } catch (uploadError) {
            console.error(`Failed to upload file ${file.originalname}:`, uploadError);
            // Continue with other files even if one fails
          }
        }
      }

      // Simple validation schema
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
        fullName: req.body.fullName,
        phoneNumber: req.body.phoneNumber,
        emailAddress: req.body.emailAddress,
        policyType: req.body.policyType,
        coverageLevel: req.body.coverageLevel,
        additionalInformation: req.body.additionalInformation
      });
      
      console.log('✅ Contact form submission received and validated:');
      console.log('Contact Data:', validatedData);
      console.log('Files uploaded:', documentUrls.length, 'documents');
      
      // Create submission in storage (now PostgreSQL)
      const submission = await storage.createContactSubmission({
        name: validatedData.fullName,
        email: validatedData.emailAddress,
        phone: validatedData.phoneNumber,
        insuranceType: validatedData.policyType,
        coverageLevel: validatedData.coverageLevel || null,
        message: validatedData.additionalInformation || null,
        documents: documentUrls.length > 0 ? documentUrls.join(',') : null,
      });
      
      res.json({ 
        success: true, 
        message: "Contact form submitted successfully!",
        submissionId: submission.id
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

  // Get all contact submissions (for admin purposes)
  app.get("/api/contact", async (req, res) => {
    try {
      const submissions = await storage.getContactSubmissions();
      res.json(submissions);
    } catch (error) {
      console.error('Error fetching contact submissions:', error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to retrieve contact submissions" 
      });
    }
  });

  // Get carousel images configuration
  app.get("/api/carousel-images", async (req, res) => {
    try {
      const images = await storage.getCarouselImages();
      res.json(images);
    } catch (error) {
      console.error('Error fetching carousel images:', error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to retrieve carousel images" 
      });
    }
  });

  // Update carousel image (placeholder - in production would upload to object storage)
  app.post("/api/carousel-images/:type", async (req, res) => {
    try {
      const insuranceType = req.params.type;
      const validTypes = ['auto', 'home', 'life', 'health', 'commercial'];
      
      if (!validTypes.includes(insuranceType)) {
        return res.status(400).json({ error: 'Invalid insurance type' });
      }

      const { imageUrl } = req.body;
      if (!imageUrl) {
        return res.status(400).json({ error: 'No image URL provided' });
      }

      await storage.updateCarouselImage(insuranceType, imageUrl);
      
      res.json({
        success: true,
        url: imageUrl,
        type: insuranceType
      });
    } catch (error) {
      console.error('Carousel image update error:', error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to update carousel image" 
      });
    }
  });

  // Strategic Suggestions API endpoints
  app.get("/api/suggestions", async (req, res) => {
    try {
      const suggestions = await storage.getStrategicSuggestions();
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

      const suggestion = await storage.createStrategicSuggestion({
        title: validatedData.title,
        description: validatedData.description
      });

      res.json({ 
        success: true, 
        id: suggestion.id,
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

  app.delete("/api/suggestions/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteStrategicSuggestion(id);

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
        policyType: z.enum(['auto', 'home', 'life', 'health', 'commercial'], {
          errorMap: () => ({ message: "Please select a valid policy type" })
        }),
        preferredContactMethod: z.string().optional(),
        coreDetails: z.string().optional(), // JSON string
        autoDetails: z.string().optional(), // JSON string
        homeDetails: z.string().optional(), // JSON string
        lifeDetails: z.string().optional(), // JSON string
        documents: z.array(z.string()).optional(),
        notes: z.string().optional()
      });

      const validatedData = policyApplicationSchema.parse(req.body);

      const application = await storage.createPolicyApplication({
        applicantName: validatedData.applicantName,
        email: validatedData.email,
        phone: validatedData.phone,
        policyType: validatedData.policyType,
        preferredContactMethod: validatedData.preferredContactMethod || 'email',
        coreDetails: validatedData.coreDetails || '{}',
        autoDetails: validatedData.autoDetails,
        homeDetails: validatedData.homeDetails,
        lifeDetails: validatedData.lifeDetails,
        documents: validatedData.documents || [],
        notes: validatedData.notes
      });

      console.log('✅ Policy application submitted:');
      console.log('Application ID:', application.id);
      console.log('Policy Type:', application.policyType);
      console.log('Applicant:', application.applicantName);

      res.json({
        success: true,
        message: "Policy application submitted successfully!",
        applicationId: application.id
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
      const applications = await storage.getPolicyApplications();
      res.json(applications);
    } catch (error) {
      console.error('Error fetching policy applications:', error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve policy applications"
      });
    }
  });

  // NEW: S3 file download endpoint
  app.get("/api/documents/:s3Key(*)", async (req, res) => {
    try {
      const { GetObjectCommand } = await import('@aws-sdk/client-s3');
      const s3Key = req.params.s3Key;
      
      const command = new GetObjectCommand({
        Bucket: S3_BUCKET,
        Key: s3Key,
      });
      
      const response = await s3Client.send(command);
      
      res.set({
        'Content-Type': response.ContentType || 'application/octet-stream',
        'Content-Length': response.ContentLength,
      });
      
      // @ts-ignore - Stream the file
      response.Body.pipe(res);
    } catch (error) {
      console.error("Error downloading from S3:", error);
      res.status(404).json({ error: "File not found" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}