import { randomUUID } from 'crypto';
import type { User, InsertUser, ContactSubmission, InsertContactSubmission } from "@shared/schema";
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
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;
  getContactSubmissions(): Promise<ContactSubmission[]>;
  createPolicyApplication(application: Omit<PolicyApplication, 'id' | 'submittedAt'>): Promise<PolicyApplication>;
  getPolicyApplications(): Promise<PolicyApplication[]>;
  getCarouselImages(): Promise<InsurancePageImages>;
  updateCarouselImage(insuranceType: string, imageUrl: string): Promise<void>;
  createStrategicSuggestion(suggestion: Omit<StrategicSuggestion, 'id' | 'createdAt'>): Promise<StrategicSuggestion>;
  getStrategicSuggestions(): Promise<StrategicSuggestion[]>;
  deleteStrategicSuggestion(id: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private contactSubmissions: ContactSubmission[] = [];
  private policyApplications: PolicyApplication[] = [];
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
    const newUser: User = { id, ...user };
    this.users.set(id, newUser);
    return newUser;
  }

  async createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission> {
    const id = randomUUID();
    const newSubmission: ContactSubmission = {
      id,
      name: submission.name,
      email: submission.email,
      phone: submission.phone,
      insuranceType: submission.insuranceType,
      coverageLevel: submission.coverageLevel ?? null,
      message: submission.message ?? null,
      documents: submission.documents ?? null,
      submittedAt: new Date()
    };
    this.contactSubmissions.push(newSubmission);
    console.log('✅ Contact submission stored:', id);
    return newSubmission;
  }

  async getContactSubmissions(): Promise<ContactSubmission[]> {
    return [...this.contactSubmissions].sort((a, b) => 
      new Date(b.submittedAt || 0).getTime() - new Date(a.submittedAt || 0).getTime()
    );
  }

  async createPolicyApplication(application: Omit<PolicyApplication, 'id' | 'submittedAt'>): Promise<PolicyApplication> {
    const id = randomUUID();
    const newApplication: PolicyApplication = {
      id,
      ...application,
      submittedAt: new Date()
    };
    this.policyApplications.push(newApplication);
    console.log('✅ Policy application stored:', id);
    return newApplication;
  }

  async getPolicyApplications(): Promise<PolicyApplication[]> {
    return [...this.policyApplications].sort((a, b) => 
      new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );
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
    const newSuggestion: StrategicSuggestion = {
      ...suggestion,
      id,
      createdAt: new Date()
    };
    this.strategicSuggestions.set(id, newSuggestion);
    return newSuggestion;
  }

  async getStrategicSuggestions(): Promise<StrategicSuggestion[]> {
    return Array.from(this.strategicSuggestions.values());
  }

  async deleteStrategicSuggestion(id: string): Promise<void> {
    this.strategicSuggestions.delete(id);
  }
}

export const storage = new MemStorage();
