import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  Sparkles, 
  Copy, 
  Download, 
  Save,
  MessageSquare,
  Mail,
  Share2,
  Target,
  Users,
  Calendar,
  TrendingUp,
  BarChart3
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { GoogleGenerativeAI } from "@google/generative-ai";
import GeminiApiKeyInput from "@/components/GeminiApiKeyInput";

interface ContentVariation {
  title: string;
  content: string;
  cta: string;
}

const GenerateContent = () => {
  const { toast } = useToast();
  const [campaignName, setCampaignName] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedTone, setSelectedTone] = useState("");
  const [description, setDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<ContentVariation[]>([]);
  const [personalizedCount, setPersonalizedCount] = useState(0);
  const [showSaveOptions, setShowSaveOptions] = useState(false);

  const generateContent = async () => {
    if (!campaignName || !selectedType || !selectedTone || !description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields before generating content.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      // Initialize Gemini AI
      const genAI = new GoogleGenerativeAI(
        localStorage.getItem('gemini_api_key') || 'your-api-key-here'
      );
      
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });
      
      // Get business profile and customer data
      const businessProfile = JSON.parse(localStorage.getItem('businessProfile') || '{}');
      const customerData = JSON.parse(localStorage.getItem('customerData') || '[]');
      
      // Store updated customer data
      localStorage.setItem('customerData', JSON.stringify(customerData));
      
      // Calculate personalized marketing reach
      let personalizedCount = 0;
      if (selectedType === "email") {
        personalizedCount = customerData.filter((customer: any) => 
          customer.email && customer.email.includes('@')
        ).length;
      } else if (selectedType === "social") {
        personalizedCount = Math.floor(customerData.length * 0.8);
      } else if (selectedType === "sms") {
        personalizedCount = customerData.filter((customer: any) => 
          customer.phone && customer.phone.length > 0
        ).length;
      }
      
      // Analyze customer segments
      const customerSegments = customerData.reduce((acc: any, customer: any) => {
        acc[customer.segment] = (acc[customer.segment] || 0) + 1;
        return acc;
      }, {});
      
      // Create comprehensive prompt for Gemini
      const prompt = `
        Create 3 unique and creative marketing content variations for a ${selectedType} campaign with the following details:
        
        BUSINESS PROFILE:
        - Business Name: ${businessProfile.businessName || 'N/A'}
        - Business Category: ${businessProfile.businessCategory || 'N/A'}
        - Location: ${businessProfile.location || 'N/A'}
        - Brand Voice: ${businessProfile.brandVoice || 'N/A'}
        - Business Bio: ${businessProfile.businessBio || 'N/A'}
        - Products/Services: ${businessProfile.productsServices || 'N/A'}
        
        CAMPAIGN DETAILS:
        - Campaign Name: ${campaignName}
        - Content Type: ${selectedType}
        - Tone: ${selectedTone}
        - Campaign Description: ${description}
        
        CUSTOMER DATA INSIGHTS:
        - Total Customers: ${customerData.length}
        - Customer Segments: ${JSON.stringify(customerSegments)}
        - Sample Customer Profiles: ${JSON.stringify(customerData.slice(0, 3))}
        
        REQUIREMENTS:
        1. Each variation should be distinctly different in approach and style
        2. Incorporate specific business details and customer insights naturally
        3. Match the ${selectedTone} tone consistently
        4. Optimize for ${selectedType} format and best practices
        5. Include compelling calls-to-action
        6. Make each piece feel personalized and data-driven
        7. Use the business location, category, and specific products/services mentioned
        8. Reference customer behavior patterns and segments intelligently
        
        Return ONLY a valid JSON object in this exact format:
        {
          "variations": [
            {
              "title": "Subject line or headline",
              "content": "Main content body",
              "cta": "Call to action text"
            },
            {
              "title": "Subject line or headline", 
              "content": "Main content body",
              "cta": "Call to action text"
            },
            {
              "title": "Subject line or headline",
              "content": "Main content body", 
              "cta": "Call to action text"
            }
          ]
        }
      `;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Parse the JSON response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsedResponse = JSON.parse(jsonMatch[0]);
        setGeneratedContent(parsedResponse.variations);
        setPersonalizedCount(personalizedCount);
        
        toast({
          title: "AI Content Generated Successfully!",
          description: `Created ${parsedResponse.variations.length} unique variations using Gemini AI with your business data.`
        });
      } else {
        throw new Error('Invalid response format from AI');
      }
      
    } catch (error) {
      console.error('Error generating content:', error);
      toast({
        title: "Content Generation Failed",
        description: "Please check your Gemini API key and try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Content copied to clipboard."
    });
  };

  const saveCampaign = (content: ContentVariation) => {
    const campaigns = JSON.parse(localStorage.getItem('campaigns') || '[]');
    const newCampaign = {
      id: Date.now().toString(),
      name: campaignName,
      type: selectedType,
      tone: selectedTone,
      description,
      content,
      createdAt: new Date().toISOString(),
      status: 'draft'
    };
    
    campaigns.push(newCampaign);
    localStorage.setItem('campaigns', JSON.stringify(campaigns));
    
    toast({
      title: "Campaign Saved",
      description: `${campaignName} has been saved to your campaigns.`
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-brand-purple" />
            AI Content Generation
          </h1>
          <p className="text-muted-foreground mt-2">
            Create personalized marketing content using Google Gemini AI that understands your business and customers.
          </p>
        </div>
      </div>

      <GeminiApiKeyInput />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-brand-teal" />
                Campaign Setup
              </CardTitle>
              <CardDescription>
                Configure your AI-powered marketing campaign
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Campaign Name</Label>
                <Input
                  placeholder="e.g., Summer Sale 2024"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Content Type</Label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose content type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email Marketing
                      </div>
                    </SelectItem>
                    <SelectItem value="social">
                      <div className="flex items-center gap-2">
                        <Share2 className="w-4 h-4" />
                        Social Media
                      </div>
                    </SelectItem>
                    <SelectItem value="sms">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        SMS Marketing
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Tone & Style</Label>
                <Select value={selectedTone} onValueChange={setSelectedTone}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="friendly">Friendly & Casual</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="playful">Playful & Fun</SelectItem>
                    <SelectItem value="urgent">Urgent & Persuasive</SelectItem>
                    <SelectItem value="sophisticated">Sophisticated</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Campaign Description</Label>
                <Textarea
                  placeholder="Describe your campaign goals, offers, or key messages..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                />
              </div>

              <Button 
                onClick={generateContent}
                disabled={isGenerating || !campaignName || !selectedType || !selectedTone || !description}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                    Generating with AI...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate AI Content
                  </>
                )}
              </Button>

              {personalizedCount > 0 && (
                <div className="mt-4 p-3 bg-brand-teal/10 rounded-lg">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-brand-teal" />
                    <span className="font-medium">Personalized Reach:</span>
                    <Badge variant="secondary">{personalizedCount} customers</Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          {generatedContent.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-brand-purple" />
                  AI-Generated Content Variations
                </CardTitle>
                <CardDescription>
                  3 unique variations created using your business profile and customer data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="0" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="0">Variation 1</TabsTrigger>
                    <TabsTrigger value="1">Variation 2</TabsTrigger>
                    <TabsTrigger value="2">Variation 3</TabsTrigger>
                  </TabsList>
                  
                  {generatedContent.map((variation, index) => (
                    <TabsContent key={index} value={index.toString()} className="space-y-4 mt-6">
                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm font-medium">Subject/Headline</Label>
                          <div className="mt-1 p-3 border rounded-lg bg-muted/50">
                            <p className="font-medium">{variation.title}</p>
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm font-medium">Content</Label>
                          <div className="mt-1 p-4 border rounded-lg bg-muted/50">
                            <p className="whitespace-pre-line">{variation.content}</p>
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm font-medium">Call to Action</Label>
                          <div className="mt-1 p-3 border rounded-lg bg-muted/50">
                            <p className="font-medium text-brand-purple">{variation.cta}</p>
                          </div>
                        </div>

                        <Separator />

                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            onClick={() => copyToClipboard(`${variation.title}\n\n${variation.content}\n\n${variation.cta}`)}
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            Copy All
                          </Button>
                          <Button onClick={() => saveCampaign(variation)}>
                            <Save className="w-4 h-4 mr-2" />
                            Save Campaign
                          </Button>
                        </div>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-64 text-center">
                <Sparkles className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Ready to Generate Content</h3>
                <p className="text-muted-foreground">
                  Fill in the campaign details and click "Generate AI Content" to create personalized marketing content using Gemini AI.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenerateContent;