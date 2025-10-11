import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, CheckCircle, Lightbulb, TrendingUp, Trash2, Edit, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CustomSuggestion {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
}

export default function PlansPage() {
  const [customSuggestions, setCustomSuggestions] = useState<CustomSuggestion[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const { toast } = useToast();

  const handleAddSuggestion = () => {
    if (!newTitle.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your suggestion.",
        variant: "destructive",
      });
      return;
    }

    const suggestion: CustomSuggestion = {
      id: Date.now().toString(),
      title: newTitle,
      description: newDescription,
      createdAt: new Date(),
    };

    setCustomSuggestions([...customSuggestions, suggestion]);
    setNewTitle('');
    setNewDescription('');
    
    toast({
      title: "Suggestion added!",
      description: "Your idea has been added to the strategic plan.",
    });
  };

  const handleDeleteSuggestion = (id: string) => {
    setCustomSuggestions(customSuggestions.filter(s => s.id !== id));
    toast({
      title: "Suggestion deleted",
      description: "The suggestion has been removed from the plan.",
    });
  };

  const handleStartEdit = (suggestion: CustomSuggestion) => {
    setEditingId(suggestion.id);
    setEditTitle(suggestion.title);
    setEditDescription(suggestion.description);
  };

  const handleSaveEdit = () => {
    if (!editTitle.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your suggestion.",
        variant: "destructive",
      });
      return;
    }

    setCustomSuggestions(customSuggestions.map(s => 
      s.id === editingId 
        ? { ...s, title: editTitle, description: editDescription }
        : s
    ));
    
    setEditingId(null);
    setEditTitle('');
    setEditDescription('');
    
    toast({
      title: "Suggestion updated!",
      description: "Your changes have been saved.",
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
    setEditDescription('');
  };

  const strategicInitiatives = [
    {
      category: "Phase 1: Enterprise Proof & Scale",
      icon: TrendingUp,
      items: [
        {
          title: "Growth Metrics Dashboard",
          description: "Dynamic stats section showing expansion: '15,000+ Families Across Florida', '$500M+ in Coverage Protected', '24/7 Claims Support'. Live counter animations for policies written and claims processed.",
          priority: "High Impact",
        },
        {
          title: "Interactive Florida Expansion Map",
          description: "Visual map showing coverage areas with expansion timeline. Demonstrates statewide presence and growth trajectory with interactive elements.",
          priority: "High Impact",
        },
        {
          title: "Industry Expertise & Specializations",
          description: "Industry-specific solutions: Healthcare providers, restaurants, construction, tech startups. Commercial fleet management, multi-state expansion capabilities, risk management consulting.",
          priority: "Medium",
        },
        {
          title: "Technology Showcase",
          description: "'Get a Quote in 60 Seconds' with AI-powered instant quotes. Digital policy management portal preview, mobile app roadmap, 24/7 AI chatbot for instant support.",
          priority: "High Impact",
        },
      ],
    },
    {
      category: "Phase 2: Enterprise Client Experience",
      icon: CheckCircle,
      items: [
        {
          title: "AI Chatbot Integration",
          description: "24/7 intelligent chatbot for instant customer support, quotes, and policy questions. Shows tech-forward approach and scalability.",
          priority: "High Impact",
        },
        {
          title: "Video Testimonials Section",
          description: "Professional video testimonials from clients and business owners. Case studies showing $100K+ claims handled smoothly, ROI calculator showing savings.",
          priority: "High Impact",
        },
        {
          title: "Intelligent Resource Center",
          description: "Insurance education hub with articles, videos, webinars. Industry reports & whitepapers positioning as thought leaders. Interactive risk assessment tools.",
          priority: "Medium",
        },
        {
          title: "Partner Ecosystem",
          description: "Network of 500+ repair shops and contractors. Preferred vendor partnerships, insurance carrier relationships, healthcare provider networks.",
          priority: "Medium",
        },
      ],
    },
    {
      category: "Phase 3: Growth & Career Hub",
      icon: Lightbulb,
      items: [
        {
          title: "Careers & Hiring Section",
          description: "'Join Our Team of 150+ Insurance Professionals'. Hiring in Tampa, Orlando, Jacksonville, Miami. Leadership development programs, agent success stories, open positions map.",
          priority: "Medium",
        },
        {
          title: "Leadership & Expertise",
          description: "Executive team profiles with credentials, industry awards & recognitions, community involvement & charitable work, speaking engagements & media appearances.",
          priority: "Low",
        },
      ],
    },
    {
      category: "Phase 4: Trust & Sophistication",
      icon: CheckCircle,
      items: [
        {
          title: "Security & Compliance",
          description: "SOC 2 compliance roadmap, data encryption badges, privacy policy & HIPAA compliance for health insurance, regulatory licenses displayed prominently.",
          priority: "Medium",
        },
        {
          title: "Real-Time Features",
          description: "Live chat with licensed agents, appointment scheduling with calendar integration, instant policy binding capabilities, real-time claim status tracking.",
          priority: "High",
        },
      ],
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High Impact":
        return "text-green-600 bg-green-50 dark:bg-green-950 dark:text-green-400";
      case "High":
        return "text-blue-600 bg-blue-50 dark:bg-blue-950 dark:text-blue-400";
      case "Medium":
        return "text-yellow-600 bg-yellow-50 dark:bg-yellow-950 dark:text-yellow-400";
      case "Low":
        return "text-gray-600 bg-gray-50 dark:bg-gray-800 dark:text-gray-400";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Strategic Expansion Plan
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Transforming Insure-it Group into an enterprise-grade platform supporting 500+ employees and hundreds of thousands of clients
          </p>
        </div>

        {/* Strategic Initiatives */}
        <div className="space-y-8 mb-12">
          {strategicInitiatives.map((phase, phaseIndex) => {
            const IconComponent = phase.icon;
            return (
              <div key={phaseIndex}>
                <div className="flex items-center gap-3 mb-4">
                  <IconComponent className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {phase.category}
                  </h2>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {phase.items.map((item, itemIndex) => (
                    <Card key={itemIndex} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg">{item.title}</CardTitle>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityColor(item.priority)}`}>
                            {item.priority}
                          </span>
                        </div>
                        <CardDescription className="text-sm mt-2">
                          {item.description}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Custom Suggestions Section */}
        <div className="mt-16">
          <div className="flex items-center gap-3 mb-6">
            <Plus className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Client Suggestions
            </h2>
          </div>

          {/* Add Suggestion Form */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Add Your Ideas</CardTitle>
              <CardDescription>
                Use this section to add custom suggestions during client presentations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Input
                  placeholder="Suggestion title..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  data-testid="input-suggestion-title"
                />
              </div>
              <div>
                <Textarea
                  placeholder="Description (optional)..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  rows={3}
                  data-testid="input-suggestion-description"
                />
              </div>
              <Button 
                onClick={handleAddSuggestion}
                className="w-full md:w-auto"
                data-testid="button-add-suggestion"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Suggestion
              </Button>
            </CardContent>
          </Card>

          {/* Display Custom Suggestions */}
          {customSuggestions.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2">
              {customSuggestions.map((suggestion) => (
                <Card key={suggestion.id} className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                  <CardHeader>
                    {editingId === suggestion.id ? (
                      // Edit Mode
                      <div className="space-y-3">
                        <Input
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          placeholder="Suggestion title..."
                          data-testid={`input-edit-title-${suggestion.id}`}
                        />
                        <Textarea
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          placeholder="Description (optional)..."
                          rows={3}
                          data-testid={`input-edit-description-${suggestion.id}`}
                        />
                        <div className="flex gap-2">
                          <Button 
                            onClick={handleSaveEdit}
                            size="sm"
                            data-testid={`button-save-${suggestion.id}`}
                          >
                            <Save className="w-4 h-4 mr-1" />
                            Save
                          </Button>
                          <Button 
                            onClick={handleCancelEdit}
                            variant="outline"
                            size="sm"
                            data-testid={`button-cancel-${suggestion.id}`}
                          >
                            <X className="w-4 h-4 mr-1" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      // View Mode
                      <>
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="text-lg flex-1">{suggestion.title}</CardTitle>
                          <div className="flex items-center gap-2">
                            <span className="text-xs px-2 py-1 rounded-full font-medium bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
                              Custom
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleStartEdit(suggestion)}
                              data-testid={`button-edit-${suggestion.id}`}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteSuggestion(suggestion.id)}
                              data-testid={`button-delete-${suggestion.id}`}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                        {suggestion.description && (
                          <CardDescription className="text-sm mt-2">
                            {suggestion.description}
                          </CardDescription>
                        )}
                      </>
                    )}
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}

          {customSuggestions.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Lightbulb className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No custom suggestions yet. Add your ideas above!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
