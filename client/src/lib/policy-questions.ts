import type { PolicyQuestionFlow, ConversationQuestion, QuestionGroup } from './conversation-types';

// Core questions asked for all policy types (matches quote modal: firstName, lastName, email, phone, zipCode)
export const coreQuestions: ConversationQuestion[] = [
  {
    id: 'firstName',
    text: "What's your first name?",
    type: 'text',
    fieldKey: 'firstName',
    validation: { required: true },
    helperText: 'Your first name',
    placeholder: 'First name'
  },
  {
    id: 'lastName',
    text: "What's your last name?",
    type: 'text',
    fieldKey: 'lastName',
    validation: { required: true },
    helperText: 'Your last name',
    placeholder: 'Last name'
  },
  {
    id: 'email',
    text: "What's your email address?",
    type: 'text',
    fieldKey: 'email',
    validation: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    helperText: "We'll use this to send you policy information",
    placeholder: 'email@example.com'
  },
  {
    id: 'phone',
    text: "What's your phone number?",
    type: 'text',
    fieldKey: 'phone',
    validation: { required: true },
    helperText: 'Include area code (e.g., 305-555-1234)',
    placeholder: '305-555-1234'
  },
  {
    id: 'zipCode',
    text: "What's your ZIP code?",
    type: 'text',
    fieldKey: 'zipCode',
    validation: { required: true },
    helperText: 'Your 5-digit ZIP code',
    placeholder: '33101'
  }
];

// Core questions grouped for faster form filling
export const coreQuestionGroups: QuestionGroup[] = [
  {
    id: 'personal-info',
    title: 'Your Information',
    questions: [
      coreQuestions[0], // firstName
      coreQuestions[1], // lastName
      coreQuestions[2], // email
      coreQuestions[3], // phone
      coreQuestions[4], // zipCode
    ]
  }
];

// Auto insurance questions (matches quote modal fields)
export const autoQuestionFlow: PolicyQuestionFlow = {
  policyType: 'auto',
  questions: [
    {
      id: 'garagingAddress',
      text: "What's the garaging address for the vehicle?",
      type: 'text',
      fieldKey: 'garagingAddress',
      validation: { required: false },
      helperText: 'Where the vehicle is primarily kept',
      placeholder: '123 Main St'
    },
    {
      id: 'garagingCity',
      text: "City?",
      type: 'text',
      fieldKey: 'garagingCity',
      validation: { required: false },
      placeholder: 'Jacksonville'
    },
    {
      id: 'garagingState',
      text: "State?",
      type: 'text',
      fieldKey: 'garagingState',
      validation: { required: false },
      placeholder: 'FL'
    },
    {
      id: 'garagingZip',
      text: "ZIP code?",
      type: 'text',
      fieldKey: 'garagingZip',
      validation: { required: false },
      placeholder: '32256'
    },
    {
      id: 'vehicleYear',
      text: "What year is your vehicle?",
      type: 'text',
      fieldKey: 'vehicleYear',
      validation: { required: false },
      helperText: 'e.g., 2024',
      placeholder: '2024'
    },
    {
      id: 'vehicleMake',
      text: "What's the make of your vehicle?",
      type: 'text',
      fieldKey: 'vehicleMake',
      validation: { required: false },
      helperText: 'e.g., Toyota, Honda, Ford',
      placeholder: 'Toyota'
    },
    {
      id: 'vehicleModel',
      text: "What's the model?",
      type: 'text',
      fieldKey: 'vehicleModel',
      validation: { required: false },
      helperText: 'e.g., Camry, Accord, F-150',
      placeholder: 'Camry'
    },
    {
      id: 'vehicleVin',
      text: "Do you have the VIN (Vehicle Identification Number)?",
      type: 'text',
      fieldKey: 'vehicleVin',
      validation: { required: false },
      helperText: 'Optional - helps us provide more accurate quotes',
      placeholder: 'Optional'
    },
    {
      id: 'primaryUse',
      text: "How do you primarily use your vehicle?",
      type: 'select',
      fieldKey: 'primaryUse',
      options: ['commuting', 'pleasure', 'business', 'rideshare'],
      validation: { required: false },
      helperText: 'This helps determine your coverage needs'
    },
    {
      id: 'ownershipStatus',
      text: "What's your vehicle ownership status?",
      type: 'select',
      fieldKey: 'ownershipStatus',
      options: ['owned', 'financed', 'leased'],
      validation: { required: false }
    },
    {
      id: 'driverDob',
      text: "What's your date of birth?",
      type: 'text',
      fieldKey: 'driverDob',
      validation: { required: false },
      helperText: 'MM/DD/YYYY format',
      placeholder: 'MM/DD/YYYY'
    },
    {
      id: 'maritalStatus',
      text: "What's your marital status?",
      type: 'select',
      fieldKey: 'maritalStatus',
      options: ['single', 'married', 'divorced', 'widowed'],
      validation: { required: false }
    },
    {
      id: 'licenseState',
      text: "What state is your driver's license from?",
      type: 'text',
      fieldKey: 'licenseState',
      validation: { required: false },
      helperText: 'e.g., FL',
      placeholder: 'FL'
    },
    {
      id: 'licenseNumber',
      text: "What's your driver's license number?",
      type: 'text',
      fieldKey: 'licenseNumber',
      validation: { required: false },
      helperText: 'Optional - helps verify your driving record',
      placeholder: 'Optional'
    },
    {
      id: 'hasViolations',
      text: "Have you had any accidents or violations in the past 3 years?",
      type: 'select',
      fieldKey: 'hasViolations',
      options: ['no', 'yes'],
      validation: { required: false }
    },
    {
      id: 'currentlyInsured',
      text: "Are you currently insured?",
      type: 'select',
      fieldKey: 'currentlyInsured',
      options: ['yes', 'no'],
      validation: { required: false }
    },
    {
      id: 'currentCarrier',
      text: "Who is your current insurance carrier?",
      type: 'text',
      fieldKey: 'currentCarrier',
      validation: { required: false },
      helperText: 'e.g., State Farm, Geico',
      placeholder: 'e.g., State Farm'
    },
    {
      id: 'currentLimits',
      text: "What are your current coverage limits?",
      type: 'select',
      fieldKey: 'currentLimits',
      options: ['25/50', '50/100', '100/300', '250/500', 'unsure'],
      validation: { required: false }
    }
  ],
  groups: [
    {
      id: 'garaging-address',
      title: 'Garaging Address',
      questions: []
    },
    {
      id: 'vehicle-info',
      title: 'Vehicle Information',
      questions: []
    },
    {
      id: 'vehicle-usage',
      title: 'Vehicle Usage & Status',
      questions: []
    },
    {
      id: 'driver-info',
      title: 'Driver Information',
      questions: []
    },
    {
      id: 'insurance-history',
      title: 'Insurance History',
      questions: []
    }
  ]
};

