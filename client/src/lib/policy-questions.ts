import type { PolicyQuestionFlow, ConversationQuestion } from './conversation-types';

// Core questions asked for all policy types
export const coreQuestions: ConversationQuestion[] = [
  {
    id: 'name',
    text: "What's your full name?",
    type: 'text',
    fieldKey: 'name',
    validation: { required: true },
    helperText: 'Please provide your first and last name'
  },
  {
    id: 'email',
    text: "What's your email address?",
    type: 'text',
    fieldKey: 'email',
    validation: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    helperText: 'We\'ll use this to send you policy information'
  },
  {
    id: 'phone',
    text: "What's your phone number?",
    type: 'text',
    fieldKey: 'phone',
    validation: { required: true },
    helperText: 'Include area code (e.g., 305-555-1234)'
  },
  {
    id: 'preferredContactMethod',
    text: "How would you prefer us to contact you?",
    type: 'select',
    fieldKey: 'preferredContactMethod',
    options: ['phone', 'email', 'text'],
    validation: { required: true }
  }
];

// Auto insurance specific questions
export const autoQuestionFlow: PolicyQuestionFlow = {
  policyType: 'auto',
  questions: [
    {
      id: 'driverCount',
      text: "How many drivers will be on this policy?",
      type: 'number',
      fieldKey: 'driverCount',
      validation: { required: true, min: 1 },
      helperText: 'Include yourself and anyone else who will drive the vehicle'
    },
    {
      id: 'vehicleMake',
      text: "What's the make of your primary vehicle?",
      type: 'text',
      fieldKey: 'primaryVehicle.make',
      validation: { required: true },
      helperText: 'e.g., Toyota, Honda, Ford'
    },
    {
      id: 'vehicleModel',
      text: "What's the model?",
      type: 'text',
      fieldKey: 'primaryVehicle.model',
      validation: { required: true },
      helperText: 'e.g., Camry, Accord, F-150'
    },
    {
      id: 'vehicleYear',
      text: "What year is your vehicle?",
      type: 'number',
      fieldKey: 'primaryVehicle.year',
      validation: { required: true, min: 1900, max: new Date().getFullYear() + 1 },
      helperText: 'Model year of the vehicle'
    },
    {
      id: 'vehicleVin',
      text: "Do you have the VIN (Vehicle Identification Number)?",
      type: 'text',
      fieldKey: 'primaryVehicle.vin',
      validation: { required: false },
      helperText: 'Optional - helps us provide more accurate quotes'
    },
    {
      id: 'usageProfile',
      text: "How do you primarily use your vehicle?",
      type: 'select',
      fieldKey: 'usageProfile',
      options: ['commute', 'pleasure', 'business'],
      validation: { required: true },
      helperText: 'This helps determine your coverage needs'
    },
    {
      id: 'desiredCoverages',
      text: "What types of coverage are you interested in?",
      type: 'multiselect',
      fieldKey: 'desiredCoverages',
      options: ['liability', 'collision', 'comprehensive', 'uninsured motorist', 'personal injury protection'],
      validation: { required: true },
      helperText: 'Select all that apply'
    },
    {
      id: 'currentInsurer',
      text: "Do you currently have auto insurance? If yes, who's your current insurer?",
      type: 'text',
      fieldKey: 'currentInsurer',
      validation: { required: false },
      helperText: 'Leave blank if you don\'t have current coverage'
    },
    {
      id: 'policyExpiration',
      text: "When does your current policy expire?",
      type: 'text',
      fieldKey: 'policyExpiration',
      validation: { required: false },
      helperText: 'Optional - e.g., MM/DD/YYYY'
    },
    {
      id: 'claimsHistory',
      text: "Have you had any accidents or claims in the past 3 years?",
      type: 'text',
      fieldKey: 'claimsHistory',
      validation: { required: false },
      helperText: 'Please describe briefly or say "none"'
    }
  ]
};

