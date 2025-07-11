import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  TrendingUp, 
  Users, 
  Calendar,
  Check,
  Star,
  ArrowRight,
  Building2,
  Target,
  Zap
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();
  const [businessCount, setBusinessCount] = useState(2847);

  // Animate business count on load
  useEffect(() => {
    const interval = setInterval(() => {
      setBusinessCount(prev => prev + Math.floor(Math.random() * 3));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Content Generation",
      description: "Generate personalized marketing content in seconds using advanced AI that understands your business and customers."
    },
    {
      icon: Target,
      title: "Smart Customer Targeting",
      description: "Leverage customer data to create highly targeted campaigns that drive engagement and conversions."
    },
    {
      icon: Calendar,
      title: "Marketing Calendar & Automation",
      description: "Plan, schedule, and automate your marketing campaigns with intelligent suggestions for optimal timing."
    },
    {
      icon: TrendingUp,
      title: "Business Growth Analytics",
      description: "Track performance and get actionable insights to continuously improve your marketing effectiveness."
    }
  ];

  const benefits = [
    "Save 10+ hours per week on content creation",
    "Increase customer engagement by up to 300%",
    "Generate personalized campaigns for every customer segment",
    "Automate your entire marketing workflow",
    "Access 30+ industry-specific content templates",
    "Get real-time performance analytics and insights"
  ];

  const testimonials = [
    {
      name: "Sarah Martinez",
      business: "Bloom Boutique",
      text: "PromoPal transformed how we connect with customers. Our engagement rates have tripled!",
      rating: 5
    },
    {
      name: "Mike Chen",
      business: "Urban Fitness Studio",
      text: "The AI understands our fitness community perfectly. Every campaign feels personal and relevant.",
      rating: 5
    },
    {
      name: "Elena Rodriguez",
      business: "Casa Elena Restaurant",
      text: "From menu promotions to customer retention, PromoPal handles it all. Incredible results!",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-xl">PromoPal</h1>
              <p className="text-xs text-muted-foreground">AI Marketing Assistant</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/pricing")}
              className="hidden sm:inline-flex"
            >
              Pricing
            </Button>
            <Button onClick={() => navigate("/auth")}>
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-6">
            <Badge variant="outline" className="mb-4">
              <Users className="w-4 h-4 mr-2" />
              Trusted by {businessCount.toLocaleString()}+ businesses
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Transform Your Marketing with AI That Knows Your Business
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Generate personalized marketing content, target the right customers, and grow your business with AI-powered campaigns that actually convert.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button 
                size="lg" 
                onClick={() => navigate("/auth")}
                className="bg-gradient-primary hover:opacity-90 text-white border-0 shadow-elegant text-lg px-8 py-6"
              >
                Start Your Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => navigate("/pricing")}
                className="text-lg px-8 py-6"
              >
                View Pricing
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Everything You Need to Grow</h2>
            <p className="text-xl text-muted-foreground">Powerful features designed for modern businesses</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-card bg-background/80 backdrop-blur">
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                Why Businesses Choose PromoPal
              </h2>
              <p className="text-xl text-muted-foreground">
                Join thousands of businesses that have transformed their marketing with AI-powered personalization.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-gradient-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
              
              <Button 
                size="lg" 
                onClick={() => navigate("/auth")}
                className="bg-gradient-primary hover:opacity-90 text-white border-0 shadow-elegant"
              >
                Get Started Today
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
            
            <div className="space-y-6">
              <Card className="border-0 shadow-card">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Building2 className="w-8 h-8 text-brand-purple" />
                      <div>
                        <h3 className="font-semibold">Restaurant Success Story</h3>
                        <p className="text-sm text-muted-foreground">Local cafe increases revenue by 45%</p>
                      </div>
                    </div>
                    <p className="text-muted-foreground">
                      "PromoPal's AI created personalized email campaigns that brought back our inactive customers. Our monthly revenue increased by 45% in just 3 months!"
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-card">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Zap className="w-8 h-8 text-brand-teal" />
                      <div>
                        <h3 className="font-semibold">Time Savings</h3>
                        <p className="text-sm text-muted-foreground">10+ hours saved per week</p>
                      </div>
                    </div>
                    <p className="text-muted-foreground">
                      "What used to take me hours of brainstorming and writing now happens in minutes. The AI understands my brand voice perfectly."
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Loved by Business Owners</h2>
            <p className="text-xl text-muted-foreground">See what our customers are saying</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-card bg-background/80 backdrop-blur">
                <CardContent className="p-6 space-y-4">
                  <div className="flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-brand-purple text-brand-purple" />
                    ))}
                  </div>
                  <p className="text-muted-foreground">"{testimonial.text}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.business}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <Card className="border-0 bg-gradient-primary text-white shadow-elegant">
            <CardContent className="p-12 text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                Ready to Transform Your Marketing?
              </h2>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                Join thousands of businesses using AI to create personalized marketing campaigns that actually work.
              </p>
              <Button 
                size="lg" 
                variant="secondary"
                onClick={() => navigate("/auth")}
                className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6"
              >
                Start Your Free Trial Today
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <p className="text-sm text-white/70">
                No credit card required • Setup in under 5 minutes
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-8 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold">PromoPal</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 PromoPal. Transforming business marketing with AI.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;