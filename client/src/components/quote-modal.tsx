import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { X, ChevronLeft, ChevronRight, Car, Home, Heart, Building2, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useTranslation } from "./theme-provider";
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

function createQuoteFormSchema(t: ReturnType<typeof import("@/lib/translations").getTranslations>) {
  return z.object({
    firstName: z.string().min(1, t.quote.validationFirstName),
    lastName: z.string().min(1, t.quote.validationLastName),
    email: z.string().email(t.quote.validationEmail),
    phone: z.string().min(10, t.quote.validationPhone),
    mailingAddress: z.string().min(1, "Please enter your mailing address"),
    zipCode: z.string().min(5, t.quote.validationZip),

    policyType: z.string().min(1, t.quote.validationPolicyType),
  
  garagingZip: z.string().optional(),
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
  
  lifeDob: z.string().optional(),
  gender: z.string().optional(),
  height: z.string().optional(),
  weight: z.string().optional(),
  usesTobacco: z.string().optional(),
  hasMedicalConditions: z.string().optional(),
  lifeType: z.string().optional(),
  coverageAmount: z.string().optional(),
  termLength: z.string().optional(),
  
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
}

type QuoteFormData = z.infer<ReturnType<typeof createQuoteFormSchema>>;

interface QuoteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function QuoteModal({ open, onOpenChange }: QuoteModalProps) {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);

  const policyOptions = [
    { value: "auto", label: t.quote.auto, icon: Car, description: t.quote.autoDesc },
    { value: "home", label: t.quote.home, icon: Home, description: t.quote.homeDesc },
    { value: "life", label: t.quote.life, icon: Heart, description: t.quote.lifeDesc },
    { value: "commercial", label: t.quote.commercial, icon: Building2, description: t.quote.commercialDesc },
  ];

  const quoteFormSchema = useMemo(() => createQuoteFormSchema(t), [t]);
  
  const form = useForm<QuoteFormData>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      zipCode: "",
      policyType: "",
      mailingAddress: "",
      garagingZip: "",
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

  useEffect(() => {
    if (policyType && currentStep > 2) {
      setCurrentStep(2);
    }
  }, [policyType]);

  const getTotalSteps = () => {
    if (!policyType) return 2;
    switch (policyType) {
      case "auto": return 5;
      case "home": return 5;
      case "life": return 5;
      case "commercial": return 5;
      default: return 2;
    }
  };

  const totalSteps = getTotalSteps();

  const submitMutation = useMutation({
    mutationFn: async (data: QuoteFormData) => {
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
        fieldsToValidate = ["firstName", "lastName", "email", "phone", "mailingAddress", "zipCode"];
        break;
      case 2:
        fieldsToValidate = ["policyType"];
        break;
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

  const [highestProgress, setHighestProgress] = useState(0);

  const handleClose = () => {
    form.reset();
    setCurrentStep(1);
    setHighestProgress(0);
    setShowSuccess(false);
    onOpenChange(false);
  };

  const calculateWeightedProgress = () => {
    if (showSuccess) {
      return 100;
    }
    
    if (currentStep === 1) {
      return 0;
    } else if (currentStep === 2) {
      return 20;
    } else if (currentStep === totalSteps) {
      return 95;
    } else {
      const riskSteps = totalSteps - 3;
      const currentRiskStep = currentStep - 2;
      const progressPerRiskStep = 50 / Math.max(riskSteps, 1);
      return 35 + (currentRiskStep - 1) * progressPerRiskStep;
    }
  };

  const successContent = (
    <div className="text-center py-12 space-y-6">
      <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
        <Check className="w-10 h-10 text-green-600" />
      </div>
      <div className="space-y-2">
        <h3 className="text-2xl font-bold text-slate-800">{t.quote.thankYou}</h3>
        <p className="text-slate-600 max-w-md mx-auto">
          {t.quote.successMessage}
        </p>
      </div>
      <Button
        onClick={handleClose}
        className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold shadow-lg shadow-blue-500/25 transition-all duration-300 hover:shadow-blue-500/40 px-8"
      >
        {t.quote.close}
      </Button>
    </div>
  );

  const rawProgress = calculateWeightedProgress();
  
  useEffect(() => {
    if (rawProgress > highestProgress) {
      setHighestProgress(rawProgress);
    }
  }, [rawProgress, highestProgress]);
  
  const displayProgress = Math.max(rawProgress, highestProgress);

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

  const Step1ContactInfo = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-slate-800">{t.quote.step1Title}</h3>
        <p className="text-slate-500 text-sm">{t.quote.step1Subtitle}</p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.quote.firstName}</FormLabel>
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
              <FormLabel>{t.quote.lastName}</FormLabel>
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
            <FormLabel>{t.quote.email}</FormLabel>
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
              <FormLabel>{t.quote.phone}</FormLabel>
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
              <FormLabel>{t.quote.zipCode}</FormLabel>
              <FormControl>
                <Input placeholder="32256" data-testid="input-zipcode" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="mailingAddress"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t.quote.mailingAddress}</FormLabel>
            <FormControl>
              <Input placeholder="123 Main St" data-testid="input-mailing-address" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );

  const Step2PolicyType = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-slate-800">{t.quote.step2Title}</h3>
        <p className="text-slate-500 text-sm">{t.quote.step2Subtitle}</p>
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

  const AutoStep3VehicleDetails = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-slate-800">{t.quote.vehicleDetailsTitle}</h3>
        <p className="text-slate-500 text-sm">{t.quote.vehicleDetailsSubtitle}</p>
      </div>

      <FormField
        control={form.control}
        name="garagingZip"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t.quote.garagingZipLabel}</FormLabel>
            <FormControl>
              <Input placeholder="32256" {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="vehicleYear"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.quote.vehicleYear}</FormLabel>
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
              <FormLabel>{t.quote.vehicleMake}</FormLabel>
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
              <FormLabel>{t.quote.vehicleModel}</FormLabel>
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
            <FormLabel>{t.quote.vehicleVin}</FormLabel>
            <FormControl>
              <Input placeholder="1HGBH41JXMN109186" {...field} />
            </FormControl>
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">{t.quote.primaryUse}</label>
          <Select onValueChange={(val) => form.setValue("primaryUse", val)} value={allValues.primaryUse || ""}>
            <SelectTrigger>
              <SelectValue placeholder={t.quote.selectUsage} />
            </SelectTrigger>
            <SelectContent position="popper" className="z-[9999]">
              <SelectItem value="commuting">{t.quote.commuting}</SelectItem>
              <SelectItem value="pleasure">{t.quote.pleasure}</SelectItem>
              <SelectItem value="business">{t.quote.business}</SelectItem>
              <SelectItem value="rideshare">Rideshare</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">{t.quote.ownershipStatus}</label>
          <Select onValueChange={(val) => form.setValue("ownershipStatus", val)} value={allValues.ownershipStatus || ""}>
            <SelectTrigger>
              <SelectValue placeholder={t.quote.selectStatus} />
            </SelectTrigger>
            <SelectContent position="popper" className="z-[9999]">
              <SelectItem value="owned">{t.quote.owned}</SelectItem>
              <SelectItem value="financed">{t.quote.financed}</SelectItem>
              <SelectItem value="leased">{t.quote.leased}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  const AutoStep4DriverDetails = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-slate-800">{t.quote.driverInfoTitle}</h3>
        <p className="text-slate-500 text-sm">{t.quote.driverInfoSubtitle}</p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">{t.quote.dob}</label>
          <Input
            type="date"
            value={allValues.driverDob || ""}
            onChange={(e) => form.setValue("driverDob", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">{t.quote.maritalStatus}</label>
          <Select onValueChange={(val) => form.setValue("maritalStatus", val)} value={allValues.maritalStatus || ""}>
            <SelectTrigger>
              <SelectValue placeholder={t.quote.selectMarital} />
            </SelectTrigger>
            <SelectContent position="popper" className="z-[9999]">
              <SelectItem value="single">{t.quote.single}</SelectItem>
              <SelectItem value="married">{t.quote.married}</SelectItem>
              <SelectItem value="divorced">{t.quote.divorced}</SelectItem>
              <SelectItem value="widowed">{t.quote.widowed}</SelectItem>
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
              <FormLabel>{t.quote.licenseState}</FormLabel>
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
              <FormLabel>{t.quote.licenseNumber}</FormLabel>
              <FormControl>
                <Input placeholder="D123-456-78-901-0" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium leading-none">{t.quote.accidents}</label>
        <Select onValueChange={(val) => form.setValue("hasViolations", val)} value={allValues.hasViolations || ""}>
          <SelectTrigger>
            <SelectValue placeholder={t.quote.selectAccidents} />
          </SelectTrigger>
          <SelectContent position="popper" className="z-[9999]">
            <SelectItem value="no">{t.quote.no}</SelectItem>
            <SelectItem value="yes">{t.quote.yes}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const AutoStep5CurrentCoverage = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-slate-800">{t.quote.currentCoverageTitle}</h3>
        <p className="text-slate-500 text-sm">{t.quote.currentCoverageSubtitle}</p>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium leading-none">{t.quote.currentlyInsured}</label>
        <Select onValueChange={(val) => form.setValue("currentlyInsured", val)} value={allValues.currentlyInsured || ""}>
          <SelectTrigger>
            <SelectValue placeholder={t.quote.selectAccidents} />
          </SelectTrigger>
          <SelectContent position="popper" className="z-[9999]">
            <SelectItem value="yes">{t.quote.yes}</SelectItem>
            <SelectItem value="no">{t.quote.no}</SelectItem>
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
                <FormLabel>{t.quote.currentCarrier}</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., State Farm, Geico" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">{t.quote.currentLimits}</label>
            <Select onValueChange={(val) => form.setValue("currentLimits", val)} value={allValues.currentLimits || ""}>
              <SelectTrigger>
                <SelectValue placeholder={t.quote.selectLimits} />
              </SelectTrigger>
              <SelectContent position="popper" className="z-[9999]">
                <SelectItem value="25/50">25/50</SelectItem>
                <SelectItem value="50/100">50/100</SelectItem>
                <SelectItem value="100/300">100/300</SelectItem>
                <SelectItem value="250/500">250/500</SelectItem>
                <SelectItem value="unsure">{t.quote.notSure}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );

  const HomeStep3PropertyDetails = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-slate-800">{t.quote.propertyDetailsTitle}</h3>
        <p className="text-slate-500 text-sm">{t.quote.propertyDetailsSubtitle}</p>
      </div>
      
      <FormField
        control={form.control}
        name="propertyAddress"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t.quote.streetAddress}</FormLabel>
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
              <FormLabel>{t.quote.city}</FormLabel>
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
              <FormLabel>{t.quote.state}</FormLabel>
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
              <FormLabel>{t.quote.zipCode}</FormLabel>
              <FormControl>
                <Input placeholder="32256" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">{t.quote.propertyType}</label>
          <Select onValueChange={(val) => form.setValue("propertyType", val)} value={allValues.propertyType || ""}>
            <SelectTrigger>
              <SelectValue placeholder={t.quote.selectType} />
            </SelectTrigger>
            <SelectContent position="popper" className="z-[9999]">
              <SelectItem value="single-family">{t.quote.singleFamily}</SelectItem>
              <SelectItem value="condo">{t.quote.condo}</SelectItem>
              <SelectItem value="townhome">{t.quote.townhome}</SelectItem>
              <SelectItem value="multi-family">{t.quote.multiFamily}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <FormField
          control={form.control}
          name="yearBuilt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.quote.yearBuilt}</FormLabel>
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
            <FormLabel>{t.quote.squareFootage}</FormLabel>
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
        <h3 className="text-xl font-semibold text-slate-800">{t.quote.propertyConditionTitle}</h3>
        <p className="text-slate-500 text-sm">{t.quote.propertyConditionSubtitle}</p>
      </div>
      
      <FormField
        control={form.control}
        name="roofYear"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t.quote.roofYear}</FormLabel>
            <FormControl>
              <Input placeholder="2018" {...field} />
            </FormControl>
          </FormItem>
        )}
      />

      <div className="space-y-2">
        <label className="text-sm font-medium leading-none">{t.quote.systemsUpdated}</label>
        <Select onValueChange={(val) => form.setValue("systemsUpdated", val)} value={allValues.systemsUpdated || ""}>
          <SelectTrigger>
            <SelectValue placeholder={t.quote.selectAccidents} />
          </SelectTrigger>
          <SelectContent position="popper" className="z-[9999]">
            <SelectItem value="yes">{t.quote.yes}</SelectItem>
            <SelectItem value="no">{t.quote.no}</SelectItem>
            <SelectItem value="unsure">{t.quote.notSure}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const HomeStep5Occupancy = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-slate-800">{t.quote.occupancyTitle}</h3>
        <p className="text-slate-500 text-sm">{t.quote.occupancySubtitle}</p>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium leading-none">{t.quote.primaryResidence}</label>
        <Select onValueChange={(val) => form.setValue("isPrimaryResidence", val)} value={allValues.isPrimaryResidence || ""}>
          <SelectTrigger>
            <SelectValue placeholder={t.quote.selectAccidents} />
          </SelectTrigger>
          <SelectContent position="popper" className="z-[9999]">
            <SelectItem value="yes">{t.quote.yes}</SelectItem>
            <SelectItem value="no">{t.quote.noSecondary}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium leading-none">{t.quote.pool}</label>
        <Select onValueChange={(val) => form.setValue("hasPool", val)} value={allValues.hasPool || ""}>
          <SelectTrigger>
            <SelectValue placeholder={t.quote.selectAccidents} />
          </SelectTrigger>
          <SelectContent position="popper" className="z-[9999]">
            <SelectItem value="no">{t.quote.no}</SelectItem>
            <SelectItem value="yes-fenced">{t.quote.yesFenced}</SelectItem>
            <SelectItem value="yes-unfenced">{t.quote.yesUnfenced}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const LifeStep3PersonalStats = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-slate-800">{t.quote.personalInfoTitle}</h3>
        <p className="text-slate-500 text-sm">{t.quote.personalInfoSubtitle}</p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">{t.quote.dob}</label>
          <Input
            type="date"
            value={allValues.lifeDob || ""}
            onChange={(e) => form.setValue("lifeDob", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">{t.quote.gender}</label>
          <Select onValueChange={(val) => form.setValue("gender", val)} value={allValues.gender || ""}>
            <SelectTrigger>
              <SelectValue placeholder={t.quote.selectAccidents} />
            </SelectTrigger>
            <SelectContent position="popper" className="z-[9999]">
              <SelectItem value="male">{t.quote.male}</SelectItem>
              <SelectItem value="female">{t.quote.female}</SelectItem>
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
              <FormLabel>{t.quote.height}</FormLabel>
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
              <FormLabel>{t.quote.weight}</FormLabel>
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
        <h3 className="text-xl font-semibold text-slate-800">{t.quote.healthTitle}</h3>
        <p className="text-slate-500 text-sm">{t.quote.healthSubtitle}</p>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium leading-none">{t.quote.tobacco}</label>
        <Select onValueChange={(val) => form.setValue("usesTobacco", val)} value={allValues.usesTobacco || ""}>
          <SelectTrigger>
            <SelectValue placeholder={t.quote.selectAccidents} />
          </SelectTrigger>
          <SelectContent position="popper" className="z-[9999]">
            <SelectItem value="no">{t.quote.no}</SelectItem>
            <SelectItem value="yes">{t.quote.yes}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium leading-none">{t.quote.medicalConditions}</label>
        <Select onValueChange={(val) => form.setValue("hasMedicalConditions", val)} value={allValues.hasMedicalConditions || ""}>
          <SelectTrigger>
            <SelectValue placeholder={t.quote.selectAccidents} />
          </SelectTrigger>
          <SelectContent position="popper" className="z-[9999]">
            <SelectItem value="no">{t.quote.no}</SelectItem>
            <SelectItem value="yes">{t.quote.yes}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const LifeStep5CoverageNeeds = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-slate-800">{t.quote.coverageNeedsTitle}</h3>
        <p className="text-slate-500 text-sm">{t.quote.coverageNeedsSubtitle}</p>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium leading-none">{t.quote.lifeType}</label>
        <Select onValueChange={(val) => form.setValue("lifeType", val)} value={allValues.lifeType || ""}>
          <SelectTrigger>
            <SelectValue placeholder={t.quote.selectLifeType} />
          </SelectTrigger>
          <SelectContent position="popper" className="z-[9999]">
            <SelectItem value="term">{t.quote.termLife}</SelectItem>
            <SelectItem value="permanent">{t.quote.permanentLife}</SelectItem>
            <SelectItem value="unsure">{t.quote.helpDecide}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium leading-none">{t.quote.coverageAmount}</label>
        <Select onValueChange={(val) => form.setValue("coverageAmount", val)} value={allValues.coverageAmount || ""}>
          <SelectTrigger>
            <SelectValue placeholder={t.quote.selectAmount} />
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
        <label className="text-sm font-medium leading-none">{t.quote.termLength}</label>
        <Select onValueChange={(val) => form.setValue("termLength", val)} value={allValues.termLength || ""}>
          <SelectTrigger>
            <SelectValue placeholder={t.quote.selectTerm} />
          </SelectTrigger>
          <SelectContent position="popper" className="z-[9999]">
            <SelectItem value="10">{t.quote.years10}</SelectItem>
            <SelectItem value="20">{t.quote.years20}</SelectItem>
            <SelectItem value="30">{t.quote.years30}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const CommercialStep3BusinessProfile = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-slate-800">{t.quote.businessProfileTitle}</h3>
        <p className="text-slate-500 text-sm">{t.quote.businessProfileSubtitle}</p>
      </div>
      
      <FormField
        control={form.control}
        name="businessName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t.quote.businessName}</FormLabel>
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
            <FormLabel>{t.quote.industryDesc}</FormLabel>
            <FormControl>
              <Textarea placeholder="e.g., Plumbing Contractor, Restaurant, IT Consulting" {...field} />
            </FormControl>
          </FormItem>
        )}
      />

      <div className="space-y-2">
        <label className="text-sm font-medium leading-none">{t.quote.yearsInBusiness}</label>
        <Select onValueChange={(val) => form.setValue("yearsInBusiness", val)} value={allValues.yearsInBusiness || ""}>
          <SelectTrigger>
            <SelectValue placeholder={t.quote.selectAccidents} />
          </SelectTrigger>
          <SelectContent position="popper" className="z-[9999]">
            <SelectItem value="startup">{t.quote.lessThan1}</SelectItem>
            <SelectItem value="1-3">{t.quote.years1to3}</SelectItem>
            <SelectItem value="3-5">{t.quote.years3to5}</SelectItem>
            <SelectItem value="5-10">{t.quote.years5to10}</SelectItem>
            <SelectItem value="10+">{t.quote.years10plus}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const CommercialStep4Scale = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-slate-800">{t.quote.businessScaleTitle}</h3>
        <p className="text-slate-500 text-sm">{t.quote.businessScaleSubtitle}</p>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium leading-none">{t.quote.annualRevenue}</label>
        <Select onValueChange={(val) => form.setValue("annualRevenue", val)} value={allValues.annualRevenue || ""}>
          <SelectTrigger>
            <SelectValue placeholder={t.quote.selectRange} />
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
              <FormLabel>{t.quote.fullTimeEmployees}</FormLabel>
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
              <FormLabel>{t.quote.partTimeEmployees}</FormLabel>
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
        <h3 className="text-xl font-semibold text-slate-800">{t.quote.coverageTypesTitle}</h3>
        <p className="text-slate-500 text-sm">{t.quote.coverageTypesSubtitle}</p>
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
                <FormLabel className="font-medium cursor-pointer">{t.quote.generalLiability}</FormLabel>
                <p className="text-sm text-muted-foreground">{t.quote.generalLiabilityDesc}</p>
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
                <FormLabel className="font-medium cursor-pointer">{t.quote.workersComp}</FormLabel>
                <p className="text-sm text-muted-foreground">{t.quote.workersCompDesc}</p>
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
                <FormLabel className="font-medium cursor-pointer">{t.quote.professionalLiability}</FormLabel>
                <p className="text-sm text-muted-foreground">{t.quote.professionalLiabilityDesc}</p>
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
                <FormLabel className="font-medium cursor-pointer">{t.quote.cyberInsurance}</FormLabel>
                <p className="text-sm text-muted-foreground">{t.quote.cyberInsuranceDesc}</p>
              </div>
            </FormItem>
          )}
        />
      </div>
    </div>
  );

  const renderStepContent = () => {
    if (currentStep === 1) return Step1ContactInfo();
    if (currentStep === 2) return Step2PolicyType();
    
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
            {showSuccess ? t.quote.successTitle : t.quote.dialogTitle}
          </DialogTitle>
          {!showSuccess && (
            <p id="quote-form-description" className="text-slate-600 text-center text-sm">
              {t.quote.dialogSubtitle}
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
                  {t.quote.back}
                </Button>
                
                {currentStep < totalSteps ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold shadow-lg shadow-blue-500/25 transition-all duration-300 hover:shadow-blue-500/40"
                    data-testid="button-next"
                  >
                    {t.quote.next}
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
                    {submitMutation.isPending ? "Submitting..." : t.quote.submitQuote}
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
