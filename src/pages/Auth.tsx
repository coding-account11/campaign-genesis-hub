import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });
  const [isSignUp, setIsSignUp] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (isSignUp) {
        // Check if user already exists
        const { data: existingUser } = await supabase
          .from('user_profiles')
          .select('email')
          .eq('email', formData.email)
          .single();

        if (existingUser) {
          toast({
            title: "Account already exists",
            description: "An account with this email already exists. Please sign in instead.",
            variant: "destructive"
          });
          setIsLoading(false);
          return;
        }

        // Create new user account
        const { error } = await supabase
          .from('user_profiles')
          .insert({
            email: formData.email,
            phone: formData.phone,
            signup_date: new Date().toISOString()
          });

        if (error) {
          toast({
            title: "Sign up failed",
            description: "Unable to create account. Please try again.",
            variant: "destructive"
          });
          setIsLoading(false);
          return;
        }

        // Save to localStorage for session management
        localStorage.setItem('currentUserEmail', formData.email);
        localStorage.setItem('userData', JSON.stringify({
          email: formData.email,
          phone: formData.phone,
          signupDate: new Date().toISOString()
        }));
        
        toast({
          title: "Account created successfully",
          description: "Welcome to PromoPal!"
        });
        
        navigate("/contact");
      } else {
        // Login - check if user exists in database
        const { data: existingUser } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('email', formData.email)
          .single();

        if (!existingUser) {
          toast({
            title: "Account not found",
            description: "No account found with this email. Please sign up first.",
            variant: "destructive"
          });
          setIsLoading(false);
          return;
        }

        // Save to localStorage for session management
        localStorage.setItem('currentUserEmail', formData.email);
        localStorage.setItem('userData', JSON.stringify({
          email: existingUser.email,
          phone: existingUser.phone,
          signupDate: existingUser.signup_date
        }));
        
        toast({
          title: "Welcome back!",
          description: "Successfully signed in."
        });
        
        navigate("/dashboard");
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast({
        title: "Error",
        description: isSignUp ? "Failed to create account. Please try again." : "Failed to sign in. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center p-6">
      {/* Header */}
      <div className="absolute top-6 left-6">
        <Button variant="ghost" onClick={() => navigate("/")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
      </div>

      <Card className="w-full max-w-md shadow-2xl border-0">
        <CardHeader className="text-center">
          <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">
            {isSignUp ? "Create Your Account" : "Welcome Back"}
          </CardTitle>
          <CardDescription>
            {isSignUp 
              ? "Join thousands of businesses growing with PromoPal" 
              : "Sign in to your PromoPal account"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>

            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Processing..." : (isSignUp ? "Create Account" : "Sign In")}
            </Button>

            <div className="text-center">
              <Button
                type="button"
                variant="link"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm"
              >
                {isSignUp 
                  ? "Already have an account? Sign in" 
                  : "Don't have an account? Sign up"
                }
              </Button>
            </div>

            {isSignUp && (
              <p className="text-xs text-muted-foreground text-center mt-4">
                By creating an account, you agree to our Terms of Service and Privacy Policy.
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;