// /client/src/pages/plans.tsx

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  Lightbulb,
  Users,
  TrendingUp,
  Shield,
  Rocket,
  CheckCircle2,
  MessageSquarePlus,
} from "lucide-react";

interface FeatureRequest {
  id: number;
  title: string;
  description: string;
  priority: string;
  status: string;
  created_at: string;
}

export default function PlansPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Fetch feature requests
  const { data: featureRequests, isLoading } = useQuery({
    queryKey: ["/api/feature-requests"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/feature-requests");
      return response.data as FeatureRequest[];
    },
  });

  // Submit feature request
  const submitMutation = useMutation({
    mutationFn: async (data: { title: string; description: string }) => {
      return apiRequest("POST", "/api/feature-requests", data);
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Your feature request has been submitted.",
      });
      setTitle("");
      setDescription("");
      queryClient.invalidateQueries({ queryKey: ["/api/feature-requests"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit request. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a feature title.",
        variant: "destructive",
      });
      return;
    }
    submitMutation.mutate({ title, description });
  };

  const phases = [
    {
      phase: 1,
      title: "Foundation & Core Features",
      icon: Rocket,
      color: "text-blue-500",
      features: [
        {
          name: "Professional Homepage",
          priority: "High",
          description:
            "Modern landing page with hero section, insurance type cards, testimonials carousel, and contact form with file upload to AWS S3.",
        },
        {
          name: "Insurance Detail Pages",
          priority: "High",
          description:
            "Dedicated pages for Auto, Home, Life, Health, and Commercial insurance with detailed coverage information and visual animations.",
        },
      ],
    },
    {
      phase: 2,
      title: "User Experience & Engagement",
      icon: Users,
      color: "text-green-500",
      features: [
        {
          name: "Interactive Quote Calculator",
          priority: "High",
          description:
            "Step-by-step quote form with dynamic pricing estimates, policy comparison tools, and instant quote generation.",
        },
        {
          name: "Customer Portal",
          priority: "Medium",
          description:
            "Secure login for clients to view policies, make payments, file claims, upload documents, and track claim status.",
        },
      ],
    },
    {
      phase: 3,
      title: "Growth & Career Hub",
      icon: TrendingUp,
      color: "text-purple-500",
      features: [
        {
          name: "Careers & Hiring Section",
          priority: "Medium",
          description:
            "'Join Our Team of 150+ Insurance Professionals': Hiring in Tampa, Orlando, Jacksonville, Miami. Leadership development programs, agent success stories, open positions map.",
        },
        {
          name: "Leadership & Expertise",
          priority: "Low",
          description:
            "Executive team profiles with credentials, industry awards & recognitions, community involvement & charitable work, speaking engagements & media appearances.",
        },
      ],
    },
    {
      phase: 4,
      title: "Trust & Sophistication",
      icon: Shield,
      color: "text-orange-500",
      features: [
        {
          name: "Security & Compliance",
          priority: "Medium",
          description:
            "SOC 2 compliance roadmap, data encryption badges, privacy policy & HIPAA compliance for health insurance, regulatory licenses displayed prominently.",
        },
        {
          name: "Real-Time Features",
          priority: "High",
          description:
            "Live chat with licensed agents, appointment scheduling with calendar integration, instant policy binding capabilities, real-time claim status tracking.",
        },
      ],
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "text-red-500";
      case "medium":
        return "text-yellow-500";
      case "low":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navigation />

      <div className="container mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <Lightbulb className="w-16 h-16 text-yellow-500" />
          </div>
          <h1 className="text-5xl font-bold mb-6 gradient-text">
            Development Roadmap
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Building a world-class insurance platform for Insure-it Group.
            Track our progress and suggest new features below.
          </p>
        </div>

        {phases.map((phase) => {
          const Icon = phase.icon;
          return (
            <div key={phase.phase} className="mb-16">
              <div className="flex items-center gap-4 mb-8">
                <Icon className={`w-10 h-10 ${phase.color}`} />
                <h2 className="text-3xl font-bold">
                  Phase {phase.phase}: {phase.title}
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {phase.features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="insurance-card p-6 rounded-2xl hover-lift"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-xl font-bold">{feature.name}</h3>
                      <span
                        className={`text-sm font-semibold ${getPriorityColor(
                          feature.priority
                        )}`}
                      >
                        {feature.priority}
                      </span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        <div className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <MessageSquarePlus className="w-10 h-10 text-blue-500" />
            <h2 className="text-3xl font-bold">Feature Suggestions</h2>
          </div>

          <div className="insurance-card p-8 rounded-2xl">
            <h3 className="text-2xl font-bold mb-4">Add Feature Requests</h3>
            <p className="text-muted-foreground mb-6">
              Business owners can add features and ideas they want to see on the
              site
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                placeholder="Feature title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-lg"
              />
              <Textarea
                placeholder="Description (optional)..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="resize-none"
              />
              <Button
                type="submit"
                disabled={submitMutation.isPending}
                className="w-full"
              >
                <MessageSquarePlus className="w-4 h-4 mr-2" />
                {submitMutation.isPending
                  ? "Submitting..."
                  : "Add Feature Request"}
              </Button>
            </form>
          </div>
        </div>

        {/* Display submitted feature requests */}
        <div>
          <div className="flex items-center gap-4 mb-8">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
            <h2 className="text-3xl font-bold">Submitted Requests</h2>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading requests...</p>
            </div>
          ) : featureRequests && featureRequests.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {featureRequests.map((request) => (
                <div
                  key={request.id}
                  className="insurance-card p-6 rounded-2xl"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold">{request.title}</h3>
                    <span className="text-xs text-muted-foreground">
                      {new Date(request.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {request.description && (
                    <p className="text-muted-foreground mb-3">
                      {request.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm font-semibold px-3 py-1 rounded-full ${
                        request.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {request.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 insurance-card rounded-2xl">
              <p className="text-muted-foreground">
                No feature requests yet. Be the first to suggest one!
              </p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}