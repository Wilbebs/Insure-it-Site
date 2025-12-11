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

  const { data: featureRequests, isLoading } = useQuery({
    queryKey: ["/api/feature-requests"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/feature-requests");
      return response.data as FeatureRequest[];
    },
  });

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

  const strategicGoals = [
    {
      icon: Users,
      title: "Client-Centric Growth",
      description: "Expand our client base while maintaining personalized service",
    },
    {
      icon: TrendingUp,
      title: "Digital Innovation",
      description: "Leverage technology to streamline insurance processes",
    },
    {
      icon: Shield,
      title: "Comprehensive Coverage",
      description: "Offer diverse insurance solutions for all Florida families",
    },
    {
      icon: Rocket,
      title: "Community Impact",
      description: "Strengthen our presence in local Florida communities",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 gradient-text">
              Strategic Plans & Feature Requests
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Help shape the future of Insure-It Group. Submit your ideas and suggestions below.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {strategicGoals.map((goal, index) => (
              <div
                key={index}
                className="insurance-card p-6 rounded-xl hover-lift"
                data-testid={`goal-card-${index}`}
              >
                <goal.icon className="w-10 h-10 text-primary mb-4" />
                <h3 className="font-semibold text-lg mb-2">{goal.title}</h3>
                <p className="text-sm text-muted-foreground">{goal.description}</p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="insurance-card p-8 rounded-xl">
              <div className="flex items-center gap-3 mb-6">
                <MessageSquarePlus className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold">Submit a Feature Request</h2>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Feature Title</label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter your feature idea..."
                    data-testid="input-feature-title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your feature in detail..."
                    rows={4}
                    data-testid="input-feature-description"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={submitMutation.isPending}
                  className="w-full"
                  data-testid="button-submit-feature"
                >
                  {submitMutation.isPending ? "Submitting..." : "Submit Request"}
                </Button>
              </form>
            </div>

            <div className="insurance-card p-8 rounded-xl">
              <div className="flex items-center gap-3 mb-6">
                <Lightbulb className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold">Recent Requests</h2>
              </div>

              {isLoading ? (
                <div className="text-center py-8 text-muted-foreground">
                  Loading requests...
                </div>
              ) : featureRequests && featureRequests.length > 0 ? (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {featureRequests.map((request) => (
                    <div
                      key={request.id}
                      className="p-4 bg-muted/50 rounded-lg"
                      data-testid={`feature-request-${request.id}`}
                    >
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium">{request.title}</h4>
                          {request.description && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {request.description}
                            </p>
                          )}
                          <span className="text-xs text-muted-foreground mt-2 block">
                            {new Date(request.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No feature requests yet. Be the first to submit one!
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
