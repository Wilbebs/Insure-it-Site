import { type User, type InsertUser, type ContactSubmission, type InsertContactSubmission } from "@shared/schema";
import { randomUUID } from "crypto";
import { InsurancePageImages, StrategicSuggestion } from "@shared/types";

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

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private contactSubmissions: Map<string, ContactSubmission>;
  private policyApplications: Map<string, PolicyApplication>;
  private strategicSuggestions: Map<string, StrategicSuggestion>;
  private carouselImages: InsurancePageImages;

  constructor() {
    this.users = new Map();
    this.contactSubmissions = new Map();
    this.policyApplications = new Map();
    this.strategicSuggestions = new Map();
    
    // Initialize with default carousel images
    this.carouselImages = {
      carouselImages: {
        auto: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        home: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        life: "https://images.unsplash.com/photo-1609220136736-443140cffec6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        health: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        commercial: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
      }
    };
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createContactSubmission(insertSubmission: InsertContactSubmission): Promise<ContactSubmission> {
    const id = randomUUID();
    const submission: ContactSubmission = {
      ...insertSubmission,
      documents: insertSubmission.documents ?? null,
      coverageLevel: insertSubmission.coverageLevel ?? null,
      message: insertSubmission.message ?? null,
      id,
      submittedAt: new Date(),
    };
    this.contactSubmissions.set(id, submission);
    return submission;
  }

  async getContactSubmissions(): Promise<ContactSubmission[]> {
    return Array.from(this.contactSubmissions.values());
  }

  async createPolicyApplication(application: Omit<PolicyApplication, 'id' | 'submittedAt'>): Promise<PolicyApplication> {
    const id = randomUUID();
    const policyApp: PolicyApplication = {
      ...application,
      id,
      submittedAt: new Date(),
    };
    this.policyApplications.set(id, policyApp);
    return policyApp;
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

export const storage = new MemStorage();
