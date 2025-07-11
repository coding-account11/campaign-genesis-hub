import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Sparkles, Calendar, Users, TrendingUp, Clock, Wand2, CheckCircle2, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface BusinessProfile {
  business_name: string;
  business_category: string;
  location: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isNewUser, setIsNewUser] = useState(false);
  const [checklist, setChecklist] = useState({
    businessProfile: false,
    customerData: false,
    firstContent: false
  });

  // Load dynamic stats from localStorage and customer data
  const [stats, setStats] = useState({
    activeCampaigns: 0,
    todaysCampaigns: 0,
    totalCustomers: 0
  });

  // Update stats when component mounts
  useEffect(() => {
    const updateStats = () => {
      // Get campaigns from localStorage (both mock and saved)
      const savedCampaigns = JSON.parse(localStorage.getItem('campaigns') || '[]');
      const totalCampaigns = mockCampaigns.length + savedCampaigns.length;
      
      // Count today's campaigns
      const today = new Date();
      const todaysCampaigns = [...mockCampaigns, ...savedCampaigns].filter(campaign => {
        const campaignDate = new Date(campaign.date);
        return campaignDate.toDateString() === today.toDateString();
      }).length;

      // Get customer count from customer data
      const customerData = JSON.parse(localStorage.getItem('customerData') || '[]');
      const totalCustomers = customerData.length;

      setStats({
        activeCampaigns: totalCampaigns,
        todaysCampaigns: todaysCampaigns,
        totalCustomers: totalCustomers
      });
    };

    updateStats();
    
    // Listen for storage changes to update stats
    const handleStorageChange = () => updateStats();
    window.addEventListener('storage', handleStorageChange);
    
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Mock campaigns for counting
  const mockCampaigns = [
    {
      id: "1",
      title: "Monday Morning Special",
      date: new Date(2024, 6, 15)
    },
    {
      id: "2", 
      title: "Customer Spotlight",
      date: new Date(2024, 6, 18)
    },
    {
      id: "3",
      title: "Weekend Brunch Menu",
      date: new Date(2024, 6, 20)
    },
    {
      id: "4",
      title: "Something magical happening at Cozy Corner Cafe today!",
      date: new Date(2024, 6, 24)
    }
  ];

  const hasInactiveCustomers = true; // Mock - would be calculated based on customer data
  const inactiveCustomersCount = 15;

  // Update time for dynamic greeting
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Check auth state and load business profile
  useEffect(() => {
    const checkAuthAndLoadProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/auth');
        return;
      }

      // Check if user has completed profile
      const savedProfile = localStorage.getItem('businessProfile');
      if (savedProfile) {
        const profile = JSON.parse(savedProfile);
        setBusinessProfile({
          business_name: profile.businessName || "Your Business",
          business_category: profile.businessCategory || "Business",
          location: profile.location || "Location"
        });
      }

      // Check user progress
      const userProgress = JSON.parse(localStorage.getItem('userProgress') || '{}');
      const hasBusinessProfile = !!savedProfile && JSON.parse(savedProfile).businessName;
      const hasCustomerData = JSON.parse(localStorage.getItem('customerData') || '[]').length > 0;
      const hasGeneratedContent = JSON.parse(localStorage.getItem('campaigns') || '[]').length > 0;

      setChecklist({
        businessProfile: hasBusinessProfile,
        customerData: hasCustomerData,
        firstContent: hasGeneratedContent
      });

      // Check if this is a new user (no business profile set up)
      setIsNewUser(!hasBusinessProfile);
      
      setLoading(false);
    };

    checkAuthAndLoadProfile();
  }, [navigate]);

  const getTimeGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const getBusinessSpecificIdeas = () => {
    const businessName = businessProfile?.business_name || "your business";
    const category = businessProfile?.business_category?.toLowerCase() || "business";
    
    if (category.includes("restaurant") || category.includes("cafe") || category.includes("food")) {
      return [
        {
          title: "Feature Today's Special Menu",
          description: `Highlight ${businessName}'s daily specials with mouth-watering descriptions and behind-the-scenes preparation shots.`,
          priority: "high priority",
          color: "destructive"
        },
        {
          title: "Share Chef's Secret Recipe Tip",
          description: `Give customers a peek into ${businessName}'s kitchen secrets - a cooking tip or ingredient spotlight.`,
          priority: "medium priority",
          color: "secondary"
        },
        {
          title: "Customer's Favorite Dish Story",
          description: `Feature a regular customer and their go-to order at ${businessName}, making it personal and relatable.`,
          priority: "medium priority",
          color: "secondary"
        }
      ];
    } else if (category.includes("retail") || category.includes("shop")) {
      return [
        {
          title: "New Product Showcase",
          description: `Introduce ${businessName}'s latest arrivals with styling tips or usage ideas.`,
          priority: "high priority",
          color: "destructive"
        },
        {
          title: "Behind-the-Scenes Sourcing",
          description: `Show how ${businessName} selects quality products and the story behind your curated selection.`,
          priority: "medium priority",
          color: "secondary"
        },
        {
          title: "Customer Style Feature",
          description: `Highlight how real customers style or use products from ${businessName}.`,
          priority: "medium priority",
          color: "secondary"
        }
      ];
    } else if (category.includes("service") || category.includes("health") || category.includes("beauty")) {
      return [
        {
          title: "Client Success Transformation",
          description: `Share a before/after story showcasing ${businessName}'s impact on a client's life or goals.`,
          priority: "high priority",
          color: "destructive"
        },
        {
          title: "Expert Tips & Advice",
          description: `Share professional insights and tips that position ${businessName} as the go-to expert in your field.`,
          priority: "medium priority",
          color: "secondary"
        },
        {
          title: "Team Member Spotlight",
          description: `Introduce the skilled professionals at ${businessName} and their unique expertise.`,
          priority: "medium priority",
          color: "secondary"
        }
      ];
    } else {
      return [
        {
          title: "Share a Customer Success Story",
          description: `Highlight how ${businessName} made a real difference in a customer's experience.`,
          priority: "high priority",
          color: "destructive"
        },
        {
          title: "Behind-the-Scenes Content",
          description: `Give customers a peek into the daily operations and passion behind ${businessName}.`,
          priority: "medium priority",
          color: "secondary"
        },
        {
          title: "Community Impact Story",
          description: `Show how ${businessName} contributes to and supports the local community.`,
          priority: "medium priority",
          color: "secondary"
        }
      ];
    }
  };

  const contentIdeas = getBusinessSpecificIdeas();

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Loading skeleton */}
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

  if (!businessProfile) {
    // Onboarding flow for new users
    return (
      <div className="max-w-md mx-auto mt-12">
        <Card>
          <CardHeader>
            <CardTitle>Welcome to PromoPal!</CardTitle>
            <CardDescription>Let's set up your business profile to get started</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Business Name</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Enter your business name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Business Category</label>
              <select className="w-full px-3 py-2 border rounded-md">
                <option value="">Select a category</option>
                <option value="restaurant">Restaurant</option>
                <option value="retail">Retail</option>
                <option value="services">Services</option>
                <option value="healthcare">Healthcare</option>
                <option value="technology">Technology</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Location</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 border rounded-md"
                placeholder="City, State"
              />
            </div>
            <Button className="w-full">Get Started</Button>
          </CardContent>
        </Card>
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
              <h1 className="text-2xl font-bold mb-2">{businessProfile.business_name}</h1>
              <p className="text-white/90 mb-4">Ready to create some amazing marketing content? Let's boost your business!</p>
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

      {/* Onboarding Checklist for New Users */}
      {isNewUser && (
        <Card className="border-l-4 border-l-brand-purple">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-brand-purple" />
              Welcome to PromoPal! Let's get you started
            </CardTitle>
            <CardDescription>
              Complete these steps to unlock the full power of AI marketing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Checkbox 
                  checked={checklist.businessProfile}
                  disabled
                  className="border-brand-purple data-[state=checked]:bg-brand-purple"
                />
                <Button
                  variant="ghost"
                  className="justify-start p-0 h-auto text-left"
                  onClick={() => navigate("/dashboard/business-profile")}
                >
                  <div>
                    <p className={`font-medium ${checklist.businessProfile ? 'text-muted-foreground line-through' : ''}`}>
                      Fill out Business Profile for personalized business insights
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Help our AI understand your business better
                    </p>
                  </div>
                </Button>
              </div>
              
              <div className="flex items-center gap-3">
                <Checkbox 
                  checked={checklist.customerData}
                  disabled
                  className="border-brand-purple data-[state=checked]:bg-brand-purple"
                />
                <Button
                  variant="ghost"
                  className="justify-start p-0 h-auto text-left"
                  onClick={() => navigate("/dashboard/customer-data")}
                >
                  <div>
                    <p className={`font-medium ${checklist.customerData ? 'text-muted-foreground line-through' : ''}`}>
                      Add customer data for personalized customer insights
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Upload customer information for targeted campaigns
                    </p>
                  </div>
                </Button>
              </div>
              
              <div className="flex items-center gap-3">
                <Checkbox 
                  checked={checklist.firstContent}
                  disabled
                  className="border-brand-purple data-[state=checked]:bg-brand-purple"
                />
                <Button
                  variant="ghost"
                  className="justify-start p-0 h-auto text-left"
                  onClick={() => navigate("/dashboard/generate-content")}
                >
                  <div>
                    <p className={`font-medium ${checklist.firstContent ? 'text-muted-foreground line-through' : ''}`}>
                      Generate your first content
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Create your first AI-powered marketing campaign
                    </p>
                  </div>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Magic Campaign Widget */}
      <Card className="bg-gradient-primary text-white border-0 shadow-elegant">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Wand2 className="w-5 h-5" />
                <span className="text-white/90">Magic Campaign</span>
              </div>
              <p className="text-lg mb-4">Surprise me with a campaign I didn't know I needed</p>
              <Button 
                variant="secondary"
                onClick={() => navigate("/dashboard/generate-content?magic=true")}
                className="bg-white text-primary hover:bg-white/90"
              >
                Generate Magic Campaign
              </Button>
            </div>
            <div className="hidden md:block">
              <Wand2 className="w-12 h-12 text-white/30" />
            </div>
          </div>
        </CardContent>
      </Card>


      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Wider */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Suggestions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-brand-purple" />
                Today's Suggestions
              </CardTitle>
              <CardDescription>Content Ideas for Today</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {contentIdeas.map((idea, index) => (
                <div 
                  key={index}
                  className="flex items-start justify-between p-4 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                  onClick={() => {
                    // Map suggestions to URL parameters for auto-population
                    let suggestionType = 'general';
                    if (idea.title.toLowerCase().includes('special') || idea.title.toLowerCase().includes('menu')) {
                      suggestionType = 'seasonal-promo';
                    } else if (idea.title.toLowerCase().includes('customer') || idea.title.toLowerCase().includes('story')) {
                      suggestionType = 'personalized-email';
                    } else if (idea.title.toLowerCase().includes('community') || idea.title.toLowerCase().includes('local')) {
                      suggestionType = 'local-event';
                    }
                    
                    navigate(`/dashboard/generate-content?suggestion=${suggestionType}&title=${encodeURIComponent(idea.title)}&description=${encodeURIComponent(idea.description)}`);
                  }}
                >
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">{idea.title}</h4>
                    <p className="text-sm text-muted-foreground">{idea.description}</p>
                  </div>
                  <Badge variant={idea.color as any} className="ml-4">
                    {idea.priority}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Upcoming Campaigns */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-brand-teal" />
                Upcoming Campaigns
              </CardTitle>
              <CardDescription>
                <a 
                  href="#" 
                  className="text-brand-purple hover:underline"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/dashboard/marketing-calendar");
                  }}
                >
                  View All →
                </a>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No upcoming campaigns</p>
                <p className="text-sm text-muted-foreground mb-4">Start planning your marketing content to see campaigns here.</p>
                <Button 
                  variant="outline"
                onClick={() => navigate("/dashboard/generate-content")}
                >
                  Create Campaign
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Narrower */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start gap-3"
                onClick={() => navigate("/dashboard/generate-content")}
              >
                <Sparkles className="w-4 h-4 text-brand-purple" />
                <div className="text-left">
                  <div className="font-medium">Generate Content</div>
                  <div className="text-xs text-muted-foreground">Create AI-powered marketing posts</div>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start gap-3"
                onClick={() => navigate("/dashboard/marketing-calendar")}
              >
                <Calendar className="w-4 h-4 text-brand-teal" />
                <div className="text-left">
                  <div className="font-medium">View Calendar</div>
                  <div className="text-xs text-muted-foreground">Check your marketing schedule</div>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start gap-3"
                onClick={() => navigate("/dashboard/customer-data")}
              >
                <Users className="w-4 h-4 text-brand-purple" />
                <div className="text-left">
                  <div className="font-medium">Manage Customers</div>
                  <div className="text-xs text-muted-foreground">Upload and organize customer data</div>
                </div>
              </Button>
            </CardContent>
          </Card>

          {/* Marketing Tips */}
          <Card>
            <CardHeader>
              <CardTitle>Marketing Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-1">Post Consistently</h4>
                <p className="text-sm text-muted-foreground">
                  Regular posting keeps your audience engaged. Aim for 3-5 posts per week.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-1">Use Seasonal Content</h4>
                <p className="text-sm text-muted-foreground">
                  Leverage holidays and seasons to create timely, relevant content.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;