// Wire up auto groups by reference
autoQuestionFlow.groups[0].questions = autoQuestionFlow.questions.slice(0, 4);   // garagingAddress, city, state, zip
autoQuestionFlow.groups[1].questions = autoQuestionFlow.questions.slice(4, 8);   // year, make, model, vin
autoQuestionFlow.groups[2].questions = autoQuestionFlow.questions.slice(8, 10);  // primaryUse, ownershipStatus
autoQuestionFlow.groups[3].questions = autoQuestionFlow.questions.slice(10, 14); // dob, marital, licenseState, licenseNumber
autoQuestionFlow.groups[4].questions = autoQuestionFlow.questions.slice(14, 18); // violations, insured, carrier, limits

// Home insurance questions (matches quote modal fields)
export const homeQuestionFlow: PolicyQuestionFlow = {
  policyType: 'home',
  questions: [
    {
      id: 'propertyAddress',
      text: "What's the street address of the property?",
      type: 'text',
      fieldKey: 'propertyAddress',
      validation: { required: false },
      helperText: 'Full street address',
      placeholder: '123 Main St'
    },
    {
      id: 'propertyCity',
      text: "What city is the property in?",
      type: 'text',
      fieldKey: 'propertyCity',
      validation: { required: false },
      helperText: 'e.g., Jacksonville',
      placeholder: 'Jacksonville'
    },
    {
      id: 'propertyState',
      text: "What state?",
      type: 'text',
      fieldKey: 'propertyState',
      validation: { required: false },
      helperText: 'e.g., FL',
      placeholder: 'FL'
    },
    {
      id: 'propertyZip',
      text: "Property ZIP code?",
      type: 'text',
      fieldKey: 'propertyZip',
      validation: { required: false },
      helperText: 'e.g., 32256',
      placeholder: '32256'
    },
    {
      id: 'propertyType',
      text: "What type of property is it?",
      type: 'select',
      fieldKey: 'propertyType',
      options: ['single-family', 'condo', 'townhome', 'multi-family'],
      validation: { required: false }
    },
    {
      id: 'yearBuilt',
      text: "What year was the home built?",
      type: 'text',
      fieldKey: 'yearBuilt',
      validation: { required: false },
      helperText: 'Approximate year is fine',
      placeholder: '1995'
    },
    {
      id: 'squareFootage',
      text: "What's the approximate square footage?",
      type: 'text',
      fieldKey: 'squareFootage',
      validation: { required: false },
      helperText: 'Total living space',
      placeholder: '1800'
    },
    {
      id: 'roofYear',
      text: "When was the roof last replaced or installed?",
      type: 'text',
      fieldKey: 'roofYear',
      validation: { required: false },
      helperText: 'Year of last roof replacement',
      placeholder: '2020'
    },
    {
      id: 'systemsUpdated',
      text: "Have the major systems (plumbing, electrical, HVAC) been updated?",
      type: 'select',
      fieldKey: 'systemsUpdated',
      options: ['yes', 'no', 'unsure'],
      validation: { required: false }
    },
    {
      id: 'isPrimaryResidence',
      text: "Is this your primary residence?",
      type: 'select',
      fieldKey: 'isPrimaryResidence',
      options: ['yes', 'no'],
      validation: { required: false }
    },
    {
      id: 'hasPool',
      text: "Does the property have a pool?",
      type: 'select',
      fieldKey: 'hasPool',
      options: ['no', 'yes-fenced', 'yes-unfenced'],
      validation: { required: false }
    }
  ],
  groups: [
    {
      id: 'property-address',
      title: 'Property Address',
      questions: []
    },
    {
      id: 'property-details',
      title: 'Property Details',
      questions: []
    },
    {
      id: 'property-features',
      title: 'Property Features',
      questions: []
    }
  ]
};

homeQuestionFlow.groups[0].questions = homeQuestionFlow.questions.slice(0, 4);  // address, city, state, zip
homeQuestionFlow.groups[1].questions = homeQuestionFlow.questions.slice(4, 8);  // type, yearBuilt, sqft, roofYear
homeQuestionFlow.groups[2].questions = homeQuestionFlow.questions.slice(8, 11); // systems, primary, pool

// Life insurance questions (matches quote modal fields)
export const lifeQuestionFlow: PolicyQuestionFlow = {
  policyType: 'life',
  questions: [
    {
      id: 'lifeDob',
      text: "What's your date of birth?",
      type: 'text',
      fieldKey: 'lifeDob',
      validation: { required: false },
      helperText: 'MM/DD/YYYY format',
      placeholder: 'MM/DD/YYYY'
    },
    {
      id: 'gender',
      text: "What's your gender?",
      type: 'select',
      fieldKey: 'gender',
      options: ['male', 'female'],
      validation: { required: false }
    },
    {
      id: 'height',
      text: "What's your height?",
      type: 'text',
      fieldKey: 'height',
      validation: { required: false },
      helperText: "e.g., 5'9\"",
      placeholder: "5'9\""
    },
    {
      id: 'weight',
      text: "What's your weight in pounds?",
      type: 'text',
      fieldKey: 'weight',
      validation: { required: false },
      helperText: 'e.g., 175',
      placeholder: '175'
    },
    {
      id: 'usesTobacco',
      text: "Do you use tobacco products?",
      type: 'select',
      fieldKey: 'usesTobacco',
      options: ['no', 'yes'],
      validation: { required: false }
    },
    {
      id: 'hasMedicalConditions',
      text: "Do you have any pre-existing medical conditions?",
      type: 'select',
      fieldKey: 'hasMedicalConditions',
      options: ['no', 'yes'],
      validation: { required: false }
    },
    {
      id: 'lifeType',
      text: "What type of life insurance are you interested in?",
      type: 'select',
      fieldKey: 'lifeType',
      options: ['term', 'permanent', 'unsure'],
      validation: { required: false }
    },
    {
      id: 'coverageAmount',
      text: "How much coverage are you looking for?",
      type: 'select',
      fieldKey: 'coverageAmount',
      options: ['100k', '250k', '500k', '1m', '2m'],
      validation: { required: false }
    },
    {
      id: 'termLength',
      text: "What term length are you considering?",
      type: 'select',
      fieldKey: 'termLength',
      options: ['10', '20', '30'],
      validation: { required: false }
    }
  ],
  groups: [
    {
      id: 'personal-health',
      title: 'Personal & Health Info',
      questions: []
    },
    {
      id: 'health-conditions',
      title: 'Health & Lifestyle',
      questions: []
    },
    {
      id: 'coverage-preferences',
      title: 'Coverage Preferences',
      questions: []
    }
  ]
};

