import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { CloudUpload, X } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const contactFormSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  phoneNumber: z.string().min(10, "Please enter a valid phone number"),
  emailAddress: z.string().email("Please enter a valid email address"),
  policyType: z.string().min(1, "Please select a policy type"),
  coverageLevel: z.string().optional(),
  additionalInformation: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export default function ContactForm() {
  const { ref, isVisible } = useScrollAnimation();
  const { toast } = useToast();
  const [files, setFiles] = useState<File[]>([]);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      emailAddress: "",
      policyType: "",
      coverageLevel: "",
      additionalInformation: "",
    },
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(prev => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const submitMutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      const formData = new FormData();
      
      // Append form fields
      Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });

      // Append files
      files.forEach(file => {
        formData.append('documents', file);
      });

      return apiRequest('POST', '/api/contact', formData);
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Thank you for your interest! We will contact you within 24 hours.",
      });
      form.reset();
      setFiles([]);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to submit form. Please try again.",
        variant: "destructive",
      });
      console.error('Form submission error:', error);
    },
  });

  const onSubmit = (data: ContactFormData) => {
    submitMutation.mutate(data);
  };

  return (
    <section id="connect" className="py-20 bg-gradient-to-br from-primary/5 to-secondary/10" ref={ref} data-testid="contact-form-section">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold mb-6 gradient-text" data-testid="contact-title">Connect with Us!</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="contact-description">
            Ready to protect what matters most? Get personalized insurance solutions tailored to your needs. 
            Our expert agents are here to help you find the perfect coverage.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="insurance-card p-8 rounded-2xl">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter your full name" 
                            {...field} 
                            data-testid="input-name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="(555) 123-4567" 
                            {...field} 
                            data-testid="input-phone"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="emailAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address *</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="your.email@example.com" 
                          {...field} 
                          data-testid="input-email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="policyType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type of Policy *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-policy-type">
                              <SelectValue placeholder="Select a policy type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="auto">Auto Insurance</SelectItem>
                            <SelectItem value="home">Home Insurance</SelectItem>
                            <SelectItem value="life">Life Insurance</SelectItem>
                            <SelectItem value="health">Health Insurance</SelectItem>
                            <SelectItem value="commercial">Commercial Insurance</SelectItem>
                            <SelectItem value="multiple">Multiple Policies</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="coverageLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Coverage Level Needed</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-coverage-level">
                              <SelectValue placeholder="Select coverage level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="basic">Basic Coverage</SelectItem>
                            <SelectItem value="standard">Standard Coverage</SelectItem>
                            <SelectItem value="comprehensive">Comprehensive Coverage</SelectItem>
                            <SelectItem value="premium">Premium Coverage</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="additionalInformation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Information</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Tell us more about your insurance needs..." 
                          className="resize-none" 
                          rows={4}
                          {...field} 
                          data-testid="textarea-message"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div>
                  <FormLabel>Attach Documents (Optional)</FormLabel>
                  <div 
                    {...getRootProps()} 
                    className={`file-drop-zone rounded-lg p-8 text-center transition-all cursor-pointer mt-2 ${
                      isDragActive ? 'dragover' : ''
                    }`}
                    data-testid="file-drop-zone"
                  >
                    <input {...getInputProps()} />
                    <CloudUpload className="w-12 h-12 text-primary mx-auto mb-4" />
                    <p className="text-lg font-medium text-foreground mb-2">
                      {isDragActive ? 'Drop files here' : 'Drop files here or click to browse'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Upload insurance policies, inspection reports, or other relevant documents
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Supported formats: PDF, DOC, DOCX, JPG, PNG (Max 10MB)
                    </p>
                  </div>
                  
                  {files.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {files.map((file, index) => (
                        <div 
                          key={index} 
                          className="flex items-center justify-between p-2 bg-muted rounded-lg"
                          data-testid={`file-${index}`}
                        >
                          <span className="text-sm text-foreground">{file.name}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                            data-testid={`button-remove-file-${index}`}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="text-center pt-6">
                  <Button
                    type="submit"
                    className="bg-primary text-primary-foreground px-12 py-4 rounded-full font-semibold text-lg hover:bg-blue-600 transition-all hover-lift"
                    disabled={submitMutation.isPending}
                    data-testid="button-submit-form"
                  >
                    {submitMutation.isPending ? "Submitting..." : "Get Your Free Quote"}
                  </Button>
                  <p className="text-sm text-muted-foreground mt-4">
                    We'll respond within 24 hours with a personalized quote
                  </p>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
}
