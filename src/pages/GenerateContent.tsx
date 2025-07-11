import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Sparkles, 
  Copy, 
  Save,
  Users,
  Zap,
  AlertTriangle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { GoogleGenerativeAI } from "@google/generative-ai";
import GeminiApiKeyInput from "@/components/GeminiApiKeyInput";
import { useLocation, useNavigate } from "react-router-dom";

interface ContentVariation {
  title: string;
  content: string;
  cta: string;
}

const GenerateContent = () => {
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const [campaignType, setCampaignType] = useState("personalized");
  const [platformType, setPlatformType] = useState("direct");
  const [targetAudience, setTargetAudience] = useState("keyword");
  const [targetKeyword, setTargetKeyword] = useState("");
  const [selectedSegment, setSelectedSegment] = useState("");
  const [callToActionGoal, setCallToActionGoal] = useState("");
  const [seasonalTheme, setSeasonalTheme] = useState("");
  const [focusKeywords, setFocusKeywords] = useState("");
  const [additionalInstructions, setAdditionalInstructions] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<ContentVariation[]>([]);
  const [personalizedCount, setPersonalizedCount] = useState(0);

  // Get customer data for real-time calculations
  const customerData = JSON.parse(localStorage.getItem('customerData') || '[]');
  const segments = [...new Set(customerData.map((c: any) => c.segment))].filter(Boolean) as string[];

  // Calculate keyword matches in real-time
  const keywordMatches = useMemo(() => {
    if (!targetKeyword.trim()) return 0;
    return customerData.filter((customer: any) => 
      customer.purchaseHistory?.toLowerCase().includes(targetKeyword.toLowerCase())
    ).length;
  }, [targetKeyword, customerData]);

  // Calculate segment customer counts
  const segmentCounts = useMemo(() => {
    return segments.reduce((acc, segment) => {
      acc[segment] = customerData.filter((customer: any) => customer.segment === segment).length;
      return acc;
    }, {} as Record<string, number>);
  }, [segments, customerData]);

  // Handle URL parameters for suggestions
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const suggestion = urlParams.get('suggestion');
    const title = urlParams.get('title');
    const description = urlParams.get('description');
    
    if (suggestion) {
      // Auto-populate based on suggestion type
      switch (suggestion) {
        case 'personalized-email':
          setCampaignType('personalized');
          setPlatformType('direct');
          setCallToActionGoal('make_purchase');
          setAdditionalInstructions(description || 'Create personalized email content based on customer purchase history to drive repeat sales.');
          break;
        case 'seasonal-promo':
          setCampaignType('general');
          setPlatformType('social');
          setSeasonalTheme('holiday');
          setCallToActionGoal('visit_store');
          setAdditionalInstructions(description || 'Create seasonal promotional content to increase foot traffic and holiday sales.');
          break;
        case 'loyalty-program':
          setCampaignType('personalized');
          setPlatformType('direct');
          setCallToActionGoal('join_loyalty');
          setAdditionalInstructions(description || 'Promote loyalty program benefits to encourage customer retention and repeat business.');
          break;
        case 'local-event':
          setCampaignType('general');
          setPlatformType('local');
          setCallToActionGoal('visit_store');
          setAdditionalInstructions(description || 'Promote local events or community engagement to build brand awareness.');
          break;
        default:
          if (description) {
            setAdditionalInstructions(description);
          }
      }
      
      // Clear URL parameters after setting values
      window.history.replaceState({}, '', location.pathname);
    }
  }, [location]);

  // Handle campaign type change - reset platform type for personalized
  const handleCampaignTypeChange = (value: string) => {
    setCampaignType(value);
    if (value === "personalized") {
      setPlatformType("direct");
    }
  };

  const generateContent = async () => {
    if (!callToActionGoal || !additionalInstructions) {
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
      const apiKey = localStorage.getItem('gemini_api_key');
      if (!apiKey) {
        toast({
          title: "API Key Required",
          description: "Please enter your Google Gemini API key first.",
          variant: "destructive"
        });
        return;
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      // Get business profile and customer data
      const businessProfile = JSON.parse(localStorage.getItem('businessProfile') || '{}');
      const customerData = JSON.parse(localStorage.getItem('customerData') || '[]');
      
      // Calculate personalized marketing reach
      let personalizedCount = 0;
      if (campaignType === "personalized") {
        if (platformType === "direct") {
          personalizedCount = customerData.filter((customer: any) => 
            customer.email && customer.email.includes('@')
          ).length;
        } else {
          personalizedCount = Math.floor(customerData.length * 0.8);
        }
      }
      
      // Analyze customer segments
      const customerSegments = customerData.reduce((acc: any, customer: any) => {
        acc[customer.segment] = (acc[customer.segment] || 0) + 1;
        return acc;
      }, {});

      // Filter customers based on targeting
      let targetedCustomers = customerData;
      if (targetAudience === "keyword" && targetKeyword) {
        targetedCustomers = customerData.filter((customer: any) => 
          customer.purchaseHistory?.toLowerCase().includes(targetKeyword.toLowerCase())
        );
      } else if (targetAudience === "segment" && selectedSegment) {
        targetedCustomers = customerData.filter((customer: any) => 
          customer.segment === selectedSegment
        );
      }
      
      // Create comprehensive prompt for Gemini
      const prompt = `
        Create 3 unique and highly creative marketing content variations based on the following comprehensive campaign setup:
        
        BUSINESS PROFILE:
        - Business Name: ${businessProfile.businessName || 'N/A'}
        - Business Category: ${businessProfile.businessCategory || 'N/A'}
        - Location: ${businessProfile.location || 'N/A'}
        - Brand Voice: ${businessProfile.brandVoice || 'N/A'}
        - Business Bio: ${businessProfile.businessBio || 'N/A'}
        - Products/Services: ${businessProfile.productsServices || 'N/A'}
        
        CAMPAIGN CONFIGURATION:
        - Campaign Type: ${campaignType === "personalized" ? "Personalized Marketing - Targeted content for specific customers" : "General Marketing - Broad content for all audiences"}
        - Platform Type: ${platformType === "direct" ? "Direct to Customer (Email/SMS)" : 
          platformType === "social" ? "Social Media Post (Facebook, Instagram, Twitter)" :
          platformType === "email" ? "Email Campaign (Newsletter/Promotional)" :
          platformType === "local" ? "Local Advertisement (Google Ads, local listings)" : "General Marketing"}
        - Target Audience Strategy: ${targetAudience === "keyword" ? `Target by Keywords in Purchase History: "${targetKeyword}"` : `Target by Customer Segment: "${selectedSegment}"`}
        - Call-to-Action Goal: ${callToActionGoal}
        - Seasonal Theme: ${seasonalTheme || 'None'}
        - Focus Keywords: ${focusKeywords || 'None specified'}
        - Additional Instructions: ${additionalInstructions}
        
        CUSTOMER DATA INSIGHTS:
        - Total Customers: ${customerData.length}
        - Customer Segments: ${JSON.stringify(customerSegments)}
        - Targeted Customer Count: ${targetedCustomers.length}
        - Sample Targeted Profiles: ${JSON.stringify(targetedCustomers.slice(0, 3))}
        
        ADVANCED REQUIREMENTS:
        1. Each variation should be distinctly different in approach, tone, and creative execution
        2. Leverage the specific business details and customer insights intelligently
        3. Optimize content for the selected platform type and delivery method
        4. Incorporate the call-to-action goal naturally and persuasively
        5. Use focus keywords strategically throughout the content
        6. Apply seasonal theme if specified to enhance relevance
        7. Follow the additional instructions precisely while maintaining creativity
        8. Ensure each piece feels genuinely personalized based on customer data
        9. Create compelling, action-oriented content that drives engagement
        10. Make the content feel fresh, unique, and professionally crafted
        
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
          description: `Created ${parsedResponse.variations.length} unique variations using advanced targeting and business intelligence.`
        });
      } else {
        throw new Error('Invalid response format from AI');
      }
      
    } catch (error: any) {
      console.error('Error generating content:', error);
      
      // Check if it's a quota error
      if (error.status === 429 || error.message?.includes('quota')) {
        toast({
          title: "Quota Limit Reached",
          description: "You've exceeded your Gemini API quota. Please wait or upgrade your plan.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Content Generation Failed",
          description: "Please check your Gemini API key and try again.",
          variant: "destructive"
        });
      }
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
      name: `${campaignType === "personalized" ? "Personalized" : "General"} Campaign`,
      title: content.title,
      content: content.content,
      platform: platformType,
      type: campaignType,
      targetAudience: targetAudience === "keyword" ? targetKeyword : selectedSegment,
      cta: content.cta,
      createdAt: new Date().toISOString(),
      status: 'scheduled',
      date: new Date()
    };
    
    campaigns.push(newCampaign);
    localStorage.setItem('campaigns', JSON.stringify(campaigns));
    
    toast({
      title: "Campaign Saved",
      description: "Campaign has been saved to your marketing calendar."
    });
  };


  // Check for warnings
  const businessProfile = JSON.parse(localStorage.getItem('businessProfile') || '{}');
  const hasBusinessProfile = Object.keys(businessProfile).length > 0 && businessProfile.businessName;
  const hasCustomerData = customerData.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-brand-purple" />
            AI Content Generation
          </h1>
          <p className="text-muted-foreground mt-2">
            Create compelling marketing content powered by AI. Choose your campaign type and let our AI craft personalized content using your complete business profile and customer insights.
          </p>
        </div>
      </div>

      {/* Business Profile Warning */}
      {!hasBusinessProfile && (
        <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-700 dark:text-red-300">
            <span className="font-medium">Business Profile Required:</span> Please{" "}
            <Button 
              variant="link" 
              className="p-0 h-auto text-red-700 dark:text-red-300 underline"
              onClick={() => navigate("/dashboard/business-profile")}
            >
              fill out your business profile
            </Button>{" "}
            to get personalized content suggestions.
          </AlertDescription>
        </Alert>
      )}

      {/* Customer Data Warning for Personalized Marketing */}
      {campaignType === "personalized" && !hasCustomerData && (
        <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-700 dark:text-red-300">
            <span className="font-medium">Customer Data Required:</span> Please{" "}
            <Button 
              variant="link" 
              className="p-0 h-auto text-red-700 dark:text-red-300 underline"
              onClick={() => navigate("/dashboard/customer-data")}
            >
              add customer data
            </Button>{" "}
            to create personalized marketing campaigns.
          </AlertDescription>
        </Alert>
      )}

      <GeminiApiKeyInput />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-brand-teal" />
                Content Settings
              </CardTitle>
              <CardDescription>
                Configure your AI-powered marketing campaign
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Campaign Type */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Campaign Type</Label>
                <RadioGroup value={campaignType} onValueChange={handleCampaignTypeChange}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="general" id="general" />
                    <Label htmlFor="general" className="flex items-center gap-2">
                      <span className="text-sm">General Marketing</span>
                      <Badge variant="outline" className="text-xs">AI Powered</Badge>
                    </Label>
                  </div>
                  <p className="text-xs text-muted-foreground ml-6">Broad content for all audiences</p>
                  
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="personalized" id="personalized" />
                    <Label htmlFor="personalized" className="flex items-center gap-2">
                      <span className="text-sm">Personalized Marketing</span>
                      <Badge variant="outline" className="text-xs">AI Powered</Badge>
                    </Label>
                  </div>
                  <p className="text-xs text-muted-foreground ml-6">Targeted content for specific customers</p>
                </RadioGroup>
              </div>

              <Separator />

              {/* Platform Type */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Platform Type</Label>
                <RadioGroup value={platformType} onValueChange={setPlatformType}>
                  {campaignType === "personalized" ? (
                    // Only Direct to Customer for personalized marketing
                    <>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="direct" id="direct" />
                        <Label htmlFor="direct" className="text-sm">Direct to Customer</Label>
                      </div>
                      <p className="text-xs text-muted-foreground ml-6">Personalized Email or Text Messages</p>
                    </>
                  ) : (
                    // All options for general marketing
                    <>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="social" id="social" />
                        <Label htmlFor="social" className="text-sm">Social Media Post</Label>
                      </div>
                      <p className="text-xs text-muted-foreground ml-6">Facebook, Instagram, Twitter, etc.</p>
                      
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="email" id="email" />
                        <Label htmlFor="email" className="text-sm">Email Campaign</Label>
                      </div>
                      <p className="text-xs text-muted-foreground ml-6">Newsletter or promotional email</p>
                      
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="local" id="local" />
                        <Label htmlFor="local" className="text-sm">Local Advertisement</Label>
                      </div>
                      <p className="text-xs text-muted-foreground ml-6">Google Ads, local listings, print media</p>
                    </>
                  )}
                </RadioGroup>
              </div>

              <Separator />

              {/* Target Audience */}
              {campaignType === "personalized" && (
                <>
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Target Audience</Label>
                    <RadioGroup value={targetAudience} onValueChange={setTargetAudience}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="keyword" id="keyword" />
                        <Label htmlFor="keyword" className="text-sm">Target by Keyword in Purchase History</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="segment" id="segment" />
                        <Label htmlFor="segment" className="text-sm">Target by Segment</Label>
                      </div>
                    </RadioGroup>
                    
                    {targetAudience === "keyword" && (
                      <div className="space-y-2">
                        <Input
                          placeholder="e.g., coffee, new shoes, VIP"
                          value={targetKeyword}
                          onChange={(e) => setTargetKeyword(e.target.value)}
                          className="mt-2"
                        />
                        {targetKeyword && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Users className="w-3 h-3" />
                            <span>{keywordMatches} customers match this keyword</span>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {targetAudience === "segment" && (
                      <Select value={selectedSegment} onValueChange={setSelectedSegment}>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select a segment to target" />
                        </SelectTrigger>
                        <SelectContent>
                          {segments.map((segment) => (
                            <SelectItem key={segment} value={segment}>
                              <div className="flex items-center justify-between w-full">
                                <span>{segment}</span>
                                <Badge variant="outline" className="ml-2">
                                  {segmentCounts[segment]} customers
                                </Badge>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                  <Separator />
                </>
              )}

              {/* Call-to-Action Goal */}
              <div className="space-y-2">
                <Label>Call-to-Action Goal (Optional)</Label>
                <Select value={callToActionGoal} onValueChange={setCallToActionGoal}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a campaign goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="visit_store">Visit Store/Location</SelectItem>
                    <SelectItem value="make_purchase">Make a Purchase</SelectItem>
                    <SelectItem value="sign_up">Sign Up/Register</SelectItem>
                    <SelectItem value="download_app">Download App</SelectItem>
                    <SelectItem value="book_appointment">Book Appointment</SelectItem>
                    <SelectItem value="request_quote">Request Quote</SelectItem>
                    <SelectItem value="follow_social">Follow Social Media</SelectItem>
                    <SelectItem value="join_loyalty">Join Loyalty Program</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Seasonal Theme */}
              <div className="space-y-2">
                <Label>Seasonal Theme (Optional)</Label>
                <Select value={seasonalTheme} onValueChange={setSeasonalTheme}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a seasonal theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="spring">Spring</SelectItem>
                    <SelectItem value="summer">Summer</SelectItem>
                    <SelectItem value="fall">Fall/Autumn</SelectItem>
                    <SelectItem value="winter">Winter</SelectItem>
                    <SelectItem value="holiday">Holiday Season</SelectItem>
                    <SelectItem value="back-to-school">Back to School</SelectItem>
                    <SelectItem value="new-year">New Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Focus Keywords */}
              <div className="space-y-2">
                <Label>Focus Keywords (Optional)</Label>
                <Input
                  placeholder="sale, discount, limited time, etc."
                  value={focusKeywords}
                  onChange={(e) => setFocusKeywords(e.target.value)}
                />
              </div>

              {/* Additional Content & Instructions */}
              <div className="space-y-2">
                <Label>Additional Content & Instructions</Label>
                <Textarea
                  placeholder="Provide any specific details, desired content length, tone adjustments, special offers, or other context that will help the AI create better content for your campaign..."
                  value={additionalInstructions}
                  onChange={(e) => setAdditionalInstructions(e.target.value)}
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  The AI will incorporate all this additional context along with your business profile and customer data to create highly personalized content.
                </p>
              </div>

              <Button 
                onClick={generateContent}
                disabled={isGenerating || !callToActionGoal || !additionalInstructions}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                    Generating AI Content...
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
                  3 unique variations created using advanced AI with your business intelligence
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
                  Configure your content settings and click "Generate AI Content" to create personalized marketing content using advanced AI with your business intelligence.
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