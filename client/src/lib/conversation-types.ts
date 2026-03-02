import type { AutoDetails, HomeDetails, LifeDetails, CommercialDetails, VehicleInfo, DriverInfo } from "@shared/schema";

// Conversation states for the state machine
export type ConversationState =
  | 'idle'
  | 'conversational'
  | 'policySelection'
  | 'collectingCore'
  | 'collectingPolicySpecific'
  | 'collectingDocuments'
  | 'reviewing'
  | 'submitted';

// Policy types
export type PolicyType = 'auto' | 'home' | 'life' | 'commercial';

// Contact method preferences
export type ContactMethod = 'phone' | 'email' | 'text';

// Core applicant information (collected for all policy types)
export interface CoreApplicantInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  zipCode: string;
}

// Conversation context that persists throughout the flow
export interface ConversationContext {
  state: ConversationState;
  policyTypes: PolicyType[];
  coreInfo: Partial<CoreApplicantInfo>;
  autoDetails: Partial<AutoDetails>;
  homeDetails: Partial<HomeDetails>;
  lifeDetails: Partial<LifeDetails>;
  commercialDetails: Partial<CommercialDetails>;
  documents: string[];
  notes: string;
  currentQuestionIndex: number;
}

// ... existing code ...

// Question definition for dynamic form rendering
export interface ConversationQuestion {
  id: string;
  text: string;
  type: 'text' | 'number' | 'select' | 'multiselect' | 'boolean' | 'file';
  options?: string[];
  fieldKey: string;
  validation?: {
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: RegExp;
  };
  helperText?: string;
  placeholder?: string;
}

// A group of related questions shown together as a mini-form
export interface QuestionGroup {
  id: string;
  title: string;
  questions: ConversationQuestion[];
}

// Policy-specific question flows
export interface PolicyQuestionFlow {
  policyType: PolicyType;
  questions: ConversationQuestion[];
  groups: QuestionGroup[];
}

// Action types for state machine reducer
export type ConversationAction =
  | { type: 'SET_POLICY_TYPES'; policyTypes: PolicyType[] }
  | { type: 'UPDATE_CORE_INFO'; field: keyof CoreApplicantInfo; value: string }
  | { type: 'UPDATE_AUTO_DETAILS'; field: keyof AutoDetails; value: any }
  | { type: 'UPDATE_HOME_DETAILS'; field: keyof HomeDetails; value: any }
  | { type: 'UPDATE_LIFE_DETAILS'; field: keyof LifeDetails; value: any }
  | { type: 'UPDATE_COMMERCIAL_DETAILS'; field: keyof CommercialDetails; value: any }
  | { type: 'ADD_VEHICLE'; vehicle: VehicleInfo }
  | { type: 'UPDATE_VEHICLE'; index: number; vehicle: VehicleInfo }
  | { type: 'REMOVE_VEHICLE'; index: number }
  | { type: 'ADD_DRIVER'; driver: DriverInfo }
  | { type: 'UPDATE_DRIVER'; index: number; driver: DriverInfo }
  | { type: 'REMOVE_DRIVER'; index: number }
  | { type: 'ADD_DOCUMENT'; url: string }
  | { type: 'REMOVE_DOCUMENT'; url: string }
  | { type: 'UPDATE_NOTES'; notes: string }
  | { type: 'NEXT_QUESTION' }
  | { type: 'PREVIOUS_QUESTION' }
  | { type: 'TRANSITION_STATE'; state: ConversationState }
  | { type: 'RESET_CONVERSATION' }
  | { type: 'LOAD_FROM_STORAGE'; context: ConversationContext };

// Initial conversation context
export const initialConversationContext: ConversationContext = {
  state: 'idle',
  policyTypes: [],
  coreInfo: {},
  autoDetails: {},
  homeDetails: {},
  lifeDetails: {},
  commercialDetails: {},
  documents: [],
  notes: '',
  currentQuestionIndex: 0,
};
