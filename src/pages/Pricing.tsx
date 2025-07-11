import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  Check, 
  ArrowLeft, 
  Sparkles,
  Users,
  Calendar,
  BarChart3,
  Zap,
  Target,
  Mail,
  Phone
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Pricing = () => {
  const navigate = useNavigate();
  const [isAnnual, setIsAnnual] = useState(true);

  const features = [
    { icon: Sparkles, text: "AI-Powered Content Generation" },
    { icon: Target, text: "Smart Customer Targeting" },
    { icon: Calendar, text: "Marketing Calendar & Scheduling" },
    { icon: BarChart3, text: "Performance Analytics & Insights" },
    { icon: Mail, text: "Email & SMS Campaign Management" },
    { icon: Users, text: "Customer Segmentation & Profiles" },
    { icon: Zap, text: "Automated Campaign Optimization" },
    { icon: Phone, text: "Dedicated Account Support" }
  ];

  const handleGetStarted = () => {
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
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
          
          <Button onClick={handleGetStarted}>
            Get Started
          </Button>
        </div>
      </header>

      {/* Pricing Content */}
      <div className="container mx-auto max-w-4xl px-6 py-16">
        <div className="text-center space-y-6 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-muted-foreground">
            Choose the plan that works best for your business
          </p>
          
          {/* Annual/Monthly Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span className={`text-sm ${!isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>
              Monthly
            </span>
            <Switch
              checked={isAnnual}
              onCheckedChange={setIsAnnual}
              className="data-[state=checked]:bg-gradient-primary"
            />
            <span className={`text-sm ${isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>
              Annual
            </span>
            {isAnnual && (
              <Badge variant="secondary" className="ml-2">
                Save 75%
              </Badge>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Annual Plan */}
          <Card className={`border-2 ${isAnnual ? 'border-brand-purple shadow-elegant' : 'border-border'} relative`}>
            {isAnnual && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-primary text-white border-0">
                  Most Popular
                </Badge>
              </div>
            )}
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-2xl">Annual Plan</CardTitle>
              <CardDescription>Best value for growing businesses</CardDescription>
              <div className="mt-4">
                <div className="text-4xl font-bold">$49</div>
                <div className="text-muted-foreground">per month, billed annually</div>
                <div className="text-sm text-muted-foreground mt-1">
                  $588 per year
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-gradient-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <div className="flex items-center gap-2">
                      <feature.icon className="w-4 h-4 text-brand-purple" />
                      <span className="text-sm">{feature.text}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button 
                onClick={handleGetStarted}
                className={`w-full ${isAnnual ? 'bg-gradient-primary hover:opacity-90 text-white border-0' : ''}`}
                variant={isAnnual ? 'default' : 'outline'}
              >
                Get Started
              </Button>
            </CardContent>
          </Card>

          {/* Monthly Plan */}
          <Card className={`border-2 ${!isAnnual ? 'border-brand-purple shadow-elegant' : 'border-border'} relative`}>
            {!isAnnual && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-primary text-white border-0">
                  Most Flexible
                </Badge>
              </div>
            )}
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-2xl">Monthly Plan</CardTitle>
              <CardDescription>Perfect for trying our service</CardDescription>
              <div className="mt-4">
                <div className="text-4xl font-bold">$199</div>
                <div className="text-muted-foreground">per month, billed monthly</div>
                <div className="text-sm text-muted-foreground mt-1">
                  No annual commitment
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-gradient-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <div className="flex items-center gap-2">
                      <feature.icon className="w-4 h-4 text-brand-purple" />
                      <span className="text-sm">{feature.text}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button 
                onClick={handleGetStarted}
                className={`w-full ${!isAnnual ? 'bg-gradient-primary hover:opacity-90 text-white border-0' : ''}`}
                variant={!isAnnual ? 'default' : 'outline'}
              >
                Get Started
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Contact Info */}
        <div className="text-center space-y-4">
          <div className="bg-muted/50 rounded-lg p-6">
            <h3 className="font-semibold mb-2">Ready to Get Started?</h3>
            <p className="text-muted-foreground mb-4">
              Create your account and our team will contact you within 24 hours to discuss your specific needs and help you get the most out of PromoPal.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Phone className="w-4 h-4" />
              <span>Phone consultation included with all plans</span>
            </div>
          </div>
          
          <Button 
            size="lg"
            onClick={handleGetStarted}
            className="bg-gradient-primary hover:opacity-90 text-white border-0 shadow-elegant"
          >
            Get Started
          </Button>
          
          <p className="text-sm text-muted-foreground">
            Setup in minutes • Refer friends for $25 credits • Cancel anytime
          </p>
        </div>
      </div>
    </div>
  );
};

export default Pricing;