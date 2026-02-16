import { pool } from './db';
import { randomUUID } from 'crypto';
import type { User, InsertUser, ContactSubmission, InsertContactSubmission } from "@shared/schema";
import { InsurancePageImages, StrategicSuggestion } from "@shared/types";

// Define PolicyApplication interface here (was in storage.ts)
export interface PolicyApplication {
  id: string;
  applicantName: string;
  email: string;
  phone: string;
  policyType: string;
  preferredContactMethod: string;
  coreDetails: string;
  autoDetails?: string;
  homeDetails?: string;
  lifeDetails?: string;
  documents: string[];
  notes?: string;
  submittedAt: Date;
}

// Define IStorage interface here (was in storage.ts)
export interface IStorage {
  // User management
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Contact submissions
  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;
  getContactSubmissions(): Promise<ContactSubmission[]>;
  
  // Policy applications
  createPolicyApplication(application: Omit<PolicyApplication, 'id' | 'submittedAt'>): Promise<PolicyApplication>;
  getPolicyApplications(): Promise<PolicyApplication[]>;
  
  // Carousel images
  getCarouselImages(): Promise<InsurancePageImages>;
  updateCarouselImage(insuranceType: string, imageUrl: string): Promise<void>;
  
  // Strategic suggestions
  createStrategicSuggestion(suggestion: Omit<StrategicSuggestion, 'id' | 'createdAt'>): Promise<StrategicSuggestion>;
  getStrategicSuggestions(): Promise<StrategicSuggestion[]>;
  deleteStrategicSuggestion(id: string): Promise<void>;
}

export class PostgresStorage implements IStorage {
  // User management
  async getUser(id: string): Promise<User | undefined> {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    return result.rows[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = randomUUID();
    const result = await pool.query(
      'INSERT INTO users (id, username, password) VALUES ($1, $2, $3) RETURNING *',
      [id, user.username, user.password]
    );
    return result.rows[0];
  }

  // Contact submissions
  async createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Check if contact exists
      let contactResult = await client.query(
        'SELECT id FROM contacts WHERE email = $1',
        [submission.email]
      );

      let contactId: string;

      if (contactResult.rows.length === 0) {
        // Create new contact
        const newContactResult = await client.query(
          `INSERT INTO contacts (email, full_name, phone) 
           VALUES ($1, $2, $3) 
           RETURNING id`,
          [submission.email, submission.name, submission.phone]
        );
        contactId = newContactResult.rows[0].id;
      } else {
        contactId = contactResult.rows[0].id;
      }

      // Create submission
      const submissionResult = await client.query(
        `INSERT INTO contact_submissions (contact_id, policy_type, coverage_level, message)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [contactId, submission.insuranceType, submission.coverageLevel, submission.message]
      );

      const newSubmission = submissionResult.rows[0];

      // Store documents if any
      if (submission.documents) {
        const documentPaths = submission.documents.split(',');
        for (const docPath of documentPaths) {
          await client.query(
            `INSERT INTO documents (submission_id, file_name, s3_bucket, s3_key, file_type)
             VALUES ($1, $2, $3, $4, $5)`,
            [
              newSubmission.id,
              docPath.split('/').pop(),
              process.env.AWS_S3_BUCKET,
              docPath,
              'application/octet-stream'
            ]
          );
        }
      }

      await client.query('COMMIT');

      return {
        id: newSubmission.id,
        name: submission.name,
        email: submission.email,
        phone: submission.phone,
        insuranceType: submission.insuranceType,
        coverageLevel: submission.coverageLevel ?? null,
        message: submission.message ?? null,
        documents: submission.documents ?? null,
        submittedAt: newSubmission.submitted_at
      };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async getContactSubmissions(): Promise<ContactSubmission[]> {
    const result = await pool.query(`
      SELECT 
        cs.id,
        c.full_name as name,
        c.email,
        c.phone,
        cs.policy_type as "insuranceType",
        cs.coverage_level as "coverageLevel",
        cs.message,
        cs.submitted_at as "submittedAt",
        STRING_AGG(d.s3_key, ',') as documents
      FROM contact_submissions cs
      JOIN contacts c ON cs.contact_id = c.id
      LEFT JOIN documents d ON cs.id = d.submission_id
      GROUP BY cs.id, c.full_name, c.email, c.phone, cs.policy_type, cs.coverage_level, cs.message, cs.submitted_at
      ORDER BY cs.submitted_at DESC
    `);
    return result.rows;
  }

  // Policy applications
  async createPolicyApplication(application: Omit<PolicyApplication, 'id' | 'submittedAt'>): Promise<PolicyApplication> {
    const id = randomUUID();
    const result = await pool.query(
      `INSERT INTO policy_applications 
       (id, applicant_name, email, phone, policy_type, preferred_contact_method, core_details, auto_details, home_details, life_details, commercial_details, documents, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
       RETURNING *`,
      [
        id,
        application.applicantName,
        application.email,
        application.phone,
        application.policyType,
        application.preferredContactMethod,
        application.coreDetails,
        application.autoDetails,
        application.homeDetails,
        application.lifeDetails,
        
        JSON.stringify(application.documents),
        application.notes
      ]
    );
    return {
      ...result.rows[0],
      documents: JSON.parse(result.rows[0].documents || '[]'),
      submittedAt: result.rows[0].submitted_at
    };
  }

  async getPolicyApplications(): Promise<PolicyApplication[]> {
    const result = await pool.query('SELECT * FROM policy_applications ORDER BY submitted_at DESC');
    return result.rows.map(row => ({
      ...row,
      documents: JSON.parse(row.documents || '[]'),
      submittedAt: row.submitted_at
    }));
  }

  // Carousel images (keep in memory for now)
  private carouselImages: InsurancePageImages = {
    carouselImages: {
      auto: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      home: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      life: "https://images.unsplash.com/photo-1609220136736-443140cffec6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      health: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      commercial: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    }
  };

  async getCarouselImages(): Promise<InsurancePageImages> {
    return this.carouselImages;
  }

  async updateCarouselImage(insuranceType: string, imageUrl: string): Promise<void> {
    if (this.carouselImages.carouselImages[insuranceType as keyof typeof this.carouselImages.carouselImages]) {
      this.carouselImages.carouselImages[insuranceType as keyof typeof this.carouselImages.carouselImages] = imageUrl;
    }
  }

  // Strategic suggestions (keep in memory for now)
  private strategicSuggestions: Map<string, StrategicSuggestion> = new Map();

  async createStrategicSuggestion(suggestion: Omit<StrategicSuggestion, 'id' | 'createdAt'>): Promise<StrategicSuggestion> {
    const id = randomUUID();
    const strategicSuggestion: StrategicSuggestion = {
      ...suggestion,
      id,
      createdAt: new Date(),
    };
    this.strategicSuggestions.set(id, strategicSuggestion);
    return strategicSuggestion;
  }

  async getStrategicSuggestions(): Promise<StrategicSuggestion[]> {
    return Array.from(this.strategicSuggestions.values());
  }

  async deleteStrategicSuggestion(id: string): Promise<void> {
    this.strategicSuggestions.delete(id);
  }
}

class MemoryStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private contactSubmissions: Map<string, ContactSubmission> = new Map();
  private policyApplications: Map<string, PolicyApplication> = new Map();
  private strategicSuggestions: Map<string, StrategicSuggestion> = new Map();
  private carouselImages: InsurancePageImages = {
    carouselImages: {
      auto: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      home: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      life: "https://images.unsplash.com/photo-1609220136736-443140cffec6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      health: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      commercial: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    }
  };
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(u => u.username === username);
  }
  async createUser(user: InsertUser): Promise<User> {
    const id = randomUUID();
    const newUser: User = { id, username: user.username, password: user.password };
    this.users.set(id, newUser);
    return newUser;
  }
  async createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission> {
    const id = randomUUID();
    const newSubmission: ContactSubmission = {
      id,
      name: submission.name,
      phone: submission.phone,
      email: submission.email,
      insuranceType: submission.insuranceType,
      coverageLevel: submission.coverageLevel || null,
      message: submission.message || null,
      documents: submission.documents || null,
      submittedAt: new Date(),
    };
    this.contactSubmissions.set(id, newSubmission);
    console.log(`[MemStorage] Contact submission saved: ${id}`);
    return newSubmission;
  }
  async getContactSubmissions(): Promise<ContactSubmission[]> {
    return Array.from(this.contactSubmissions.values());
  }
  async createPolicyApplication(application: Omit<PolicyApplication, 'id' | 'submittedAt'>): Promise<PolicyApplication> {
    const id = randomUUID();
    const newApp: PolicyApplication = { ...application, id, submittedAt: new Date() };
    this.policyApplications.set(id, newApp);
    return newApp;
  }
  async getPolicyApplications(): Promise<PolicyApplication[]> {
    return Array.from(this.policyApplications.values());
  }
  async getCarouselImages(): Promise<InsurancePageImages> {
    return this.carouselImages;
  }
  async updateCarouselImage(insuranceType: string, imageUrl: string): Promise<void> {
    if (this.carouselImages.carouselImages[insuranceType as keyof typeof this.carouselImages.carouselImages]) {
      this.carouselImages.carouselImages[insuranceType as keyof typeof this.carouselImages.carouselImages] = imageUrl;
    }
  }
  async createStrategicSuggestion(suggestion: Omit<StrategicSuggestion, 'id' | 'createdAt'>): Promise<StrategicSuggestion> {
    const id = randomUUID();
    const s: StrategicSuggestion = { ...suggestion, id, createdAt: new Date() };
    this.strategicSuggestions.set(id, s);
    return s;
  }
  async getStrategicSuggestions(): Promise<StrategicSuggestion[]> {
    return Array.from(this.strategicSuggestions.values());
  }
  async deleteStrategicSuggestion(id: string): Promise<void> {
    this.strategicSuggestions.delete(id);
  }
}
export const storage: IStorage = new MemoryStorage();