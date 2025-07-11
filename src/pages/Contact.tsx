import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, CheckCircle, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Contact = () => {
  const navigate = useNavigate();

  const handleContinue = () => {
    // Navigate to dashboard
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center p-6">
      <Card className="w-full max-w-md shadow-2xl border-0 text-center">
        <CardHeader>
          <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Phone className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">Almost There!</CardTitle>
          <CardDescription className="text-base">
            Your account has been created successfully
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-secondary/20 rounded-lg p-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <span className="font-semibold">Account Created</span>
            </div>
            <p className="text-muted-foreground mb-4">
              Welcome to PromoPal! To ensure you get the most value from our platform and access all features, our team will contact you shortly via phone to discuss the perfect plan for your business needs.
            </p>
            <div className="bg-gradient-primary/10 rounded-lg p-4 border border-primary/20">
              <p className="text-sm font-medium text-primary mb-2">
                What happens next?
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 text-left">
                <li>• A PromoPal specialist will call you within 24 hours</li>
                <li>• We'll discuss your business goals and marketing needs</li>
                <li>• You'll get a personalized plan recommendation</li>
                <li>• Once confirmed, you'll have full access to all features</li>
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              You can start exploring your dashboard now and set up your business profile to get personalized suggestions ready for when your plan is activated.
            </p>
            
            <Button onClick={handleContinue} className="w-full" size="lg">
              Continue to Dashboard
              <Sparkles className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            Have questions? You can reach us at support@promopal.com
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Contact;