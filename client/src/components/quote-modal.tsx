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
      toast({
        title: "Success!",
        description: "Thank you! We'll contact you within 24 hours with your personalized quote.",
      });
      form.reset();
      setCurrentStep(1);
      onOpenChange(false);
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

  const handleClose = () => {
    form.reset();
    setCurrentStep(1);
    onOpenChange(false);
  };

  // Progress bar step indicator
  const StepIndicator = () => {
    const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;
    return (
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Progress</span>
          <span className="text-xs font-semibold text-blue-400">Step {currentStep} of {totalSteps}</span>
        </div>
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    );
  };

  // Step 1: Contact Info
  const Step1ContactInfo = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-white">Let's start with your contact info</h3>
        <p className="text-gray-400 text-sm">We'll use this to send you your personalized quote</p>
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
        <h3 className="text-xl font-semibold text-white">What would you like to insure?</h3>
        <p className="text-gray-400 text-sm">Select the type of coverage you're looking for</p>
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
                          ? "border-blue-500 bg-blue-500/20 shadow-lg shadow-blue-500/20"
                          : "border-white/10 bg-white/5 hover:border-blue-400/50 hover:bg-white/10"
                      }`}
                    >
                      <Icon className={`w-8 h-8 mb-3 ${isSelected ? "text-blue-400" : "text-gray-400"}`} />
                      <div className={`font-semibold ${isSelected ? "text-white" : "text-gray-200"}`}>{option.label}</div>
                      <div className="text-sm text-gray-500">{option.description}</div>
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
        <h3 className="text-xl font-semibold text-white">Tell us about your vehicle</h3>
        <p className="text-gray-400 text-sm">Enter your vehicle details or VIN</p>
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
        <FormField
          control={form.control}
          name="primaryUse"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Primary Use</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select usage" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="commuting">Commuting</SelectItem>
                  <SelectItem value="pleasure">Pleasure</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="rideshare">Rideshare</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="ownershipStatus"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ownership Status</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="owned">Owned</SelectItem>
                  <SelectItem value="financed">Financed</SelectItem>
                  <SelectItem value="leased">Leased</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
      </div>
    </div>
  );

  const AutoStep4DriverDetails = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-white">Driver Information</h3>
        <p className="text-gray-400 text-sm">Tell us about the primary driver</p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="driverDob"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date of Birth</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="maritalStatus"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Marital Status</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="married">Married</SelectItem>
                  <SelectItem value="divorced">Divorced</SelectItem>
                  <SelectItem value="widowed">Widowed</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
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

      <FormField
        control={form.control}
        name="hasViolations"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Any accidents or tickets in the last 3 years?</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="no">No</SelectItem>
                <SelectItem value="yes">Yes</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />
    </div>
  );

  const AutoStep5CurrentCoverage = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-white">Current Coverage</h3>
        <p className="text-gray-400 text-sm">Help us understand your existing insurance</p>
      </div>
      
      <FormField
        control={form.control}
        name="currentlyInsured"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Are you currently insured?</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />

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
          <FormField
            control={form.control}
            name="currentLimits"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Bodily Injury Limits</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select limits" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="25/50">25/50</SelectItem>
                    <SelectItem value="50/100">50/100</SelectItem>
                    <SelectItem value="100/300">100/300</SelectItem>
                    <SelectItem value="250/500">250/500</SelectItem>
                    <SelectItem value="unsure">Not Sure</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </div>
      )}
    </div>
  );

  // Home Insurance Steps
  const HomeStep3PropertyDetails = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-white">Property Details</h3>
        <p className="text-gray-400 text-sm">Tell us about the property you want to insure</p>
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
        <FormField
          control={form.control}
          name="propertyType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Property Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="single-family">Single Family</SelectItem>
                  <SelectItem value="condo">Condo</SelectItem>
                  <SelectItem value="townhome">Townhome</SelectItem>
                  <SelectItem value="multi-family">Multi-family</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
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
        <h3 className="text-xl font-semibold text-white">Property Condition</h3>
        <p className="text-gray-400 text-sm">This helps us get you the best rate (4-point inspection data)</p>
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

      <FormField
        control={form.control}
        name="systemsUpdated"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Have you updated Electrical, Plumbing, or Heating in the last 20 years?</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
                <SelectItem value="unsure">Not Sure</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />
    </div>
  );

  const HomeStep5Occupancy = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-white">Occupancy Information</h3>
        <p className="text-gray-400 text-sm">A few more details about the property</p>
      </div>
      
      <FormField
        control={form.control}
        name="isPrimaryResidence"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Is this your primary residence?</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No (Secondary/Investment)</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="hasPool"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Do you have a swimming pool?</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="no">No</SelectItem>
                <SelectItem value="yes-fenced">Yes, with fence</SelectItem>
                <SelectItem value="yes-unfenced">Yes, no fence</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />
    </div>
  );

  // Life Insurance Steps
  const LifeStep3PersonalStats = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-white">Personal Information</h3>
        <p className="text-gray-400 text-sm">Basic details for your life insurance quote</p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="lifeDob"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date of Birth</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gender</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
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
        <h3 className="text-xl font-semibold text-white">Health Information</h3>
        <p className="text-gray-400 text-sm">This helps determine your coverage options</p>
      </div>
      
      <FormField
        control={form.control}
        name="usesTobacco"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Have you used tobacco/nicotine in the last 12 months?</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="no">No</SelectItem>
                <SelectItem value="yes">Yes</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="hasMedicalConditions"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Do you have any major medical conditions (Heart, Cancer, Diabetes)?</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="no">No</SelectItem>
                <SelectItem value="yes">Yes</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />
    </div>
  );

  const LifeStep5CoverageNeeds = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-white">Coverage Needs</h3>
        <p className="text-gray-400 text-sm">Tell us about the coverage you're looking for</p>
      </div>
      
      <FormField
        control={form.control}
        name="lifeType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Type of Life Insurance</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="term">Term Life</SelectItem>
                <SelectItem value="permanent">Permanent (Whole Life)</SelectItem>
                <SelectItem value="unsure">Not Sure - Help Me Decide</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="coverageAmount"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Coverage Amount</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select amount" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="100k">$100,000</SelectItem>
                <SelectItem value="250k">$250,000</SelectItem>
                <SelectItem value="500k">$500,000</SelectItem>
                <SelectItem value="1m">$1,000,000</SelectItem>
                <SelectItem value="2m">$2,000,000+</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="termLength"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Term Length (if applicable)</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select term" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="10">10 Years</SelectItem>
                <SelectItem value="20">20 Years</SelectItem>
                <SelectItem value="30">30 Years</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />
    </div>
  );

  // Commercial Insurance Steps
  const CommercialStep3BusinessProfile = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-white">Business Profile</h3>
        <p className="text-gray-400 text-sm">Tell us about your business</p>
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

      <FormField
        control={form.control}
        name="yearsInBusiness"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Years in Business</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="startup">Less than 1 year</SelectItem>
                <SelectItem value="1-3">1-3 years</SelectItem>
                <SelectItem value="3-5">3-5 years</SelectItem>
                <SelectItem value="5-10">5-10 years</SelectItem>
                <SelectItem value="10+">10+ years</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />
    </div>
  );

  const CommercialStep4Scale = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-white">Business Scale</h3>
        <p className="text-gray-400 text-sm">Help us understand the size of your operation</p>
      </div>
      
      <FormField
        control={form.control}
        name="annualRevenue"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Estimated Annual Revenue</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select range" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="under-100k">Under $100,000</SelectItem>
                <SelectItem value="100k-500k">$100,000 - $500,000</SelectItem>
                <SelectItem value="500k-1m">$500,000 - $1,000,000</SelectItem>
                <SelectItem value="1m-5m">$1,000,000 - $5,000,000</SelectItem>
                <SelectItem value="5m+">$5,000,000+</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />

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
        <h3 className="text-xl font-semibold text-white">Coverage Needs</h3>
        <p className="text-gray-400 text-sm">Select all the coverage types you're interested in</p>
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

  // Render the appropriate step content
  const renderStepContent = () => {
    if (currentStep === 1) return <Step1ContactInfo />;
    if (currentStep === 2) return <Step2PolicyType />;
    
    // Policy-specific steps
    if (policyType === "auto") {
      if (currentStep === 3) return <AutoStep3VehicleDetails />;
      if (currentStep === 4) return <AutoStep4DriverDetails />;
      if (currentStep === 5) return <AutoStep5CurrentCoverage />;
    }
    
    if (policyType === "home") {
      if (currentStep === 3) return <HomeStep3PropertyDetails />;
      if (currentStep === 4) return <HomeStep4RiskFactors />;
      if (currentStep === 5) return <HomeStep5Occupancy />;
    }
    
    if (policyType === "life") {
      if (currentStep === 3) return <LifeStep3PersonalStats />;
      if (currentStep === 4) return <LifeStep4Health />;
      if (currentStep === 5) return <LifeStep5CoverageNeeds />;
    }
    
    if (policyType === "commercial") {
      if (currentStep === 3) return <CommercialStep3BusinessProfile />;
      if (currentStep === 4) return <CommercialStep4Scale />;
      if (currentStep === 5) return <CommercialStep5Needs />;
    }
    
    return null;
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent 
        className="max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900/75 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl select-none [&_label]:text-white [&_input]:bg-white [&_input]:text-black [&_input]:placeholder:text-gray-500 [&_select]:bg-white [&_select]:text-black [&_textarea]:bg-white [&_textarea]:text-black"
        aria-describedby="quote-form-description"
      >
        <DialogHeader className="pb-2">
          <DialogTitle className="text-3xl font-bold text-white text-center">
            Get Quoted Today
          </DialogTitle>
          <p id="quote-form-description" className="text-gray-400 text-center text-sm">
            Complete the form to receive your personalized quote
          </p>
        </DialogHeader>

        <StepIndicator />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="min-h-[300px]">
              {renderStepContent()}
            </div>

            <div className="flex justify-between pt-6 border-t border-white/10">
              <Button
                type="button"
                variant="ghost"
                onClick={handleBack}
                disabled={currentStep === 1}
                className="gap-2 text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-30"
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
                  type="submit"
                  disabled={submitMutation.isPending}
                  className="gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold shadow-lg shadow-blue-500/25 transition-all duration-300 hover:shadow-blue-500/40"
                  data-testid="button-submit-quote"
                >
                  {submitMutation.isPending ? "Submitting..." : "Submit Quote Request"}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
