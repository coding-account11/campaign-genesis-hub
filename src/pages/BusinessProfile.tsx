import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Upload, FileText, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const BusinessProfile = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    businessName: "Cozy Corner Cafe",
    businessCategory: "restaurant",
    location: "Downtown, Springfield",
    businessEmail: "user@example.com",
    brandVoice: "friendly",
    businessBio: "A warm, welcoming neighborhood cafe serving freshly roasted coffee and homemade pastries since 2018.",
    productsServices: "• Specialty coffee drinks (espresso, lattes, cappuccinos)\n• Fresh pastries and baked goods\n• Light lunch options (sandwiches, salads)\n• Catering services for local events\n• Coffee beans for retail purchase"
  });
  
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([
    "summer-menu-2024.pdf",
    "catering-brochure.pdf"
  ]);

  const [isExistingUser, setIsExistingUser] = useState(true);

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

  const handleSave = () => {
    // Save business profile to localStorage
    localStorage.setItem('businessProfile', JSON.stringify(formData));
    
    toast({
      title: "Profile updated successfully",
      description: "Your business profile has been saved."
    });
  };

  const pageTitle = isExistingUser ? "Edit Business Profile" : "Set Up Your Business Profile";

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
          <CardTitle>Additional Files</CardTitle>
          <CardDescription>
            Upload menus, product catalogs, or other relevant files to help our AI understand your offerings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8">
            <div className="text-center">
              <Upload className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
              <div className="text-lg font-medium mb-2">Upload Menu/Product Files</div>
              <p className="text-muted-foreground mb-4">PDF, Images, etc.</p>
              <input
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <Button variant="outline" asChild>
                <label htmlFor="file-upload" className="cursor-pointer">
                  Choose Files
                </label>
              </Button>
            </div>
          </div>

          {uploadedFiles.length > 0 && (
            <div className="space-y-3">
              <Label>Uploaded Files</Label>
              {uploadedFiles.map((fileName, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-muted-foreground" />
                    <span className="text-sm">{fileName}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(fileName)}
                    className="text-destructive hover:text-destructive"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
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