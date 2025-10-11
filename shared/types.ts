// Shared TypeScript types for Firebase integration

export interface ContactFormData {
  id?: string;
  fullName: string;
  phoneNumber: string;
  emailAddress: string;
  policyType: string;
  coverageLevel: string;
  additionalInformation?: string;
  attachedDocuments?: string[]; // Firebase Storage URLs
  submittedAt: Date;
  status: 'pending' | 'reviewed' | 'contacted' | 'completed';
}

export interface FirebaseImageUrl {
  url: string;
  path: string;
  uploadedAt: Date;
}

export interface InsurancePageImages {
  heroImage?: string;
  carouselImages: {
    auto: string;
    home: string;
    life: string;
    health: string;
    commercial: string;
  };
  aboutImages?: string[];
  testimonialImages?: string[];
}

export interface StrategicSuggestion {
  id?: string;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt?: Date;
}