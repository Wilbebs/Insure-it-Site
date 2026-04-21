import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { storage } from "./pgStorage"; // CHANGED: Use PostgreSQL storage
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { PutObjectCommand } from '@aws-sdk/client-s3'; // NEW: AWS S3 SDK
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'; // Presigned URL generator
import { s3Client, S3_BUCKET } from './s3Client'; // NEW: S3 client
import { InvokeCommand } from '@aws-sdk/client-lambda';
import { lambdaClient, LAMBDA_NOTIFICATION_FUNCTION } from './lambdaClient';
import { pool } from './db';
import {
  requireAdmin,
  contactLimiter,
  uploadLimiter,
  ALLOWED_UPLOAD_MIMES,
  safeExtensionForMime,
  isSafeDocumentKey,
  ALLOWED_DOCUMENT_PREFIX,
} from './security';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB per file
    files: 5,
    fields: 20,
  },
  fileFilter: (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (ALLOWED_UPLOAD_MIMES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOC, DOCX, JPG, and PNG files are allowed.'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {

  // Contact form submission endpoint
  app.post("/api/contact", contactLimiter, upload.array('documents', 5), async (req, res) => {
    try {
      const files = req.files as Express.Multer.File[];
      const documentUrls: string[] = [];

      // CHANGED: Upload files to AWS S3
      if (files && files.length > 0) {
        for (const file of files) {
          try {
            // Generate unique filename — derive extension from mimetype, NOT from
            // user-supplied originalname (which can contain anything).
            const fileExtension = safeExtensionForMime(file.mimetype);
            const uniqueFileName = `${uuidv4()}.${fileExtension}`;
            const s3Key = `${ALLOWED_DOCUMENT_PREFIX}${uniqueFileName}`;

            // Upload to S3
            await s3Client.send(new PutObjectCommand({
              Bucket: S3_BUCKET,
              Key: s3Key,
              Body: file.buffer,
              ContentType: file.mimetype,
            }));

            documentUrls.push(s3Key);
            console.log(`✅ Uploaded file to S3 (${file.mimetype}, ${file.size} bytes)`);
          } catch (uploadError) {
            console.error(`Failed to upload file (mime=${file.mimetype}):`, uploadError);
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

      console.log(`✅ Contact form submission received and validated (policy=${validatedData.policyType}, files=${documentUrls.length})`);

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

      // Trigger Lambda notification (non-blocking — failure here must NOT
      // break the customer's submission; we already saved to PostgreSQL).
      try {
        // Send only validated fields to Lambda — never raw req.body, which
        // could contain attacker-controlled extra fields.
        const payload = {
          submissionId: submission.id,
          formData: validatedData,
          documentUrls,
        };
        await lambdaClient.send(new InvokeCommand({
          FunctionName: LAMBDA_NOTIFICATION_FUNCTION,
          InvocationType: 'Event', // async — fire-and-forget, no response wait
          Payload: Buffer.from(JSON.stringify(payload)),
        }));
        console.log(`✅ Lambda notification triggered: ${LAMBDA_NOTIFICATION_FUNCTION}`);
      } catch (lambdaError) {
        console.error('⚠️  Lambda notification failed (submission still saved):', lambdaError);
      }

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

  // Get all contact submissions (admin only)
  app.get("/api/contact", requireAdmin, async (req, res) => {
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

  app.get("/api/feature-requests", async (req, res) => {
    try {
      const result = await pool.query(
        'SELECT * FROM feature_requests ORDER BY created_at DESC'
      );
      res.json({ success: true, data: result.rows });
    } catch (error) {
      console.error('Error fetching feature requests:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch requests' });
    }
  });

  // POST new feature request for plans page
  app.post("/api/feature-requests", contactLimiter, async (req, res) => {
    try {
      const featureRequestSchema = z.object({
        title: z.string().min(1).max(200),
        description: z.string().max(5000).optional().default(''),
        priority: z.enum(['low', 'medium', 'high']).optional().default('medium'),
      });
      const { title, description, priority } = featureRequestSchema.parse(req.body);

      const result = await pool.query(
        'INSERT INTO feature_requests (title, description, priority) VALUES ($1, $2, $3) RETURNING *',
        [title, description, priority]
      );

      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      console.error('Error creating feature request:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ success: false, message: 'Validation error', errors: error.errors });
      }
      res.status(500).json({ success: false, message: 'Failed to create request' });
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

  // Update carousel image (admin only)
  app.post("/api/carousel-images/:type", requireAdmin, async (req, res) => {
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

  // Strategic Suggestions API endpoints (admin only)
  app.get("/api/suggestions", requireAdmin, async (req, res) => {
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

  app.post("/api/suggestions", requireAdmin, async (req, res) => {
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

  app.delete("/api/suggestions/:id", requireAdmin, async (req, res) => {
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

  // Submit policy application from chatbot (rate-limited)
  app.post("/api/policy-applications", contactLimiter, async (req, res) => {
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
        autoDetails: z.string().optional(),
        homeDetails: z.string().optional(),
        lifeDetails: z.string().optional(),
        commercialDetails: z.string().optional(),
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

  // Get all policy applications (admin only)
  app.get("/api/policy-applications", requireAdmin, async (req, res) => {
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

  // S3 file download endpoint — admin only, locked to contact-documents/ prefix,
  // forced as attachment so the browser cannot inline-render anything malicious.
  app.get("/api/documents/:s3Key(*)", requireAdmin, async (req, res) => {
    try {
      const { GetObjectCommand } = await import('@aws-sdk/client-s3');
      const s3Key = req.params.s3Key;

      if (!isSafeDocumentKey(s3Key)) {
        return res.status(400).json({ error: "Invalid document key" });
      }

      const command = new GetObjectCommand({
        Bucket: S3_BUCKET,
        Key: s3Key,
      });

      const response = await s3Client.send(command);

      const safeFilename = s3Key.split('/').pop() || 'document';

      res.set({
        'Content-Type': 'application/octet-stream',
        'Content-Length': response.ContentLength as any,
        'Content-Disposition': `attachment; filename="${safeFilename.replace(/[^A-Za-z0-9._-]/g, '_')}"`,
        'X-Content-Type-Options': 'nosniff',
      });

      // @ts-ignore - Stream the file
      response.Body.pipe(res);
    } catch (error) {
      console.error("Error downloading from S3:", error);
      res.status(404).json({ error: "File not found" });
    }
  });

  // Video streaming endpoint — supports HTTP range requests for seek/buffering
  app.get("/api/videos/:videoName", async (req, res) => {
    try {
      const { GetObjectCommand, HeadObjectCommand } = await import('@aws-sdk/client-s3');
      const s3Key = `video-assets/${req.params.videoName}`;
      const rangeHeader = req.headers.range;

      // Get file size first
      const headCmd = new HeadObjectCommand({ Bucket: S3_BUCKET, Key: s3Key });
      const headRes = await s3Client.send(headCmd);
      const fileSize = headRes.ContentLength ?? 0;

      if (rangeHeader) {
        const [startStr, endStr] = rangeHeader.replace(/bytes=/, "").split("-");
        const start = parseInt(startStr, 10);
        const end = endStr ? parseInt(endStr, 10) : fileSize - 1;
        const chunkSize = end - start + 1;

        const cmd = new GetObjectCommand({
          Bucket: S3_BUCKET,
          Key: s3Key,
          Range: `bytes=${start}-${end}`,
        });
        const s3Res = await s3Client.send(cmd);

        res.writeHead(206, {
          "Content-Range": `bytes ${start}-${end}/${fileSize}`,
          "Accept-Ranges": "bytes",
          "Content-Length": chunkSize,
          "Content-Type": "video/mp4",
        });
        // @ts-ignore
        s3Res.Body.pipe(res);
      } else {
        const cmd = new GetObjectCommand({ Bucket: S3_BUCKET, Key: s3Key });
        const s3Res = await s3Client.send(cmd);

        res.writeHead(200, {
          "Content-Length": fileSize,
          "Content-Type": "video/mp4",
          "Accept-Ranges": "bytes",
        });
        // @ts-ignore
        s3Res.Body.pipe(res);
      }
    } catch (error) {
      console.error("Error streaming video from S3:", error);
      res.status(404).json({ error: "Video not found" });
    }
  });

  // Placeholder images endpoint for insurance pages
  app.get("/api/images/:imageName", (req, res) => {
    const { imageName } = req.params;

    // Map image names to stock images from Unsplash
    const imageMap: Record<string, string> = {
      'auto-consultation': 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&q=80',
      'home-exterior': 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80',
      'life-family': 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&q=80',
      'health-consultation': 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80',
      'commercial-building': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80'
    };

    const imageUrl = imageMap[imageName];

    if (imageUrl) {
      // Redirect to the stock image
      res.redirect(imageUrl);
    } else {
      // Return a simple SVG placeholder
      const svg = `
        <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
          <rect width="800" height="600" fill="#e5e7eb"/>
          <text x="50%" y="50%" font-family="Arial" font-size="24" fill="#6b7280" text-anchor="middle" dominant-baseline="middle">
            Insurance Image Placeholder
          </text>
        </svg>
      `;
      res.setHeader('Content-Type', 'image/svg+xml');
      res.send(svg);
    }
  });

  // Presigned S3 upload URL — used by Liz Bot file uploader for direct browser-to-S3 uploads.
  // Rate-limited; only allowed mimetypes get a presigned URL; extension derived from mimetype.
  app.post("/api/objects/upload", uploadLimiter, async (req, res) => {
    try {
      const uploadSchema = z.object({
        fileName: z.string().min(1).max(255).optional(),
        contentType: z.string().min(1).max(100).refine(
          (v) => ALLOWED_UPLOAD_MIMES.includes(v),
          { message: "Unsupported content type" }
        ),
      });

      const parsed = uploadSchema.parse(req.body);

      // Derive extension from validated mimetype, never from user-supplied fileName
      const ext = safeExtensionForMime(parsed.contentType);
      const s3Key = `${ALLOWED_DOCUMENT_PREFIX}${uuidv4()}.${ext}`;

      const command = new PutObjectCommand({
        Bucket: S3_BUCKET,
        Key: s3Key,
        ContentType: parsed.contentType,
      });

      // URL is valid for 5 minutes
      const uploadURL = await getSignedUrl(s3Client, command, { expiresIn: 300 });

      console.log(`✅ Generated presigned upload URL (mime=${parsed.contentType})`);

      res.json({ success: true, uploadURL, s3Key });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ success: false, message: "Validation error", errors: error.errors });
      }
      console.error("Error generating presigned URL:", error);
      res.status(500).json({ success: false, message: "Failed to generate upload URL" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}