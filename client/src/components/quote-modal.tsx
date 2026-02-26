import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { X, Car, Home, Heart, Building2, Check } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

function createQuoteFormSchema(t: ReturnType<typeof import("@/lib/translations").getTranslations>) {
  return z.object({
    firstName: z.string().min(1, t.quote.validationFirstName),
    lastName: z.string().min(1, t.quote.validationLastName),
    email: z.string().email(t.quote.validationEmail),
    phone: z.string().min(10, t.quote.validationPhone),
    policyType: z.string().min(1, t.quote.validationPolicyType),
    message: z.string().optional(),

    /* ============================================================
     * COMMENTED OUT FOR LATER — Full policy-specific fields
     * These will be re-enabled when we build out the detailed
     * multi-step quote wizard with per-policy questions.
     * ============================================================
     *
     * mailingAddress: z.string().min(1, "Please enter your mailing address"),
     * zipCode: z.string().min(5, t.quote.validationZip),
     *
     * // Auto insurance fields
     * garagingZip: z.string().optional(),
     * vehicleYear: z.string().optional(),
     * vehicleMake: z.string().optional(),
     * vehicleModel: z.string().optional(),
     * vehicleVin: z.string().optional(),
     * primaryUse: z.string().optional(),
     * ownershipStatus: z.string().optional(),
     * driverDob: z.string().optional(),
     * maritalStatus: z.string().optional(),
     * licenseState: z.string().optional(),
     * licenseNumber: z.string().optional(),
     * hasViolations: z.string().optional(),
     * currentlyInsured: z.string().optional(),
     * currentCarrier: z.string().optional(),
     * currentLimits: z.string().optional(),
     *
     * // Home insurance fields
     * propertyAddress: z.string().optional(),
     * propertyCity: z.string().optional(),
     * propertyState: z.string().optional(),
     * propertyZip: z.string().optional(),
     * propertyType: z.string().optional(),
     * yearBuilt: z.string().optional(),
     * squareFootage: z.string().optional(),
     * roofYear: z.string().optional(),
     * systemsUpdated: z.string().optional(),
     * isPrimaryResidence: z.string().optional(),
     * hasPool: z.string().optional(),
     *
     * // Life insurance fields
     * lifeDob: z.string().optional(),
     * gender: z.string().optional(),
     * height: z.string().optional(),
     * weight: z.string().optional(),
     * usesTobacco: z.string().optional(),
     * hasMedicalConditions: z.string().optional(),
     * lifeType: z.string().optional(),
     * coverageAmount: z.string().optional(),
     * termLength: z.string().optional(),
     *
     * // Commercial insurance fields
     * businessName: z.string().optional(),
     * industryDescription: z.string().optional(),
     * yearsInBusiness: z.string().optional(),
     * annualRevenue: z.string().optional(),
     * fullTimeEmployees: z.string().optional(),
     * partTimeEmployees: z.string().optional(),
     * needsGeneralLiability: z.boolean().optional(),
     * needsWorkersComp: z.boolean().optional(),
     * needsProfessionalLiability: z.boolean().optional(),
     * needsCyber: z.boolean().optional(),
     */
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
      policyType: "",
      message: "",
    },
  });

  const policyType = form.watch("policyType");

  const submitMutation = useMutation({
    mutationFn: async (data: QuoteFormData) => {
      const formData = new FormData();
      formData.append("fullName", `${data.firstName} ${data.lastName}`.trim());
      formData.append("emailAddress", data.email);
      formData.append("phoneNumber", data.phone);
      formData.append("policyType", data.policyType);
      if (data.message) {
        formData.append("additionalInformation", data.message);
      }
      
      return apiRequest('POST', '/api/contact', formData);
    },
    onSuccess: () => {
      setShowSuccess(true);
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

  const onSubmit = (data: QuoteFormData) => {
    submitMutation.mutate(data);
  };

  const handleClose = () => {
    form.reset();
    setShowSuccess(false);
    onOpenChange(false);
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

        {showSuccess ? (
          successContent
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="text-center mb-2">
                <h3 className="text-xl font-semibold text-slate-800">{t.quote.step1Title}</h3>
                <p className="text-slate-500 text-sm">{t.quote.step1Subtitle}</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                name="policyType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.quote.step2Title}</FormLabel>
                    <FormControl>
                      <div className="grid grid-cols-2 gap-3">
                        {policyOptions.map((option) => {
                          const Icon = option.icon;
                          const isSelected = field.value === option.value;
                          return (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => field.onChange(option.value)}
                              data-testid={`policy-option-${option.value}`}
                              className={`p-4 rounded-2xl border transition-all duration-300 text-left ${
                                isSelected
                                  ? "border-blue-500 bg-blue-50 shadow-lg shadow-blue-500/20"
                                  : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"
                              }`}
                            >
                              <Icon className={`w-6 h-6 mb-2 ${isSelected ? "text-blue-600" : "text-slate-400"}`} />
                              <div className={`font-semibold text-sm ${isSelected ? "text-blue-700" : "text-slate-700"}`}>{option.label}</div>
                              <div className="text-xs text-slate-500">{option.description}</div>
                            </button>
                          );
                        })}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.quote.message || "Message"} <span className="text-slate-400 font-normal">({t.quote.optional || "optional"})</span></FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder={t.quote.messagePlaceholder || "Tell us about your insurance needs..."}
                        className="resize-none"
                        rows={3}
                        {...field} 
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={submitMutation.isPending}
                className="w-full gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold shadow-lg shadow-blue-500/25 transition-all duration-300 hover:shadow-blue-500/40 py-6 text-base"
                data-testid="button-submit-quote"
              >
                {submitMutation.isPending ? "Submitting..." : t.quote.submitQuote}
              </Button>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}

/* ============================================================
 * COMMENTED OUT FOR LATER — Multi-step policy-specific wizard
 * ============================================================
 *
 * The following step components and logic were part of the full
 * multi-step quote wizard. They collect detailed policy-specific
 * information (vehicle details, driver info, property details,
 * health info, business profile, etc.) and support multi-vehicle
 * and multi-driver entries for auto insurance.
 *
 * To re-enable:
 * 1. Uncomment the schema fields above
 * 2. Add back the step state management (currentStep, totalSteps)
 * 3. Restore the step components below
 * 4. Update renderStepContent() to route to the correct step
 *
 * --- Auto Insurance Steps ---
 * AutoStep3VehicleDetails: Vehicle year/make/model/VIN, usage, ownership
 *   - Supports multiple vehicles with Add/Remove
 * AutoStep4DriverDetails: DOB, marital status, license, violations
 *   - Supports multiple drivers with Add/Remove
 * AutoStep5CurrentCoverage: Currently insured, carrier, limits
 *
 * --- Home Insurance Steps ---
 * HomeStep3PropertyDetails: Property address, type, year built, sqft
 * HomeStep4RiskFactors: Roof year, systems updated
 * HomeStep5Occupancy: Primary residence, pool
 *
 * --- Life Insurance Steps ---
 * LifeStep3PersonalStats: DOB, gender, height, weight
 * LifeStep4Health: Tobacco, medical conditions
 * LifeStep5CoverageNeeds: Life type, amount, term
 *
 * --- Commercial Insurance Steps ---
 * CommercialStep3BusinessProfile: Business name, industry, years
 * CommercialStep4Scale: Revenue, employees
 * CommercialStep5Needs: GL, WC, E&O, Cyber checkboxes
 */
