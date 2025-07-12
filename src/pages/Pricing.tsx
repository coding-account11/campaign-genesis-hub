import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Check, 
  Sparkles, 
  ArrowLeft,
  Star,
  Zap,
  Users,
  BarChart3,
  Calendar,
  MessageSquare
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Pricing = () => {
  const navigate = useNavigate();
  const [isAnnual, setIsAnnual] = useState(true);

  const features = [
    "AI-powered content generation",
    "Personalized marketing campaigns", 
    "Customer data analytics",
    "Marketing calendar & scheduling",
    "Business insights dashboard",
    "Email & social media templates",
    "Customer segmentation tools",
    "Performance tracking & reports",
    "24/7 customer support",
    "Priority phone consultation"
  ];

  const monthlyPrice = isAnnual ? 29 : 99;
  const billingText = isAnnual ? "Billed Annually" : "Billed Monthly";

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => navigate("/")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-xl">PromoPal</h1>
                <p className="text-xs text-muted-foreground">AI Marketing Assistant</p>
              </div>
            </div>
            <Button onClick={() => navigate("/auth")}>
              Get Started
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-16">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Choose the plan that works best for your business. All plans include our full suite of AI-powered marketing tools.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-secondary rounded-lg p-1 mb-12">
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-6 py-3 rounded-md font-medium transition-all ${
                isAnnual 
                  ? "bg-background text-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Annual
              <Badge className="ml-2 bg-green-500 text-white text-xs">Save 75%</Badge>
            </button>
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-6 py-3 rounded-md font-medium transition-all ${
                !isAnnual 
                  ? "bg-background text-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Monthly
            </button>
          </div>
        </div>

        {/* Pricing Card */}
        <div className="max-w-lg mx-auto">
          <Card className="border-2 border-primary shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-primary" />
            
            <CardHeader className="text-center pb-8">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold">PromoPal Pro</CardTitle>
              <CardDescription className="text-base">
                Everything you need to transform your marketing
              </CardDescription>
              
              <div className="mt-6">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-5xl font-bold">${monthlyPrice}</span>
                  <div className="text-left">
                    <div className="text-sm font-medium">per month</div>
                    <div className="text-xs text-muted-foreground">{billingText}</div>
                  </div>
                </div>
                {isAnnual && (
                  <p className="text-sm text-muted-foreground mt-2">
                    ${Math.round(monthlyPrice * 12)} billed annually
                  </p>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  Everything Included:
                </h4>
                <div className="grid gap-3">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-secondary/50 rounded-lg p-4 border">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  <span className="font-medium text-sm">Personal Consultation</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Get started with a personalized phone consultation to optimize your marketing strategy for maximum results.*
                </p>
              </div>

              <Button 
                className="w-full" 
                size="lg"
                onClick={() => navigate("/auth")}
              >
                Get Started
                <Sparkles className="w-4 h-4 ml-2" />
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                Free trial for 7 days will be enabled after the phone call. Our team will contact you to discuss plan details and ensure you get the most value from PromoPal.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h3>
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold mb-2">How does the consultation work?</h4>
              <p className="text-muted-foreground text-sm">
                After signing up, our marketing specialists will call you within 24 hours to understand your business needs and help you get the most value from PromoPal.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Can I cancel anytime?</h4>
              <p className="text-muted-foreground text-sm">
                Yes, you can cancel your subscription at any time. There are no long-term commitments or cancellation fees.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Is there a free trial?</h4>
              <p className="text-muted-foreground text-sm">
                We offer a personalized demo and consultation to ensure PromoPal is the right fit for your business before you commit.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;