import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { X, ChevronLeft, ChevronRight, Car, Home, Heart, Building2, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

// Comprehensive schema for all policy types
const quoteFormSchema = z.object({
  // Step 1: Contact Info
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  zipCode: z.string().min(5, "Please enter a valid zip code"),
  
  // Step 2: Policy Type
  policyType: z.string().min(1, "Please select what you'd like to insure"),
  
  // Auto Insurance Fields
  vehicleYear: z.string().optional(),
  vehicleMake: z.string().optional(),
  vehicleModel: z.string().optional(),
  vehicleVin: z.string().optional(),
  primaryUse: z.string().optional(),
  ownershipStatus: z.string().optional(),
  driverDob: z.string().optional(),
  maritalStatus: z.string().optional(),
  licenseState: z.string().optional(),
  licenseNumber: z.string().optional(),
  hasViolations: z.string().optional(),
  currentlyInsured: z.string().optional(),
  currentCarrier: z.string().optional(),
  currentLimits: z.string().optional(),
  
  // Home Insurance Fields
  propertyAddress: z.string().optional(),
  propertyCity: z.string().optional(),
  propertyState: z.string().optional(),
  propertyZip: z.string().optional(),
  propertyType: z.string().optional(),
  yearBuilt: z.string().optional(),
  squareFootage: z.string().optional(),
  roofYear: z.string().optional(),
  systemsUpdated: z.string().optional(),
  isPrimaryResidence: z.string().optional(),
  hasPool: z.string().optional(),
  
  // Life Insurance Fields
  lifeDob: z.string().optional(),
  gender: z.string().optional(),
  height: z.string().optional(),
  weight: z.string().optional(),
  usesTobacco: z.string().optional(),
  hasMedicalConditions: z.string().optional(),
  lifeType: z.string().optional(),
  coverageAmount: z.string().optional(),
  termLength: z.string().optional(),
  
  // Commercial Insurance Fields
  businessName: z.string().optional(),
  industryDescription: z.string().optional(),
  yearsInBusiness: z.string().optional(),
  annualRevenue: z.string().optional(),
  fullTimeEmployees: z.string().optional(),
  partTimeEmployees: z.string().optional(),
  needsGeneralLiability: z.boolean().optional(),
  needsWorkersComp: z.boolean().optional(),
  needsProfessionalLiability: z.boolean().optional(),
  needsCyber: z.boolean().optional(),
});

type QuoteFormData = z.infer<typeof quoteFormSchema>;

interface QuoteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const policyOptions = [
  { value: "auto", label: "Auto", icon: Car, description: "Cars, trucks, motorcycles" },
  { value: "home", label: "Home", icon: Home, description: "Houses, condos, rentals" },
  { value: "life", label: "Life", icon: Heart, description: "Term & permanent coverage" },
  { value: "commercial", label: "Commercial", icon: Building2, description: "Business protection" },
];

export default function QuoteModal({ open, onOpenChange }: QuoteModalProps) {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const form = useForm<QuoteFormData>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      zipCode: "",
      policyType: "",
      vehicleYear: "",
      vehicleMake: "",
      vehicleModel: "",
      vehicleVin: "",
      primaryUse: "",
      ownershipStatus: "",
      driverDob: "",
      maritalStatus: "",
      licenseState: "",
      licenseNumber: "",
      hasViolations: "",
      currentlyInsured: "",
      currentCarrier: "",
      currentLimits: "",
      propertyAddress: "",
      propertyCity: "",
      propertyState: "",
      propertyZip: "",
      propertyType: "",
      yearBuilt: "",
      squareFootage: "",
      roofYear: "",
      systemsUpdated: "",
      isPrimaryResidence: "",
      hasPool: "",
      lifeDob: "",
      gender: "",
      height: "",
      weight: "",
      usesTobacco: "",
      hasMedicalConditions: "",
      lifeType: "",
      coverageAmount: "",
      termLength: "",
      businessName: "",
      industryDescription: "",
      yearsInBusiness: "",
      annualRevenue: "",
      fullTimeEmployees: "",
      partTimeEmployees: "",
      needsGeneralLiability: false,
      needsWorkersComp: false,
      needsProfessionalLiability: false,
      needsCyber: false,
    },
  });

  const policyType = form.watch("policyType");
  const currentlyInsured = form.watch("currentlyInsured");
  const allValues = form.watch();

  // Reset to step 2 when policy type changes (to avoid invalid step states)
  useEffect(() => {
    if (policyType && currentStep > 2) {
      setCurrentStep(2);
    }
  }, [policyType]);

  // Calculate total steps based on policy type
  const getTotalSteps = () => {
    if (!policyType) return 2;
    switch (policyType) {
      case "auto": return 5; // Contact, Type, Vehicle, Driver, Coverage
      case "home": return 5; // Contact, Type, Property, Risk, Occupancy
      case "life": return 5; // Contact, Type, Personal, Health, Coverage
      case "commercial": return 5; // Contact, Type, Business, Scale, Needs
      default: return 2;
    }
  };

  const totalSteps = getTotalSteps();

  const submitMutation = useMutation({
    mutationFn: async (data: QuoteFormData) => {
      // Log the consolidated JSON object
      console.log("📋 Quote Submission Data:", JSON.stringify(data, null, 2));
      
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          formData.append(key, String(value));
        }
      });
      
      return apiRequest('POST', '/api/contact', formData);
    },
    onSuccess: () => {
      setShowSuccess(true);
      setHighestProgress(100);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to submit quote request. Please try again.",
        variant: "destructive",
      });
      console.error('Quote submission error:', error);
    },
  });

  const validateCurrentStep = async () => {
    let fieldsToValidate: (keyof QuoteFormData)[] = [];
    
    switch (currentStep) {
      case 1:
        fieldsToValidate = ["firstName", "lastName", "email", "phone", "zipCode"];
        break;
      case 2:
        fieldsToValidate = ["policyType"];
        break;
      // Policy-specific steps don't require validation for optional fields
    }
    
    if (fieldsToValidate.length > 0) {
      const result = await form.trigger(fieldsToValidate);
      return result;
    }
    return true;
  };

  const handleNext = async () => {
    const isValid = await validateCurrentStep();
    if (isValid) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const onSubmit = (data: QuoteFormData) => {
    submitMutation.mutate(data);
  };

  // Track highest progress to prevent backwards animation
  const [highestProgress, setHighestProgress] = useState(0);

  const handleClose = () => {
    form.reset();
    setCurrentStep(1);
    setHighestProgress(0);
    setShowSuccess(false);
    onOpenChange(false);
  };

  // Calculate weighted progress percentage
  const calculateWeightedProgress = () => {
    // Show 100% when success
    if (showSuccess) {
      return 100;
    }
    
    // Step 1 (Contact): 0% -> 20%
    // Step 2 (Policy): 35%
    // Steps 3-4 (Risk Details): 35% -> 85% (divided by screens)
    // Step 5 (Final): 95%
    // After submit: 100%
    
    if (currentStep === 1) {
      return 0;
    } else if (currentStep === 2) {
      return 20;
    } else if (currentStep === totalSteps) {
      // Final step before submit
      return 95;
    } else {
      // Steps 3 to (totalSteps - 1) map to 35% -> 85%
      const riskSteps = totalSteps - 3; // Number of "risk detail" steps
      const currentRiskStep = currentStep - 2; // Which risk step we're on (1-indexed)
      const progressPerRiskStep = 50 / Math.max(riskSteps, 1); // Divide 50% (35->85) among risk steps
      return 35 + (currentRiskStep - 1) * progressPerRiskStep;
    }
  };

  // Success screen content
  const successContent = (
    <div className="text-center py-12 space-y-6">
      <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
        <Check className="w-10 h-10 text-green-600" />
      </div>
      <div className="space-y-2">
        <h3 className="text-2xl font-bold text-slate-800">Thank You!</h3>
        <p className="text-slate-600 max-w-md mx-auto">
          Your quote request has been submitted successfully. One of our insurance specialists will contact you within 24 hours with your personalized quote.
        </p>
      </div>
      <Button
        onClick={handleClose}
        className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold shadow-lg shadow-blue-500/25 transition-all duration-300 hover:shadow-blue-500/40 px-8"
      >
        Close
      </Button>
    </div>
  );

  // Calculate current progress
  const rawProgress = calculateWeightedProgress();
  
  // Update highest progress (prevents backwards animation)
  useEffect(() => {
    if (rawProgress > highestProgress) {
      setHighestProgress(rawProgress);
    }
  }, [rawProgress, highestProgress]);
  
  const displayProgress = Math.max(rawProgress, highestProgress);

  // Progress bar step indicator - render as JSX variable
  const stepIndicator = (
    <div className="mb-8">
      <div className="flex justify-end items-center mb-3">
        <span className="text-xs font-semibold text-blue-600">{Math.round(displayProgress)}% Complete</span>
      </div>
      <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-500 ease-in-out"
          style={{ width: `${displayProgress}%` }}
        />
      </div>
    </div>
  );

  // Step 1: Contact Info
  const Step1ContactInfo = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-slate-800">Let's start with your contact info</h3>
        <p className="text-slate-500 text-sm">We'll use this to send you your personalized quote</p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name *</FormLabel>
              <FormControl>
                <Input placeholder="John" data-testid="input-first-name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name *</FormLabel>
              <FormControl>
                <Input placeholder="Smith" data-testid="input-last-name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email Address *</FormLabel>
            <FormControl>
              <Input type="email" placeholder="john.smith@email.com" data-testid="input-email" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number *</FormLabel>
              <FormControl>
                <Input placeholder="(555) 123-4567" data-testid="input-phone" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="zipCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Zip Code *</FormLabel>
              <FormControl>
                <Input placeholder="32256" data-testid="input-zipcode" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );

  // Step 2: Policy Type Selection
  const Step2PolicyType = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-slate-800">What would you like to insure?</h3>
        <p className="text-slate-500 text-sm">Select the type of coverage you're looking for</p>
      </div>
      
      <FormField
        control={form.control}
        name="policyType"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <div className="grid grid-cols-2 gap-4">
                {policyOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = field.value === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => field.onChange(option.value)}
                      data-testid={`policy-option-${option.value}`}
                      className={`p-6 rounded-2xl border transition-all duration-300 text-left ${
                        isSelected
                          ? "border-blue-500 bg-blue-50 shadow-lg shadow-blue-500/20"
                          : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"
                      }`}
                    >
                      <Icon className={`w-8 h-8 mb-3 ${isSelected ? "text-blue-600" : "text-slate-400"}`} />
                      <div className={`font-semibold ${isSelected ? "text-blue-700" : "text-slate-700"}`}>{option.label}</div>
                      <div className="text-sm text-slate-500">{option.description}</div>
                    </button>
                  );
                })}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );

  // Auto Insurance Steps
  const AutoStep3VehicleDetails = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-slate-800">Tell us about your vehicle</h3>
        <p className="text-slate-500 text-sm">Enter your vehicle details or VIN</p>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="vehicleYear"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Year</FormLabel>
              <FormControl>
                <Input placeholder="2024" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="vehicleMake"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Make</FormLabel>
              <FormControl>
                <Input placeholder="Toyota" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="vehicleModel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Model</FormLabel>
              <FormControl>
                <Input placeholder="Camry" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      <div className="text-center text-muted-foreground text-sm">— or —</div>

      <FormField
        control={form.control}
        name="vehicleVin"
        render={({ field }) => (
          <FormItem>
            <FormLabel>VIN (Vehicle Identification Number)</FormLabel>
            <FormControl>
              <Input placeholder="1HGBH41JXMN109186" {...field} />
            </FormControl>
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">Primary Use</label>
          <Select onValueChange={(val) => form.setValue("primaryUse", val)} value={allValues.primaryUse || ""}>
            <SelectTrigger>
              <SelectValue placeholder="Select usage" />
            </SelectTrigger>
            <SelectContent position="popper" className="z-[9999]">
              <SelectItem value="commuting">Commuting</SelectItem>
              <SelectItem value="pleasure">Pleasure</SelectItem>
              <SelectItem value="business">Business</SelectItem>
              <SelectItem value="rideshare">Rideshare</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">Ownership Status</label>
          <Select onValueChange={(val) => form.setValue("ownershipStatus", val)} value={allValues.ownershipStatus || ""}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent position="popper" className="z-[9999]">
              <SelectItem value="owned">Owned</SelectItem>
              <SelectItem value="financed">Financed</SelectItem>
              <SelectItem value="leased">Leased</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  const AutoStep4DriverDetails = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-slate-800">Driver Information</h3>
        <p className="text-slate-500 text-sm">Tell us about the primary driver</p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">Date of Birth</label>
          <Input
            type="date"
            value={allValues.driverDob || ""}
            onChange={(e) => form.setValue("driverDob", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">Marital Status</label>
          <Select onValueChange={(val) => form.setValue("maritalStatus", val)} value={allValues.maritalStatus || ""}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent position="popper" className="z-[9999]">
              <SelectItem value="single">Single</SelectItem>
              <SelectItem value="married">Married</SelectItem>
              <SelectItem value="divorced">Divorced</SelectItem>
              <SelectItem value="widowed">Widowed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="licenseState"
          render={({ field }) => (
            <FormItem>
              <FormLabel>License State (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="FL" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="licenseNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>License Number (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="D123-456-78-901-0" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium leading-none">Any accidents or tickets in the last 3 years?</label>
        <Select onValueChange={(val) => form.setValue("hasViolations", val)} value={allValues.hasViolations || ""}>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent position="popper" className="z-[9999]">
            <SelectItem value="no">No</SelectItem>
            <SelectItem value="yes">Yes</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const AutoStep5CurrentCoverage = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-slate-800">Current Coverage</h3>
        <p className="text-slate-500 text-sm">Help us understand your existing insurance</p>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium leading-none">Are you currently insured?</label>
        <Select onValueChange={(val) => form.setValue("currentlyInsured", val)} value={allValues.currentlyInsured || ""}>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent position="popper" className="z-[9999]">
            <SelectItem value="yes">Yes</SelectItem>
            <SelectItem value="no">No</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {currentlyInsured === "yes" && (
        <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
          <FormField
            control={form.control}
            name="currentCarrier"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Insurance Carrier</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., State Farm, Geico" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Current Bodily Injury Limits</label>
            <Select onValueChange={(val) => form.setValue("currentLimits", val)} value={allValues.currentLimits || ""}>
              <SelectTrigger>
                <SelectValue placeholder="Select limits" />
              </SelectTrigger>
              <SelectContent position="popper" className="z-[9999]">
                <SelectItem value="25/50">25/50</SelectItem>
                <SelectItem value="50/100">50/100</SelectItem>
                <SelectItem value="100/300">100/300</SelectItem>
                <SelectItem value="250/500">250/500</SelectItem>
                <SelectItem value="unsure">Not Sure</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );

  // Home Insurance Steps
  const HomeStep3PropertyDetails = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-slate-800">Property Details</h3>
        <p className="text-slate-500 text-sm">Tell us about the property you want to insure</p>
      </div>
      
      <FormField
        control={form.control}
        name="propertyAddress"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Street Address</FormLabel>
            <FormControl>
              <Input placeholder="123 Main Street" {...field} />
            </FormControl>
          </FormItem>
        )}
      />

      <div className="grid grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="propertyCity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input placeholder="Jacksonville" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="propertyState"
          render={({ field }) => (
            <FormItem>
              <FormLabel>State</FormLabel>
              <FormControl>
                <Input placeholder="FL" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="propertyZip"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Zip Code</FormLabel>
              <FormControl>
                <Input placeholder="32256" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">Property Type</label>
          <Select onValueChange={(val) => form.setValue("propertyType", val)} value={allValues.propertyType || ""}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent position="popper" className="z-[9999]">
              <SelectItem value="single-family">Single Family</SelectItem>
              <SelectItem value="condo">Condo</SelectItem>
              <SelectItem value="townhome">Townhome</SelectItem>
              <SelectItem value="multi-family">Multi-family</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <FormField
          control={form.control}
          name="yearBuilt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Year Built</FormLabel>
              <FormControl>
                <Input placeholder="2005" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="squareFootage"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Estimated Square Footage</FormLabel>
            <FormControl>
              <Input placeholder="2,500" {...field} />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );

  const HomeStep4RiskFactors = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-slate-800">Property Condition</h3>
        <p className="text-slate-500 text-sm">This helps us get you the best rate (4-point inspection data)</p>
      </div>
      
      <FormField
        control={form.control}
        name="roofYear"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Approximate year roof was replaced?</FormLabel>
            <FormControl>
              <Input placeholder="2018" {...field} />
            </FormControl>
          </FormItem>
        )}
      />

      <div className="space-y-2">
        <label className="text-sm font-medium leading-none">Have you updated Electrical, Plumbing, or Heating in the last 20 years?</label>
        <Select onValueChange={(val) => form.setValue("systemsUpdated", val)} value={allValues.systemsUpdated || ""}>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent position="popper" className="z-[9999]">
            <SelectItem value="yes">Yes</SelectItem>
            <SelectItem value="no">No</SelectItem>
            <SelectItem value="unsure">Not Sure</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const HomeStep5Occupancy = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-slate-800">Occupancy Information</h3>
        <p className="text-slate-500 text-sm">A few more details about the property</p>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium leading-none">Is this your primary residence?</label>
        <Select onValueChange={(val) => form.setValue("isPrimaryResidence", val)} value={allValues.isPrimaryResidence || ""}>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent position="popper" className="z-[9999]">
            <SelectItem value="yes">Yes</SelectItem>
            <SelectItem value="no">No (Secondary/Investment)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium leading-none">Do you have a swimming pool?</label>
        <Select onValueChange={(val) => form.setValue("hasPool", val)} value={allValues.hasPool || ""}>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent position="popper" className="z-[9999]">
            <SelectItem value="no">No</SelectItem>
            <SelectItem value="yes-fenced">Yes, with fence</SelectItem>
            <SelectItem value="yes-unfenced">Yes, no fence</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  // Life Insurance Steps
  const LifeStep3PersonalStats = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-slate-800">Personal Information</h3>
        <p className="text-slate-500 text-sm">Basic details for your life insurance quote</p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">Date of Birth</label>
          <Input
            type="date"
            value={allValues.lifeDob || ""}
            onChange={(e) => form.setValue("lifeDob", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">Gender</label>
          <Select onValueChange={(val) => form.setValue("gender", val)} value={allValues.gender || ""}>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent position="popper" className="z-[9999]">
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="height"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Height</FormLabel>
              <FormControl>
                <Input placeholder="5'10&quot;" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="weight"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Weight (lbs)</FormLabel>
              <FormControl>
                <Input placeholder="175" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  );

  const LifeStep4Health = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-slate-800">Health Information</h3>
        <p className="text-slate-500 text-sm">This helps determine your coverage options</p>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium leading-none">Have you used tobacco/nicotine in the last 12 months?</label>
        <Select onValueChange={(val) => form.setValue("usesTobacco", val)} value={allValues.usesTobacco || ""}>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent position="popper" className="z-[9999]">
            <SelectItem value="no">No</SelectItem>
            <SelectItem value="yes">Yes</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium leading-none">Do you have any major medical conditions (Heart, Cancer, Diabetes)?</label>
        <Select onValueChange={(val) => form.setValue("hasMedicalConditions", val)} value={allValues.hasMedicalConditions || ""}>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent position="popper" className="z-[9999]">
            <SelectItem value="no">No</SelectItem>
            <SelectItem value="yes">Yes</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const LifeStep5CoverageNeeds = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-slate-800">Coverage Needs</h3>
        <p className="text-slate-500 text-sm">Tell us about the coverage you're looking for</p>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium leading-none">Type of Life Insurance</label>
        <Select onValueChange={(val) => form.setValue("lifeType", val)} value={allValues.lifeType || ""}>
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent position="popper" className="z-[9999]">
            <SelectItem value="term">Term Life</SelectItem>
            <SelectItem value="permanent">Permanent (Whole Life)</SelectItem>
            <SelectItem value="unsure">Not Sure - Help Me Decide</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium leading-none">Coverage Amount</label>
        <Select onValueChange={(val) => form.setValue("coverageAmount", val)} value={allValues.coverageAmount || ""}>
          <SelectTrigger>
            <SelectValue placeholder="Select amount" />
          </SelectTrigger>
          <SelectContent position="popper" className="z-[9999]">
            <SelectItem value="100k">$100,000</SelectItem>
            <SelectItem value="250k">$250,000</SelectItem>
            <SelectItem value="500k">$500,000</SelectItem>
            <SelectItem value="1m">$1,000,000</SelectItem>
            <SelectItem value="2m">$2,000,000+</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium leading-none">Term Length (if applicable)</label>
        <Select onValueChange={(val) => form.setValue("termLength", val)} value={allValues.termLength || ""}>
          <SelectTrigger>
            <SelectValue placeholder="Select term" />
          </SelectTrigger>
          <SelectContent position="popper" className="z-[9999]">
            <SelectItem value="10">10 Years</SelectItem>
            <SelectItem value="20">20 Years</SelectItem>
            <SelectItem value="30">30 Years</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  // Commercial Insurance Steps
  const CommercialStep3BusinessProfile = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-slate-800">Business Profile</h3>
        <p className="text-slate-500 text-sm">Tell us about your business</p>
      </div>
      
      <FormField
        control={form.control}
        name="businessName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Business Name</FormLabel>
            <FormControl>
              <Input placeholder="ABC Company LLC" {...field} />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="industryDescription"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Industry / Operation Description</FormLabel>
            <FormControl>
              <Textarea placeholder="e.g., Plumbing Contractor, Restaurant, IT Consulting" {...field} />
            </FormControl>
          </FormItem>
        )}
      />

      <div className="space-y-2">
        <label className="text-sm font-medium leading-none">Years in Business</label>
        <Select onValueChange={(val) => form.setValue("yearsInBusiness", val)} value={allValues.yearsInBusiness || ""}>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent position="popper" className="z-[9999]">
            <SelectItem value="startup">Less than 1 year</SelectItem>
            <SelectItem value="1-3">1-3 years</SelectItem>
            <SelectItem value="3-5">3-5 years</SelectItem>
            <SelectItem value="5-10">5-10 years</SelectItem>
            <SelectItem value="10+">10+ years</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const CommercialStep4Scale = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-slate-800">Business Scale</h3>
        <p className="text-slate-500 text-sm">Help us understand the size of your operation</p>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium leading-none">Estimated Annual Revenue</label>
        <Select onValueChange={(val) => form.setValue("annualRevenue", val)} value={allValues.annualRevenue || ""}>
          <SelectTrigger>
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent position="popper" className="z-[9999]">
            <SelectItem value="under-100k">Under $100,000</SelectItem>
            <SelectItem value="100k-500k">$100,000 - $500,000</SelectItem>
            <SelectItem value="500k-1m">$500,000 - $1,000,000</SelectItem>
            <SelectItem value="1m-5m">$1,000,000 - $5,000,000</SelectItem>
            <SelectItem value="5m+">$5,000,000+</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="fullTimeEmployees"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full-Time Employees</FormLabel>
              <FormControl>
                <Input placeholder="10" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="partTimeEmployees"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Part-Time Employees</FormLabel>
              <FormControl>
                <Input placeholder="5" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  );

  const CommercialStep5Needs = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-slate-800">Coverage Needs</h3>
        <p className="text-slate-500 text-sm">Select all the coverage types you're interested in</p>
      </div>
      
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="needsGeneralLiability"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-3 space-y-0 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div>
                <FormLabel className="font-medium cursor-pointer">General Liability</FormLabel>
                <p className="text-sm text-muted-foreground">Protection against third-party claims</p>
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="needsWorkersComp"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-3 space-y-0 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div>
                <FormLabel className="font-medium cursor-pointer">Workers Compensation</FormLabel>
                <p className="text-sm text-muted-foreground">Coverage for employee injuries</p>
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="needsProfessionalLiability"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-3 space-y-0 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div>
                <FormLabel className="font-medium cursor-pointer">Professional Liability (E&O)</FormLabel>
                <p className="text-sm text-muted-foreground">Protection against professional mistakes</p>
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="needsCyber"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-3 space-y-0 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div>
                <FormLabel className="font-medium cursor-pointer">Cyber Liability</FormLabel>
                <p className="text-sm text-muted-foreground">Protection against data breaches</p>
              </div>
            </FormItem>
          )}
        />
      </div>
    </div>
  );

  // Render the appropriate step content - call as functions to avoid re-mounting
  const renderStepContent = () => {
    if (currentStep === 1) return Step1ContactInfo();
    if (currentStep === 2) return Step2PolicyType();
    
    // Policy-specific steps
    if (policyType === "auto") {
      if (currentStep === 3) return AutoStep3VehicleDetails();
      if (currentStep === 4) return AutoStep4DriverDetails();
      if (currentStep === 5) return AutoStep5CurrentCoverage();
    }
    
    if (policyType === "home") {
      if (currentStep === 3) return HomeStep3PropertyDetails();
      if (currentStep === 4) return HomeStep4RiskFactors();
      if (currentStep === 5) return HomeStep5Occupancy();
    }
    
    if (policyType === "life") {
      if (currentStep === 3) return LifeStep3PersonalStats();
      if (currentStep === 4) return LifeStep4Health();
      if (currentStep === 5) return LifeStep5CoverageNeeds();
    }
    
    if (policyType === "commercial") {
      if (currentStep === 3) return CommercialStep3BusinessProfile();
      if (currentStep === 4) return CommercialStep4Scale();
      if (currentStep === 5) return CommercialStep5Needs();
    }
    
    return null;
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent 
        className="light-glass-modal custom-scrollbar max-w-2xl max-h-[90vh] overflow-y-auto backdrop-blur-[20px] border shadow-2xl rounded-3xl"
        style={{ background: 'hsla(210, 40%, 98%, 0.85)', borderColor: 'hsla(210, 40%, 88%, 0.3)' }}
        aria-describedby="quote-form-description"
      >
        <DialogHeader className="pb-2">
          <DialogTitle className="text-3xl font-bold text-slate-800 text-center">
            {showSuccess ? "Quote Submitted" : "Get Quoted Today"}
          </DialogTitle>
          {!showSuccess && (
            <p id="quote-form-description" className="text-slate-600 text-center text-sm">
              Complete the form to receive your personalized quote
            </p>
          )}
        </DialogHeader>

        {stepIndicator}

        {showSuccess ? (
          successContent
        ) : (
          <Form {...form}>
            <div className="space-y-6">
              <div className="min-h-[300px]">
                {renderStepContent()}
              </div>

              <div className="flex justify-between pt-6 border-t border-slate-200">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  className="gap-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 disabled:opacity-30"
                  data-testid="button-back"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </Button>
                
                {currentStep < totalSteps ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold shadow-lg shadow-blue-500/25 transition-all duration-300 hover:shadow-blue-500/40"
                    data-testid="button-next"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={form.handleSubmit(onSubmit)}
                    disabled={submitMutation.isPending}
                    className="gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold shadow-lg shadow-blue-500/25 transition-all duration-300 hover:shadow-blue-500/40"
                    data-testid="button-submit-quote"
                  >
                    {submitMutation.isPending ? "Submitting..." : "Submit Quote Request"}
                  </Button>
                )}
              </div>
            </div>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
