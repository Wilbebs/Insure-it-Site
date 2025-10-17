import { X, Upload } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const baseFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  insuranceType: z.string().min(1, "Please select an insurance type"),
});

const autoInsuranceSchema = baseFormSchema.extend({
  vehicleYear: z.string().min(4, "Vehicle year is required"),
  vehicleMake: z.string().min(2, "Vehicle make is required"),
  vehicleModel: z.string().min(2, "Vehicle model is required"),
  registrationDoc: z.any().optional(),
});

const homeInsuranceSchema = baseFormSchema.extend({
  propertyAddress: z.string().min(5, "Property address is required"),
  propertyValue: z.string().min(1, "Property value is required"),
  yearBuilt: z.string().min(4, "Year built is required"),
  propertyDoc: z.any().optional(),
});

const lifeInsuranceSchema = baseFormSchema.extend({
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  coverageAmount: z.string().min(1, "Coverage amount is required"),
  beneficiaries: z.string().min(2, "Beneficiary information is required"),
  medicalDoc: z.any().optional(),
});

const healthInsuranceSchema = baseFormSchema.extend({
  numberOfPeople: z.string().min(1, "Number of people is required"),
  preExistingConditions: z.string().optional(),
  medicalRecords: z.any().optional(),
});

const commercialInsuranceSchema = baseFormSchema.extend({
  businessName: z.string().min(2, "Business name is required"),
  businessType: z.string().min(2, "Business type is required"),
  numberOfEmployees: z.string().min(1, "Number of employees is required"),
  businessDoc: z.any().optional(),
});

type QuoteFormValues = z.infer<typeof baseFormSchema> & {
  vehicleYear?: string;
  vehicleMake?: string;
  vehicleModel?: string;
  registrationDoc?: File;
  propertyAddress?: string;
  propertyValue?: string;
  yearBuilt?: string;
  propertyDoc?: File;
  dateOfBirth?: string;
  coverageAmount?: string;
  beneficiaries?: string;
  medicalDoc?: File;
  numberOfPeople?: string;
  preExistingConditions?: string;
  medicalRecords?: File;
  businessName?: string;
  businessType?: string;
  numberOfEmployees?: string;
  businessDoc?: File;
};