lifeQuestionFlow.groups[0].questions = lifeQuestionFlow.questions.slice(0, 4);  // dob, gender, height, weight
lifeQuestionFlow.groups[1].questions = lifeQuestionFlow.questions.slice(4, 6);  // tobacco, medical
lifeQuestionFlow.groups[2].questions = lifeQuestionFlow.questions.slice(6, 9);  // type, amount, term

// Commercial insurance questions (matches quote modal fields)
export const commercialQuestionFlow: PolicyQuestionFlow = {
  policyType: 'commercial',
  questions: [
    {
      id: 'businessName',
      text: "What's your business name?",
      type: 'text',
      fieldKey: 'businessName',
      validation: { required: false },
      helperText: 'Legal business name',
      placeholder: 'Acme Corp'
    },
    {
      id: 'industryDescription',
      text: "What industry or type of business do you operate?",
      type: 'text',
      fieldKey: 'industryDescription',
      validation: { required: false },
      helperText: 'e.g., Plumbing Contractor, Restaurant, IT Consulting',
      placeholder: 'e.g., IT Consulting'
    },
    {
      id: 'yearsInBusiness',
      text: "How long has your business been operating?",
      type: 'select',
      fieldKey: 'yearsInBusiness',
      options: ['startup', '1-3', '3-5', '5-10', '10+'],
      validation: { required: false }
    },
    {
      id: 'annualRevenue',
      text: "What's your approximate annual revenue?",
      type: 'select',
      fieldKey: 'annualRevenue',
      options: ['under-250k', '250k-500k', '500k-1m', '1m-5m', '5m+'],
      validation: { required: false }
    },
    {
      id: 'fullTimeEmployees',
      text: "How many full-time employees do you have?",
      type: 'text',
      fieldKey: 'fullTimeEmployees',
      validation: { required: false },
      helperText: 'Number of full-time employees',
      placeholder: '10'
    },
    {
      id: 'partTimeEmployees',
      text: "How many part-time employees?",
      type: 'text',
      fieldKey: 'partTimeEmployees',
      validation: { required: false },
      helperText: 'Number of part-time employees',
      placeholder: '5'
    },
    {
      id: 'needsGeneralLiability',
      text: "Do you need General Liability coverage?",
      type: 'select',
      fieldKey: 'needsGeneralLiability',
      options: ['yes', 'no', 'unsure'],
      validation: { required: false }
    },
    {
      id: 'needsWorkersComp',
      text: "Do you need Workers' Compensation coverage?",
      type: 'select',
      fieldKey: 'needsWorkersComp',
      options: ['yes', 'no', 'unsure'],
      validation: { required: false }
    },
    {
      id: 'needsProfessionalLiability',
      text: "Do you need Professional Liability (E&O) coverage?",
      type: 'select',
      fieldKey: 'needsProfessionalLiability',
      options: ['yes', 'no', 'unsure'],
      validation: { required: false }
    },
    {
      id: 'needsCyber',
      text: "Do you need Cyber Liability coverage?",
      type: 'select',
      fieldKey: 'needsCyber',
      options: ['yes', 'no', 'unsure'],
      validation: { required: false }
    }
  ],
  groups: [
    {
      id: 'business-info',
      title: 'Business Information',
      questions: []
    },
    {
      id: 'business-size',
      title: 'Business Size & Revenue',
      questions: []
    },
    {
      id: 'coverage-needs',
      title: 'Coverage Needs',
      questions: []
    }
  ]
};

commercialQuestionFlow.groups[0].questions = commercialQuestionFlow.questions.slice(0, 2);  // name, industry
commercialQuestionFlow.groups[1].questions = commercialQuestionFlow.questions.slice(2, 6);  // years, revenue, employees
commercialQuestionFlow.groups[2].questions = commercialQuestionFlow.questions.slice(6, 10); // coverage types

// Map policy types to their question flows
export const policyQuestionFlows: Record<string, PolicyQuestionFlow> = {
  auto: autoQuestionFlow,
  home: homeQuestionFlow,
  life: lifeQuestionFlow,
  commercial: commercialQuestionFlow
};