// Home insurance specific questions
export const homeQuestionFlow: PolicyQuestionFlow = {
  policyType: 'home',
  questions: [
    {
      id: 'propertyAddress',
      text: "What's the address of the property you want to insure?",
      type: 'text',
      fieldKey: 'propertyAddress',
      validation: { required: true },
      helperText: 'Full street address including city and ZIP'
    },
    {
      id: 'ownershipStatus',
      text: "Do you own the property outright or have a mortgage?",
      type: 'select',
      fieldKey: 'ownershipStatus',
      options: ['own', 'mortgage'],
      validation: { required: true }
    },
    {
      id: 'dwellingType',
      text: "What type of dwelling is it?",
      type: 'select',
      fieldKey: 'dwellingType',
      options: ['single-family', 'condo', 'townhome', 'multi-family'],
      validation: { required: true }
    },
    {
      id: 'constructionYear',
      text: "What year was the home built?",
      type: 'number',
      fieldKey: 'constructionYear',
      validation: { required: true, min: 1800 },
      helperText: 'Approximate year is fine'
    },
    {
      id: 'squareFootage',
      text: "What's the approximate square footage?",
      type: 'number',
      fieldKey: 'squareFootage',
      validation: { required: true, min: 1 },
      helperText: 'Total living space in square feet'
    },
    {
      id: 'securityFeatures',
      text: "What security features does your home have?",
      type: 'multiselect',
      fieldKey: 'securityFeatures',
      options: ['alarm system', 'deadbolts', 'security cameras', 'gated community', 'smoke detectors', 'sprinkler system'],
      validation: { required: false },
      helperText: 'Select all that apply - may qualify for discounts!'
    },
    {
      id: 'desiredCoverages',
      text: "What types of coverage do you need?",
      type: 'multiselect',
      fieldKey: 'desiredCoverages',
      options: ['dwelling', 'personal property', 'liability', 'loss of use', 'flood', 'hurricane'],
      validation: { required: true },
      helperText: 'Florida-specific options included'
    },
    {
      id: 'currentInsurer',
      text: "Do you currently have home insurance? If yes, who's your current insurer?",
      type: 'text',
      fieldKey: 'currentInsurer',
      validation: { required: false }
    },
    {
      id: 'policyExpiration',
      text: "When does your current policy expire?",
      type: 'text',
      fieldKey: 'policyExpiration',
      validation: { required: false },
      helperText: 'Optional - e.g., MM/DD/YYYY'
    },
    {
      id: 'claimsHistory',
      text: "Have you filed any claims in the past 5 years?",
      type: 'text',
      fieldKey: 'claimsHistory',
      validation: { required: false },
      helperText: 'Please describe briefly or say "none"'
    }
  ]
};

// Life insurance specific questions
export const lifeQuestionFlow: PolicyQuestionFlow = {
  policyType: 'life',
  questions: [
    {
      id: 'age',
      text: "What's your age?",
      type: 'number',
      fieldKey: 'age',
      validation: { required: true, min: 18, max: 100 },
      helperText: 'Used to calculate premiums'
    },
    {
      id: 'gender',
      text: "What's your gender?",
      type: 'select',
      fieldKey: 'gender',
      options: ['male', 'female', 'other'],
      validation: { required: true }
    },
    {
      id: 'smokerStatus',
      text: "Have you used tobacco products in the past 12 months?",
      type: 'boolean',
      fieldKey: 'smokerStatus',
      validation: { required: true },
      helperText: 'Includes cigarettes, cigars, vaping, or chewing tobacco'
    },
    {
      id: 'healthConditions',
      text: "Do you have any pre-existing health conditions?",
      type: 'text',
      fieldKey: 'healthConditions',
      validation: { required: false },
      helperText: 'Optional - helps us find the best policy for you'
    },
    {
      id: 'coverageGoal',
      text: "What's your primary goal for life insurance?",
      type: 'select',
      fieldKey: 'coverageGoal',
      options: ['income replacement', 'mortgage protection', 'final expenses', 'legacy/inheritance', 'business protection'],
      validation: { required: true }
    },
    {
      id: 'desiredCoverageAmount',
      text: "How much coverage are you looking for?",
      type: 'number',
      fieldKey: 'desiredCoverageAmount',
      validation: { required: true, min: 1000 },
      helperText: 'Amount in dollars (e.g., 500000 for $500,000)'
    },
    {
      id: 'beneficiariesCount',
      text: "How many beneficiaries will you name?",
      type: 'number',
      fieldKey: 'beneficiariesCount',
      validation: { required: true, min: 1 },
      helperText: 'People who will receive the benefit'
    },
    {
      id: 'beneficiaryRelationships',
      text: "What's their relationship to you?",
      type: 'text',
      fieldKey: 'beneficiaryRelationships',
      validation: { required: false },
      helperText: 'e.g., spouse, children, parents'
    },
    {
      id: 'existingPolicies',
      text: "Do you have any existing life insurance policies?",
      type: 'text',
      fieldKey: 'existingPolicies',
      validation: { required: false },
      helperText: 'If yes, please provide details'
    }
  ]
};

// Map policy types to their question flows
export const policyQuestionFlows: Record<string, PolicyQuestionFlow> = {
  auto: autoQuestionFlow,
  home: homeQuestionFlow,
  life: lifeQuestionFlow
};
