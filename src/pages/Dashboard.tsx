import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Calendar, Users, TrendingUp, Clock, Wand2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

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

  // Simulate loading and checking for business profile
  useEffect(() => {
    setTimeout(() => {
      // Mock business profile - in real app, this would be fetched from backend
      setBusinessProfile({
        business_name: "Cozy Corner Cafe",
        business_category: "Restaurant",
        location: "Downtown"
      });
      setLoading(false);
    }, 1000);
  }, []);

  const getTimeGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  // 30 daily suggestions pool
  const allSuggestions = [
    "Share behind-the-scenes content of your daily operations",
    "Feature a customer testimonial or success story",
    "Post about your team members and their expertise",
    "Create content around seasonal trends in your industry",
    "Share tips and tricks related to your products/services",
    "Highlight a product or service with educational content",
    "Post about local community events you're involved in",
    "Share your business's origin story or milestones",
    "Create content around current industry news or trends",
    "Feature user-generated content from customers",
    "Share before/after transformations (if applicable)",
    "Post about your business values and mission",
    "Create educational content about your industry",
    "Share a day-in-the-life content of your business",
    "Highlight partnerships with other local businesses",
    "Post about sustainability practices in your business",
    "Share interesting facts about your products/services",
    "Create content around customer questions and answers",
    "Feature your business's role in the community",
    "Share upcoming promotions or special events",
    "Post about innovations or improvements in your business",
    "Create content around customer appreciation",
    "Share industry insights and predictions",
    "Feature the story behind a popular product/service",
    "Post about your business's achievements and awards",
    "Create content around problem-solving for customers",
    "Share wellness or lifestyle tips related to your business",
    "Feature collaborative content with industry experts",
    "Post about the quality and sourcing of your products",
    "Create content that showcases your business expertise"
  ];

  const getDailySuggestions = () => {
    const businessName = businessProfile?.business_name || "your business";
    
    // Get today's date as a seed for consistent daily rotation
    const today = new Date();
    const dateString = today.toDateString();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    
    // Get or create rotation state from localStorage
    const storageKey = 'dailySuggestionRotation';
    let rotationState = JSON.parse(localStorage.getItem(storageKey) || '{"usedSuggestions": [], "currentCycle": 0}');
    
    // Check if it's a new day
    const lastUpdateKey = 'lastSuggestionUpdate';
    const lastUpdate = localStorage.getItem(lastUpdateKey);
    
    if (lastUpdate !== dateString) {
      // New day - select new suggestions
      if (rotationState.usedSuggestions.length >= allSuggestions.length) {
        // Reset cycle when all suggestions have been used
        rotationState = { usedSuggestions: [], currentCycle: rotationState.currentCycle + 1 };
      }
      
      // Get available suggestions (not yet used)
      const availableSuggestions = allSuggestions.filter((_, index) => 
        !rotationState.usedSuggestions.includes(index)
      );
      
      // Randomly select 3 suggestions
      const selectedIndices = [];
      const shuffled = [...Array(availableSuggestions.length).keys()];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      
      for (let i = 0; i < Math.min(3, availableSuggestions.length); i++) {
        const originalIndex = allSuggestions.indexOf(availableSuggestions[shuffled[i]]);
        selectedIndices.push(originalIndex);
        rotationState.usedSuggestions.push(originalIndex);
      }
      
      // Store today's selections
      rotationState.todaysSelections = selectedIndices;
      localStorage.setItem(storageKey, JSON.stringify(rotationState));
      localStorage.setItem(lastUpdateKey, dateString);
    }
    
    // Use today's selections to build the suggestions
    const todaysIndices = rotationState.todaysSelections || [0, 1, 2];
    return todaysIndices.map((index, i) => {
      const suggestion = allSuggestions[index] || allSuggestions[0];
      return {
        title: suggestion,
        description: `Create engaging content for ${businessName} - ${suggestion.toLowerCase()}`,
        priority: i === 0 ? "high priority" : "medium priority",
        color: i === 0 ? "destructive" : "secondary"
      };
    });
  };

  const contentIdeas = getDailySuggestions();

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
                onClick={() => navigate("/generate-content")}
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
                onClick={() => navigate("/generate-content?magic=true")}
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
                    
                    navigate(`/generate-content?suggestion=${suggestionType}&title=${encodeURIComponent(idea.title)}&description=${encodeURIComponent(idea.description)}`);
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
                    navigate("/marketing-calendar");
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
                  onClick={() => navigate("/generate-content")}
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
                onClick={() => navigate("/generate-content")}
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
                onClick={() => navigate("/marketing-calendar")}
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
                onClick={() => navigate("/customer-data")}
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