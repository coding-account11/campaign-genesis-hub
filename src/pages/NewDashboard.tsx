import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Sparkles, 
  Calendar, 
  Users, 
  TrendingUp, 
  Clock, 
  Wand2,
  CheckCircle,
  AlertTriangle,
  Target,
  BarChart3,
  MessageSquare
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BusinessProfile {
  businessName: string;
  businessCategory: string;
  location: string;
  brandVoice: string;
  businessBio: string;
  productsServices: string;
}

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  route: string;
}

const NewDashboard = () => {
  const navigate = useNavigate();
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentSuggestionIndex, setCurrentSuggestionIndex] = useState(0);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    {
      id: "business-profile",
      title: "Fill out Business Profile",
      description: "Complete your business information for personalized insights",
      completed: false,
      route: "/dashboard/business-profile"
    },
    {
      id: "customer-data", 
      title: "Add customer data",
      description: "Upload customer information for personalized campaigns",
      completed: false,
      route: "/dashboard/customer-data"
    },
    {
      id: "generate-content",
      title: "Generate your first content",
      description: "Create AI-powered marketing content",
      completed: false,
      route: "/dashboard/generate-content"
    }
  ]);

  // Load dynamic stats from localStorage and customer data
  const [stats, setStats] = useState({
    activeCampaigns: 0,
    todaysCampaigns: 0,
    totalCustomers: 0
  });

  // Business-specific suggestions that cycle through
  const getBusinessSuggestions = () => {
    const businessName = businessProfile?.businessName || "your business";
    const category = businessProfile?.businessCategory?.toLowerCase() || "business";
    
    const baseSuggestions = [
      // Customer Engagement (Personalized)
      {
        title: "Reach out to VIP customers",
        description: `Create personalized messages for your top customers at ${businessName}`,
        type: "personalized",
        priority: "high",
        category: "customer-engagement"
      },
      {
        title: "Re-engage inactive customers", 
        description: `Win back customers who haven't visited ${businessName} recently`,
        type: "personalized",
        priority: "medium",
        category: "customer-retention"
      },
      {
        title: "Thank recent purchasers",
        description: `Send personalized thank you messages to recent ${businessName} customers`,
        type: "personalized", 
        priority: "medium",
        category: "customer-appreciation"
      },
      {
        title: "Birthday celebration outreach",
        description: `Create special birthday offers for ${businessName} customers`,
        type: "personalized",
        priority: "medium",
        category: "special-occasions"
      },
      {
        title: "Loyalty program invitation",
        description: `Invite customers to join ${businessName}'s exclusive rewards program`,
        type: "personalized",
        priority: "high",
        category: "loyalty-building"
      },

      // Social Media & General Marketing (General)
      {
        title: "Share today's behind-the-scenes",
        description: `Show what makes ${businessName} special with authentic behind-the-scenes content`,
        type: "general",
        priority: "medium",
        category: "brand-building"
      },
      {
        title: "Feature customer testimonials",
        description: `Showcase real customer experiences and success stories from ${businessName}`,
        type: "general",
        priority: "high",
        category: "social-proof"
      },
      {
        title: "Highlight your team",
        description: `Introduce the amazing people who make ${businessName} exceptional`,
        type: "general",
        priority: "medium", 
        category: "team-spotlight"
      },
      {
        title: "Share industry tips",
        description: `Position ${businessName} as an expert by sharing valuable insights`,
        type: "general",
        priority: "medium",
        category: "thought-leadership"
      },
      {
        title: "Announce community involvement",
        description: `Show how ${businessName} gives back to the local community`,
        type: "general",
        priority: "medium",
        category: "community-engagement"
      }
    ];

    // Add category-specific suggestions
    if (category.includes("restaurant") || category.includes("cafe") || category.includes("food")) {
      baseSuggestions.push(
        {
          title: "Feature today's special menu",
          description: `Highlight ${businessName}'s daily specials with mouth-watering descriptions`,
          type: "general",
          priority: "high",
          category: "daily-specials"
        },
        {
          title: "Share chef's cooking tips",
          description: `Give customers a peek into ${businessName}'s culinary expertise`,
          type: "general",
          priority: "medium",
          category: "expertise-sharing"
        },
        {
          title: "Promote catering services",
          description: `Reach out to customers who might need ${businessName} for events`,
          type: "personalized",
          priority: "medium",
          category: "service-expansion"
        },
        {
          title: "Weekend brunch promotion",
          description: `Create excitement for ${businessName}'s weekend offerings`,
          type: "general",
          priority: "high",
          category: "weekend-promotion"
        },
        {
          title: "Happy hour announcement",
          description: `Drive traffic during off-peak hours at ${businessName}`,
          type: "general", 
          priority: "high",
          category: "traffic-boost"
        }
      );
    } else if (category.includes("retail") || category.includes("shop") || category.includes("boutique")) {
      baseSuggestions.push(
        {
          title: "New arrivals showcase",
          description: `Introduce ${businessName}'s latest products with styling tips`,
          type: "general",
          priority: "high",
          category: "product-launch"
        },
        {
          title: "Seasonal collection highlight",
          description: `Feature ${businessName}'s seasonal offerings and trends`,
          type: "general",
          priority: "high",
          category: "seasonal-marketing"
        },
        {
          title: "Personal shopping invitation",
          description: `Offer VIP customers exclusive personal shopping at ${businessName}`,
          type: "personalized",
          priority: "high",
          category: "vip-service"
        },
        {
          title: "Style consultation offer",
          description: `Reach out to customers who bought similar items from ${businessName}`,
          type: "personalized",
          priority: "medium",
          category: "cross-selling"
        },
        {
          title: "Flash sale announcement",
          description: `Create urgency with limited-time offers at ${businessName}`,
          type: "general",
          priority: "high",
          category: "urgency-marketing"
        }
      );
    } else if (category.includes("fitness") || category.includes("gym") || category.includes("health")) {
      baseSuggestions.push(
        {
          title: "New class announcement",
          description: `Promote new fitness classes and programs at ${businessName}`,
          type: "general",
          priority: "high", 
          category: "program-launch"
        },
        {
          title: "Member transformation story",
          description: `Share inspiring success stories from ${businessName} members`,
          type: "general",
          priority: "high",
          category: "success-stories"
        },
        {
          title: "Workout tips sharing",
          description: `Provide expert fitness advice from ${businessName} trainers`,
          type: "general",
          priority: "medium",
          category: "expert-advice"
        },
        {
          title: "Personal training invitation",
          description: `Offer personalized training sessions to ${businessName} members`,
          type: "personalized",
          priority: "high",
          category: "service-upsell"
        },
        {
          title: "Challenge participation invite",
          description: `Invite customers to join ${businessName}'s fitness challenges`,
          type: "personalized",
          priority: "medium",
          category: "engagement-boost"
        }
      );
    }

    // Add more seasonal and general suggestions
    baseSuggestions.push(
      {
        title: "Weekend special promotion",
        description: `Drive weekend traffic to ${businessName} with exclusive offers`,
        type: "general",
        priority: "high",
        category: "weekend-boost"
      },
      {
        title: "Customer appreciation event",
        description: `Invite loyal customers to a special appreciation event at ${businessName}`,
        type: "personalized",
        priority: "high",
        category: "customer-appreciation"
      },
      {
        title: "Local partnership announcement",
        description: `Share exciting partnerships that benefit ${businessName} customers`,
        type: "general",
        priority: "medium",
        category: "partnership-marketing"
      },
      {
        title: "Expert advice series",
        description: `Share professional insights that establish ${businessName} as an authority`,
        type: "general",
        priority: "medium",
        category: "thought-leadership"
      },
      {
        title: "Referral program launch",
        description: `Encourage customers to refer friends to ${businessName}`,
        type: "personalized",
        priority: "high",
        category: "referral-marketing"
      },
      {
        title: "Milestone celebration",
        description: `Celebrate ${businessName}'s achievements with your community`,
        type: "general",
        priority: "medium",
        category: "milestone-marketing"
      },
      {
        title: "Limited edition offering",
        description: `Create exclusivity with limited-time products or services at ${businessName}`,
        type: "general",
        priority: "high",
        category: "scarcity-marketing"
      },
      {
        title: "Customer feedback request",
        description: `Reach out to recent customers for reviews and testimonials for ${businessName}`,
        type: "personalized",
        priority: "medium",
        category: "feedback-collection"
      },
      {
        title: "Educational content series",
        description: `Share valuable knowledge that positions ${businessName} as an expert`,
        type: "general",
        priority: "medium",
        category: "educational-marketing"
      },
      {
        title: "Social media contest",
        description: `Engage customers with fun contests featuring ${businessName}`,
        type: "general",
        priority: "medium",
        category: "engagement-marketing"
      }
    );

    return baseSuggestions;
  };

  const suggestions = getBusinessSuggestions();

  // Cycle through suggestions every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSuggestionIndex((prev) => (prev + 1) % suggestions.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [suggestions.length]);

  // Update stats when component mounts
  useEffect(() => {
    const updateStats = () => {
      const savedCampaigns = JSON.parse(localStorage.getItem('campaigns') || '[]');
      const customerData = JSON.parse(localStorage.getItem('customerData') || '[]');
      
      const today = new Date();
      const todaysCampaigns = savedCampaigns.filter((campaign: any) => {
        const campaignDate = new Date(campaign.date);
        return campaignDate.toDateString() === today.toDateString();
      }).length;

      setStats({
        activeCampaigns: savedCampaigns.length,
        todaysCampaigns: todaysCampaigns,
        totalCustomers: customerData.length
      });
    };

    updateStats();
    
    const handleStorageChange = () => updateStats();
    window.addEventListener('storage', handleStorageChange);
    
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Update time for dynamic greeting
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Check checklist status based on localStorage
  useEffect(() => {
    const checkBusinessProfile = () => {
      const profile = JSON.parse(localStorage.getItem('businessProfile') || '{}');
      return Object.keys(profile).length > 0 && profile.businessName;
    };

    const checkCustomerData = () => {
      const data = JSON.parse(localStorage.getItem('customerData') || '[]');
      return data.length > 0;
    };

    const checkGeneratedContent = () => {
      const campaigns = JSON.parse(localStorage.getItem('campaigns') || '[]');
      return campaigns.length > 0;
    };

    const updatedChecklist = checklist.map(item => {
      switch (item.id) {
        case 'business-profile':
          return { ...item, completed: checkBusinessProfile() };
        case 'customer-data':
          return { ...item, completed: checkCustomerData() };
        case 'generate-content':
          return { ...item, completed: checkGeneratedContent() };
        default:
          return item;
      }
    });

    setChecklist(updatedChecklist);

    // Set business profile
    const profile = JSON.parse(localStorage.getItem('businessProfile') || '{}');
    if (Object.keys(profile).length > 0) {
      setBusinessProfile(profile);
    }
    
    setLoading(false);
  }, []);

  const getTimeGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const completedItems = checklist.filter(item => item.completed).length;
  const progressPercentage = (completedItems / checklist.length) * 100;

  const currentSuggestion = suggestions[currentSuggestionIndex];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-40 bg-muted rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
        <div className="h-32 bg-muted rounded-lg animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <Card className="bg-gradient-primary text-white border-0 shadow-elegant">
        <CardContent className="p-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5" />
                <span className="text-white/90">{getTimeGreeting()}, Welcome back!</span>
              </div>
              <h1 className="text-2xl font-bold mb-2">
                {businessProfile?.businessName || "Get Started with PromoPal"}
              </h1>
              <p className="text-white/90 mb-4">
                {businessProfile 
                  ? "Ready to create some amazing marketing content? Let's boost your business!" 
                  : "Complete your setup below to unlock personalized marketing insights!"}
              </p>
              <Button 
                variant="secondary"
                onClick={() => navigate("/dashboard/generate-content")}
                className="bg-white text-primary hover:bg-white/90"
              >
                Generate Content →
              </Button>
            </div>
            <div className="hidden md:block">
              <Sparkles className="w-16 h-16 text-white/30" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Onboarding Checklist */}
      {progressPercentage < 100 && (
        <Card className="border-primary/20 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  Getting Started Checklist
                </CardTitle>
                <CardDescription>
                  Complete these steps to unlock the full power of PromoPal
                </CardDescription>
              </div>
              <Badge variant="secondary">
                {completedItems}/{checklist.length} Complete
              </Badge>
            </div>
            <Progress value={progressPercentage} className="mt-3" />
          </CardHeader>
          <CardContent className="space-y-4">
            {checklist.map((item) => (
              <div 
                key={item.id}
                className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-colors ${
                  item.completed 
                    ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800' 
                    : 'bg-secondary/50 border-secondary hover:bg-secondary/70'
                }`}
                onClick={() => navigate(item.route)}
              >
                <Checkbox 
                  checked={item.completed}
                  className="pointer-events-none"
                />
                <div className="flex-1">
                  <h4 className="font-medium">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
                {item.completed && (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-brand-accent rounded-lg">
                <TrendingUp className="w-6 h-6 text-brand-purple" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Campaigns</p>
                <p className="text-2xl font-bold">{stats.activeCampaigns}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-brand-accent rounded-lg">
                <Clock className="w-6 h-6 text-brand-teal" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Today's Campaigns</p>
                <p className="text-2xl font-bold">{stats.todaysCampaigns}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-brand-accent rounded-lg">
                <Users className="w-6 h-6 text-brand-purple" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Customers</p>
                <p className="text-2xl font-bold">{stats.totalCustomers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dynamic Suggestion Card */}
      <Card className="bg-gradient-primary text-white border-0 shadow-elegant">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5" />
                <span className="text-white/90">
                  AI Suggestion • {currentSuggestion?.type === 'personalized' ? 'Personalized' : 'General'}
                </span>
                <Badge 
                  variant="secondary" 
                  className={`text-xs ${
                    currentSuggestion?.priority === 'high' 
                      ? 'bg-red-500 text-white' 
                      : 'bg-white/20 text-white'
                  }`}
                >
                  {currentSuggestion?.priority} priority
                </Badge>
              </div>
              <h3 className="text-lg font-semibold mb-2">{currentSuggestion?.title}</h3>
              <p className="text-white/90 mb-4">{currentSuggestion?.description}</p>
              <Button 
                variant="secondary"
                onClick={() => {
                  const suggestionType = currentSuggestion?.type === 'personalized' ? 'personalized-email' : 'general';
                  navigate(`/dashboard/generate-content?suggestion=${suggestionType}&title=${encodeURIComponent(currentSuggestion?.title || '')}&description=${encodeURIComponent(currentSuggestion?.description || '')}`);
                }}
                className="bg-white text-primary hover:bg-white/90"
              >
                Create This Campaign
              </Button>
            </div>
            <div className="hidden md:block">
              <div className="text-right">
                <Wand2 className="w-12 h-12 text-white/30 mx-auto mb-2" />
                <div className="text-xs text-white/60">
                  {currentSuggestionIndex + 1} of {suggestions.length}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Button 
          variant="outline" 
          className="h-24 flex-col gap-2"
          onClick={() => navigate("/dashboard/generate-content")}
        >
          <Sparkles className="w-6 h-6 text-brand-purple" />
          <span>Generate Content</span>
        </Button>
        
        <Button 
          variant="outline" 
          className="h-24 flex-col gap-2"
          onClick={() => navigate("/dashboard/marketing-calendar")}
        >
          <Calendar className="w-6 h-6 text-brand-teal" />
          <span>View Calendar</span>
        </Button>
        
        <Button 
          variant="outline" 
          className="h-24 flex-col gap-2"
          onClick={() => navigate("/dashboard/customer-data")}
        >
          <Users className="w-6 h-6 text-brand-purple" />
          <span>Customer Data</span>
        </Button>
        
        <Button 
          variant="outline" 
          className="h-24 flex-col gap-2"
          onClick={() => navigate("/dashboard/business-profile")}
        >
          <BarChart3 className="w-6 h-6 text-brand-teal" />
          <span>Business Profile</span>
        </Button>
      </div>
    </div>
  );
};

export default NewDashboard;