export default function QuoteModal({ isOpen, onClose }: QuoteModalProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedInsurance, setSelectedInsurance] = useState<string>("");

  const getSchema = () => {
    switch (selectedInsurance) {
      case 'auto': return autoInsuranceSchema;
      case 'home': return homeInsuranceSchema;
      case 'life': return lifeInsuranceSchema;
      case 'health': return healthInsuranceSchema;
      case 'commercial': return commercialInsuranceSchema;
      default: return baseFormSchema;
    }
  };

  const form = useForm<QuoteFormValues>({
    resolver: zodResolver(getSchema()),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      insuranceType: "",
      vehicleYear: "",
      vehicleMake: "",
      vehicleModel: "",
      propertyAddress: "",
      propertyValue: "",
      yearBuilt: "",
      dateOfBirth: "",
      coverageAmount: "",
      beneficiaries: "",
      numberOfPeople: "",
      preExistingConditions: "",
      businessName: "",
      businessType: "",
      numberOfEmployees: "",
    },
  });

  // Reset form when insurance type changes
  useEffect(() => {
    if (selectedInsurance) {
      const currentValues = form.getValues();
      form.reset({
        name: currentValues.name,
        email: currentValues.email,
        phone: currentValues.phone,
        insuranceType: currentValues.insuranceType,
      });
    }
  }, [selectedInsurance, form]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const onSubmit = async (data: QuoteFormValues) => {
    setIsSubmitting(true);
    try {
      const payload: Record<string, any> = {
        fullName: data.name,
        emailAddress: data.email,
        phoneNumber: data.phone,
        policyType: data.insuranceType,
      };

      if (selectedInsurance === 'auto') {
        payload.vehicleYear = data.vehicleYear;
        payload.vehicleMake = data.vehicleMake;
        payload.vehicleModel = data.vehicleModel;
      } else if (selectedInsurance === 'home') {
        payload.propertyAddress = data.propertyAddress;
        payload.estimatedValue = data.propertyValue;
        payload.yearBuilt = data.yearBuilt;
      } else if (selectedInsurance === 'life') {
        payload.dateOfBirth = data.dateOfBirth;
        payload.coverageAmount = data.coverageAmount;
        payload.beneficiaries = data.beneficiaries;
      } else if (selectedInsurance === 'health') {
        payload.numberOfPeople = data.numberOfPeople;
        payload.preExistingConditions = data.preExistingConditions;
      } else if (selectedInsurance === 'commercial') {
        payload.businessName = data.businessName;
        payload.businessType = data.businessType;
        payload.numberOfEmployees = data.numberOfEmployees;
      }

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      const result = await response.json();
      
      toast({
        title: "Quote Request Submitted!",
        description: "We'll contact you shortly with your personalized quote.",
      });
      
      form.reset();
      setSelectedInsurance("");
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-lg"
            onClick={onClose}
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative max-w-2xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto scrollbar-custom"
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(59, 130, 246, 0.5) transparent'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full bg-white/30 dark:bg-slate-900/30 backdrop-blur-2xl rounded-[3rem] shadow-2xl border border-white/30 overflow-hidden">
                <button
                  onClick={onClose}
                  className="absolute top-6 right-6 z-10 bg-white/60 dark:bg-slate-800/60 hover:bg-white/80 dark:hover:bg-slate-800/80 rounded-full p-3 transition-all hover:scale-110 shadow-lg backdrop-blur-sm"
                  data-testid="modal-close"
                  aria-label="Close modal"
                >
                  <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                </button>

                <div className="p-10 md:p-14">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-center mb-10"
                  >
                    <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent mb-3">
                      Get Your Free Quote
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300 text-lg">
                      Fill out the form below and we'll get back to you shortly
                    </p>
                  </motion.div>

                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      {/* Base Fields */}
                      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-800 dark:text-gray-200 font-semibold">Full Name</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="John Doe" className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-white/40 focus:border-blue-400 rounded-2xl h-12 text-lg" data-testid="input-name" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>

                      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-800 dark:text-gray-200 font-semibold">Email</FormLabel>
                              <FormControl>
                                <Input {...field} type="email" placeholder="john@example.com" className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-white/40 focus:border-blue-400 rounded-2xl h-12 text-lg" data-testid="input-email" />
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
                              <FormLabel className="text-gray-800 dark:text-gray-200 font-semibold">Phone</FormLabel>
                              <FormControl>
                                <Input {...field} type="tel" placeholder="(555) 123-4567" className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-white/40 focus:border-blue-400 rounded-2xl h-12 text-lg" data-testid="input-phone" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>

                      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                        <FormField
                          control={form.control}
                          name="insuranceType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-800 dark:text-gray-200 font-semibold">Insurance Type</FormLabel>
                              <Select onValueChange={(value) => { field.onChange(value); setSelectedInsurance(value); }} value={field.value}>
                                <FormControl>
                                  <SelectTrigger className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-white/40 focus:border-blue-400 rounded-2xl h-12 text-lg" data-testid="select-insurance-type">
                                    <SelectValue placeholder="Select insurance type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="auto">Auto Insurance</SelectItem>
                                  <SelectItem value="home">Home Insurance</SelectItem>
                                  <SelectItem value="life">Life Insurance</SelectItem>
                                  <SelectItem value="health">Health Insurance</SelectItem>
                                  <SelectItem value="commercial">Commercial Insurance</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>

                      {/* Auto Insurance Fields */}
                      {selectedInsurance === 'auto' && (
                        <>
                          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <FormField control={form.control} name="vehicleYear" render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-800 dark:text-gray-200 font-semibold">Year</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="2020" className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-white/40 focus:border-blue-400 rounded-2xl h-12 text-lg" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )} />
                            <FormField control={form.control} name="vehicleMake" render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-800 dark:text-gray-200 font-semibold">Make</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="Toyota" className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-white/40 focus:border-blue-400 rounded-2xl h-12 text-lg" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )} />
                            <FormField control={form.control} name="vehicleModel" render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-800 dark:text-gray-200 font-semibold">Model</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="Camry" className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-white/40 focus:border-blue-400 rounded-2xl h-12 text-lg" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )} />
                          </motion.div>
                          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                            <FormField control={form.control} name="registrationDoc" render={({ field: { value, onChange, ...field } }) => (
                              <FormItem>
                                <FormLabel className="text-gray-800 dark:text-gray-200 font-semibold">Vehicle Registration (Optional)</FormLabel>
                                <FormControl>
                                  <div className="relative flex justify-center">
                                    <Input
                                      {...field}
                                      type="file"
                                      accept=".pdf,.jpg,.jpeg,.png"
                                      onChange={(e) => onChange(e.target.files?.[0])}
                                      className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-white/40 focus:border-blue-400 rounded-2xl h-12 text-center file:mx-auto file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )} />
                          </motion.div>
                        </>
                      )}

                      {/* Home Insurance Fields */}
                      {selectedInsurance === 'home' && (
                        <>
                          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                            <FormField control={form.control} name="propertyAddress" render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-800 dark:text-gray-200 font-semibold">Property Address</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="123 Main St, Miami, FL 33101" className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-white/40 focus:border-blue-400 rounded-2xl h-12 text-lg" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )} />
                          </motion.div>
                          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField control={form.control} name="propertyValue" render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-800 dark:text-gray-200 font-semibold">Estimated Value</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="$350,000" className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-white/40 focus:border-blue-400 rounded-2xl h-12 text-lg" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )} />
                            <FormField control={form.control} name="yearBuilt" render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-800 dark:text-gray-200 font-semibold">Year Built</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="1995" className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-white/40 focus:border-blue-400 rounded-2xl h-12 text-lg" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )} />
                          </motion.div>
                          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
                            <FormField control={form.control} name="propertyDoc" render={({ field: { value, onChange, ...field } }) => (
                              <FormItem>
                                <FormLabel className="text-gray-800 dark:text-gray-200 font-semibold">Property Documents (Optional)</FormLabel>
                                <FormControl>
                                  <div className="flex justify-center">
                                    <Input
                                      {...field}
                                      type="file"
                                      accept=".pdf,.jpg,.jpeg,.png"
                                      onChange={(e) => onChange(e.target.files?.[0])}
                                      className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-white/40 focus:border-blue-400 rounded-2xl h-12 text-center file:mx-auto file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )} />
                          </motion.div>
                        </>
                      )}

                      {/* Life Insurance Fields */}
                      {selectedInsurance === 'life' && (
                        <>
                          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField control={form.control} name="dateOfBirth" render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-800 dark:text-gray-200 font-semibold">Date of Birth</FormLabel>
                                <FormControl>
                                  <Input {...field} type="date" className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-white/40 focus:border-blue-400 rounded-2xl h-12 text-lg" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )} />
                            <FormField control={form.control} name="coverageAmount" render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-800 dark:text-gray-200 font-semibold">Coverage Amount</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="$500,000" className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-white/40 focus:border-blue-400 rounded-2xl h-12 text-lg" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )} />
                          </motion.div>
                          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                            <FormField control={form.control} name="beneficiaries" render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-800 dark:text-gray-200 font-semibold">Beneficiaries</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="Spouse, Children" className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-white/40 focus:border-blue-400 rounded-2xl h-12 text-lg" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )} />
                          </motion.div>
                          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
                            <FormField control={form.control} name="medicalDoc" render={({ field: { value, onChange, ...field } }) => (
                              <FormItem>
                                <FormLabel className="text-gray-800 dark:text-gray-200 font-semibold">Medical Records (Optional)</FormLabel>
                                <FormControl>
                                  <div className="flex justify-center">
                                    <Input
                                      {...field}
                                      type="file"
                                      accept=".pdf,.jpg,.jpeg,.png"
                                      onChange={(e) => onChange(e.target.files?.[0])}
                                      className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-white/40 focus:border-blue-400 rounded-2xl h-12 text-center file:mx-auto file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )} />
                          </motion.div>
                        </>
                      )}

                      {/* Health Insurance Fields */}
                      {selectedInsurance === 'health' && (
                        <>
                          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                            <FormField control={form.control} name="numberOfPeople" render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-800 dark:text-gray-200 font-semibold">Number of People to Cover</FormLabel>
                                <FormControl>
                                  <Input {...field} type="number" placeholder="4" className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-white/40 focus:border-blue-400 rounded-2xl h-12 text-lg" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )} />
                          </motion.div>
                          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                            <FormField control={form.control} name="preExistingConditions" render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-800 dark:text-gray-200 font-semibold">Pre-existing Conditions (Optional)</FormLabel>
                                <FormControl>
                                  <Textarea {...field} placeholder="List any relevant medical conditions..." className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-white/40 focus:border-blue-400 rounded-2xl min-h-[80px] text-lg resize-none" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )} />
                          </motion.div>
                          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
                            <FormField control={form.control} name="medicalRecords" render={({ field: { value, onChange, ...field } }) => (
                              <FormItem>
                                <FormLabel className="text-gray-800 dark:text-gray-200 font-semibold">Additional Medical Records (Optional)</FormLabel>
                                <FormControl>
                                  <div className="flex justify-center">
                                    <Input
                                      {...field}
                                      type="file"
                                      accept=".pdf,.jpg,.jpeg,.png"
                                      onChange={(e) => onChange(e.target.files?.[0])}
                                      className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-white/40 focus:border-blue-400 rounded-2xl h-12 text-center file:mx-auto file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )} />
                          </motion.div>
                        </>
                      )}

                      {/* Commercial Insurance Fields */}
                      {selectedInsurance === 'commercial' && (
                        <>
                          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                            <FormField control={form.control} name="businessName" render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-800 dark:text-gray-200 font-semibold">Business Name</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="ABC Company LLC" className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-white/40 focus:border-blue-400 rounded-2xl h-12 text-lg" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )} />
                          </motion.div>
                          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField control={form.control} name="businessType" render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-800 dark:text-gray-200 font-semibold">Business Type</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="Restaurant, Retail, etc." className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-white/40 focus:border-blue-400 rounded-2xl h-12 text-lg" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )} />
                            <FormField control={form.control} name="numberOfEmployees" render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-800 dark:text-gray-200 font-semibold">Number of Employees</FormLabel>
                                <FormControl>
                                  <Input {...field} type="number" placeholder="25" className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-white/40 focus:border-blue-400 rounded-2xl h-12 text-lg" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )} />
                          </motion.div>
                          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
                            <FormField control={form.control} name="businessDoc" render={({ field: { value, onChange, ...field } }) => (
                              <FormItem>
                                <FormLabel className="text-gray-800 dark:text-gray-200 font-semibold">Business License (Optional)</FormLabel>
                                <FormControl>
                                  <div className="flex justify-center">
                                    <Input
                                      {...field}
                                      type="file"
                                      accept=".pdf,.jpg,.jpeg,.png"
                                      onChange={(e) => onChange(e.target.files?.[0])}
                                      className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-white/40 focus:border-blue-400 rounded-2xl h-12 text-center file:mx-auto file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )} />
                          </motion.div>
                        </>
                      )}

                      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white text-lg font-bold py-6 rounded-full shadow-xl hover:shadow-2xl transition-all hover:scale-105"
                          data-testid="button-submit-quote"
                        >
                          {isSubmitting ? "Submitting..." : "Get Your Free Quote"}
                        </Button>
                      </motion.div>
                    </form>
                  </Form>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
