import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Upload, FileText, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const BusinessProfile = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    businessName: "",
    businessCategory: "",
    location: "",
    businessEmail: "",
    brandVoice: "friendly",
    businessBio: "",
    productsServices: "",
    businessMaterials: ""
  });
  const [loading, setLoading] = useState(true);
  
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [isExistingUser, setIsExistingUser] = useState(false);

  // Load user data on component mount
  useEffect(() => {
    const loadUserData = async () => {
      const currentUserEmail = localStorage.getItem('currentUserEmail');
      
      if (currentUserEmail) {
        // Try to load from Supabase first
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('email', currentUserEmail)
          .single();

        if (profile) {
          setFormData({
            businessName: profile.business_name || "",
            businessCategory: profile.business_category || "",
            location: profile.location || "",
            businessEmail: profile.email,
            brandVoice: profile.brand_voice || "friendly",
            businessBio: profile.business_bio || "",
            productsServices: profile.products_services || "",
          businessMaterials: profile.business_materials || ""
          });
          setIsExistingUser(!!profile.business_name);
        } else {
          // Fallback to localStorage
          const userData = JSON.parse(localStorage.getItem('userData') || '{}');
          setFormData(prev => ({
            ...prev,
            businessEmail: userData.email || currentUserEmail
          }));
        }
      }
      
      setLoading(false);
    };

    loadUserData();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files).map(file => file.name);
      setUploadedFiles(prev => [...prev, ...newFiles]);
      toast({
        title: "Files uploaded successfully",
        description: `${newFiles.length} file(s) have been uploaded.`
      });
    }
  };

  const removeFile = (fileName: string) => {
    setUploadedFiles(prev => prev.filter(file => file !== fileName));
  };

  const handleSave = async () => {
    try {
      const currentUserEmail = localStorage.getItem('currentUserEmail');
      
      if (currentUserEmail) {
        // Update in Supabase
        const { error } = await supabase
          .from('user_profiles')
          .update({
            business_name: formData.businessName,
            business_category: formData.businessCategory,
            location: formData.location,
            brand_voice: formData.brandVoice,
            business_bio: formData.businessBio,
            products_services: formData.productsServices,
            business_materials: formData.businessMaterials
          })
          .eq('email', currentUserEmail);

        if (error) {
          console.error('Error updating profile:', error);
        }
      }
      
      // Also save to localStorage for immediate use
      localStorage.setItem('businessProfile', JSON.stringify(formData));
      
      toast({
        title: "Profile updated successfully",
        description: "Your business profile has been saved."
      });
      
      setIsExistingUser(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive"
      });
    }
  };

  const pageTitle = isExistingUser ? "Edit Business Profile" : "Set Up Your Business Profile";

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="h-32 bg-muted rounded-lg animate-pulse" />
        <div className="h-96 bg-muted rounded-lg animate-pulse" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{pageTitle}</h1>
        <p className="text-muted-foreground mt-2">
          Help our AI create better marketing content by telling us about your business.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Business Information</CardTitle>
          <CardDescription>
            Basic details about your business that will be used to personalize your content.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="businessName">Business Name *</Label>
            <Input
              id="businessName"
              value={formData.businessName}
              onChange={(e) => handleInputChange("businessName", e.target.value)}
              placeholder="Enter your business name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="businessCategory">Business Category *</Label>
            <Select value={formData.businessCategory} onValueChange={(value) => handleInputChange("businessCategory", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="restaurant">Restaurant</SelectItem>
                <SelectItem value="retail">Retail</SelectItem>
                <SelectItem value="services">Services</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="beauty">Beauty & Wellness</SelectItem>
                <SelectItem value="fitness">Fitness</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="automotive">Automotive</SelectItem>
                <SelectItem value="real-estate">Real Estate</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              placeholder="City, State"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="businessEmail">Business Email</Label>
            <Input
              id="businessEmail"
              value={formData.businessEmail}
              readOnly
              className="bg-muted"
            />
            <p className="text-sm text-muted-foreground">
              This email will be used for sending emails and cannot be changed here.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Brand Voice & Tone</CardTitle>
          <CardDescription>
            Choose the tone that best represents your brand's personality.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup 
            value={formData.brandVoice} 
            onValueChange={(value) => handleInputChange("brandVoice", value)}
            className="space-y-4"
          >
            <div className="flex items-start space-x-3 p-3 border rounded-lg">
              <RadioGroupItem value="friendly" id="friendly" className="mt-1" />
              <div>
                <Label htmlFor="friendly" className="font-medium">Friendly</Label>
                <p className="text-sm text-muted-foreground">Warm, approachable, and conversational</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 border rounded-lg">
              <RadioGroupItem value="professional" id="professional" className="mt-1" />
              <div>
                <Label htmlFor="professional" className="font-medium">Professional</Label>
                <p className="text-sm text-muted-foreground">Formal, expert, and trustworthy</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 border rounded-lg">
              <RadioGroupItem value="playful" id="playful" className="mt-1" />
              <div>
                <Label htmlFor="playful" className="font-medium">Playful</Label>
                <p className="text-sm text-muted-foreground">Fun, energetic, and creative</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 border rounded-lg">
              <RadioGroupItem value="sophisticated" id="sophisticated" className="mt-1" />
              <div>
                <Label htmlFor="sophisticated" className="font-medium">Sophisticated</Label>
                <p className="text-sm text-muted-foreground">Elegant, refined, and premium</p>
              </div>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Business Description</CardTitle>
          <CardDescription>
            Tell us about your business in your own words.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="businessBio">Short Business Bio</Label>
            <Textarea
              id="businessBio"
              value={formData.businessBio}
              onChange={(e) => handleInputChange("businessBio", e.target.value)}
              placeholder="Describe your business in a few sentences..."
              maxLength={500}
              rows={3}
            />
            <p className="text-sm text-muted-foreground">
              {formData.businessBio.length}/500 characters
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="productsServices">Products, Services, or Menu</Label>
            <Textarea
              id="productsServices"
              value={formData.productsServices}
              onChange={(e) => handleInputChange("productsServices", e.target.value)}
              placeholder="List your main products, services, or menu items..."
              rows={6}
            />
            <p className="text-sm text-muted-foreground">
              Be as detailed as possible. This helps our AI create more relevant content.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Additional Business Materials</CardTitle>
          <CardDescription>
            Describe your menus, product catalogs, current Instagram page style, or other business materials so the AI can customize content to fit your brand's theme and style. Include any URLs or links in your Products/Services section above.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="businessMaterials">Business Materials Description</Label>
            <Textarea
              id="businessMaterials"
              value={formData.businessMaterials}
              onChange={(e) => handleInputChange("businessMaterials", e.target.value)}
              placeholder="Describe your current branding, Instagram aesthetic, menu layout, product presentation style, color schemes, typical promotional materials, etc. Be as detailed as possible to help our AI match your brand's look and feel."
              rows={6}
            />
            <p className="text-sm text-muted-foreground">
              Include details about your visual style, color preferences, typical layouts, social media aesthetic, and any specific branding elements you use.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} className="px-8">
          {isExistingUser ? "Update Profile" : "Save & Continue"}
        </Button>
      </div>
    </div>
  );
};

export default BusinessProfile;