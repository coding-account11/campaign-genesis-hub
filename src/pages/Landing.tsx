import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  TrendingUp, 
  Users, 
  Calendar,
  Target,
  Zap,
  BarChart3,
  MessageSquare,
  Star,
  ArrowRight,
  CheckCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Content Generation",
      description: "Create engaging marketing content in seconds with our advanced AI that understands your business and audience."
    },
    {
      icon: Target,
      title: "Personalized Marketing",
      description: "Deliver targeted campaigns based on customer data and behavior patterns for maximum engagement."
    },
    {
      icon: Calendar,
      title: "Smart Campaign Planning",
      description: "Plan and schedule your marketing campaigns with intelligent suggestions and optimal timing."
    },
    {
      icon: BarChart3,
      title: "Business Intelligence",
      description: "Get deep insights into your marketing performance and customer engagement metrics."
    },
    {
      icon: Users,
      title: "Customer Segmentation",
      description: "Automatically segment your customers for more effective and personalized marketing campaigns."
    },
    {
      icon: Zap,
      title: "Automated Workflows",
      description: "Set up automated marketing sequences that engage customers at the perfect moment."
    }
  ];

  const benefits = [
    "Save 15+ hours per week on content creation",
    "Increase customer engagement by 40%",
    "Boost conversion rates with personalized messaging", 
    "Gain actionable insights from customer data",
    "Scale your marketing efforts effortlessly",
    "Stay consistent with regular, quality content"
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      business: "The Coffee Corner",
      text: "PromoPal transformed our social media presence. We've seen a 60% increase in customer engagement!",
      rating: 5
    },
    {
      name: "Mike Chen",
      business: "FitLife Gym",
      text: "The personalized email campaigns generated through PromoPal have doubled our membership renewals.",
      rating: 5
    },
    {
      name: "Emma Rodriguez",
      business: "Boutique Bliss",
      text: "Finally, marketing that actually works! Our sales have increased 35% since using PromoPal.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
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
              <Button variant="outline" onClick={() => navigate("/pricing")}>
                Pricing
              </Button>
              <Button onClick={() => navigate("/auth")}>
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-background to-secondary/20">
        <div className="container mx-auto px-6 text-center">
          <Badge className="mb-6 bg-gradient-primary text-white border-0">
            🎉 Trusted by 2,547+ growing businesses
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Marketing Made
            <span className="block text-transparent bg-gradient-primary bg-clip-text">
              Effortless
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Stop struggling with marketing content. PromoPal's AI creates personalized, 
            high-converting campaigns that speak directly to your customers and grow your business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="px-8 py-6 text-lg" onClick={() => navigate("/auth")}>
              Get Started
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-6 text-lg" onClick={() => navigate("/pricing")}>
              View Pricing
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            No credit card required • Setup in under 2 minutes
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Businesses Choose PromoPal</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of businesses already seeing real results with AI-powered marketing
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-16 bg-secondary/10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Real Results for Real Businesses</h2>
            <p className="text-lg text-muted-foreground">
              See what our clients have achieved with PromoPal
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3 p-4 bg-background rounded-lg shadow-sm">
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                <span className="text-foreground font-medium">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How PromoPal Works</h2>
            <p className="text-lg text-muted-foreground">
              Get up and running with AI-powered marketing in three simple steps
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-lg">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Connect Your Business</h3>
                <p className="text-muted-foreground">
                  Tell us about your business, products, and target audience in just a few minutes.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-lg">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">AI Creates Content</h3>
                <p className="text-muted-foreground">
                  Our AI generates personalized marketing content tailored to your business and customers.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-lg">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Watch Growth Happen</h3>
                <p className="text-muted-foreground">
                  Deploy your campaigns and track results as your business grows with data-driven marketing.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Marketing?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join 2,547+ businesses already seeing incredible results with PromoPal's AI-powered marketing platform.
          </p>
          <Button 
            size="lg" 
            variant="secondary" 
            className="px-8 py-6 text-lg bg-white text-primary hover:bg-white/90"
            onClick={() => navigate("/auth")}
          >
            Get Started Today
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <p className="text-sm opacity-75 mt-4">
            No commitment required • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-background border-t">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg">PromoPal</h3>
                <p className="text-xs text-muted-foreground">AI Marketing Assistant</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              © 2024 PromoPal. All rights reserved. Empowering businesses with intelligent marketing.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;