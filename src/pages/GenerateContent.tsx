import { useState, useEffect } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles, Copy, Calendar as CalendarIcon, Users, Wand2, Check, Edit, Save, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// Types
interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  purchase_history: string;
  segment: string;
  segment_reason: string;
  total_spent: number;
  last_purchase_date: string;
}

interface BusinessProfile {
  id: string;
  business_name: string;
  business_category: string;
  location: string;
  business_email: string;
  brand_voice: string;
  business_bio: string;
  products_services: string;
  services_menu_files?: string[];
}

interface ContentVariation {
  text: string;
  image_prompts: string[];
  video_ideas: string[];
  further_suggestions: string[];
}

interface GeneratedContent {
  content_variations: ContentVariation[];
}

interface DirectMessage {
  customer: Customer;
  messageText: string;
}

// Mock data for demonstration
const mockBusinessProfile: BusinessProfile = {
  id: "1",
  business_name: "Cozy Corner Cafe",
  business_category: "Restaurant",
  location: "Seattle, WA",
  business_email: "hello@cozycornercafe.com",
  brand_voice: "Friendly",
  business_bio: "A warm neighborhood cafe serving artisanal coffee and fresh pastries since 2018.",
  products_services: "Specialty coffee drinks, fresh pastries, sandwiches, salads, local merchandise",
  services_menu_files: ["menu.pdf", "specials.jpg"]
};

const mockCustomers: Customer[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah@email.com",
    phone: "+1234567890",
    purchase_history: "Regular latte, blueberry muffin, seasonal drinks",
    segment: "vip_customer",
    segment_reason: "High spending and frequent visits",
    total_spent: 450.50,
    last_purchase_date: "2024-01-15"
  },
  {
    id: "2",
    name: "Mike Chen", 
    email: "mike@email.com",
    purchase_history: "Americano, croissant",
    segment: "inactive_customer",
    segment_reason: "No purchases in 90+ days",
    total_spent: 85.20,
    last_purchase_date: "2023-10-15"
  },
  {
    id: "3",
    name: "Emma Davis",
    email: "emma@email.com", 
    phone: "+1234567891",
    purchase_history: "Cappuccino, pastries, coffee beans",
    segment: "new_customer",
    segment_reason: "Recent first-time customer",
    total_spent: 125.00,
    last_purchase_date: "2024-01-20"
  },
  {
    id: "4",
    name: "Alex Rodriguez",
    email: "alex@email.com",
    purchase_history: "Espresso, latte, catering orders",
    segment: "vip_customer", 
    segment_reason: "High value orders and frequent visits",
    total_spent: 890.25,
    last_purchase_date: "2024-01-18"
  },
  {
    id: "5",
    name: "Jessica Wong",
    email: "jessica@email.com",
    phone: "+1234567892",
    purchase_history: "Tea, sandwiches, loyalty program member",
    segment: "returning_customer",
    segment_reason: "Regular customer with consistent visits",
    total_spent: 275.50,
    last_purchase_date: "2024-01-16"
  }
];

// Image Prompt Component
const ImagePrompt = ({ prompt, index }: { prompt: string; index: number }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    setIsGenerating(true);
    // Simulate image generation
    setTimeout(() => {
      setGeneratedImage("https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=300&fit=crop");
      setIsGenerating(false);
      toast({
        title: "Image generated!",
        description: "Your AI-generated image is ready."
      });
    }, 2000);
  };

  const copyPrompt = () => {
    navigator.clipboard.writeText(prompt);
    toast({
      title: "Copied!",
      description: "Image prompt copied to clipboard."
    });
  };

  return (
    <div className="p-3 border rounded-lg space-y-3">
      <p className="text-sm">{prompt}</p>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={copyPrompt}>
          <Copy className="w-4 h-4 mr-1" />
          Copy
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleGenerate}
          disabled={isGenerating}
        >
          <Sparkles className={cn("w-4 h-4 mr-1", isGenerating && "animate-spin")} />
          {isGenerating ? "Generating..." : "Generate"}
        </Button>
      </div>
      {generatedImage && (
        <div className="mt-3">
          <img 
            src={generatedImage} 
            alt="Generated content" 
            className="w-full h-48 object-cover rounded-lg"
          />
        </div>
      )}
    </div>
  );
};

// Content Preview Component
const ContentPreview = ({ 
  generatedContent, 
  onSaveCampaign 
}: { 
  generatedContent: GeneratedContent;
  onSaveCampaign: (text: string, date: Date) => void;
}) => {
  const [editingStates, setEditingStates] = useState<boolean[]>([false, false, false]);
  const [editedTexts, setEditedTexts] = useState<string[]>([]);
  const [scheduledDate, setScheduledDate] = useState<Date>();
  const { toast } = useToast();

  useEffect(() => {
    if (generatedContent) {
      setEditedTexts(generatedContent.content_variations.map(v => v.text));
    }
  }, [generatedContent]);

  const toggleEdit = (index: number) => {
    const newStates = [...editingStates];
    newStates[index] = !newStates[index];
    setEditingStates(newStates);
  };

  const saveEdit = (index: number, newText: string) => {
    const newTexts = [...editedTexts];
    newTexts[index] = newText;
    setEditedTexts(newTexts);
    toggleEdit(index);
  };

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Content copied to clipboard."
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generated Content Variations</CardTitle>
        <CardDescription>Choose your favorite variation or mix and match elements</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="0" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="0">Variation 1</TabsTrigger>
            <TabsTrigger value="1">Variation 2</TabsTrigger>
            <TabsTrigger value="2">Variation 3</TabsTrigger>
          </TabsList>
          
          {generatedContent.content_variations.map((variation, index) => (
            <TabsContent key={index} value={index.toString()} className="space-y-6 mt-6">
              {/* Content Text Block */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium">Generated Text</Label>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => copyText(editedTexts[index] || variation.text)}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => toggleEdit(index)}
                    >
                      {editingStates[index] ? <Save className="w-4 h-4 mr-2" /> : <Edit className="w-4 h-4 mr-2" />}
                      {editingStates[index] ? "Save" : "Edit"}
                    </Button>
                  </div>
                </div>
                
                {editingStates[index] ? (
                  <Textarea
                    value={editedTexts[index] || variation.text}
                    onChange={(e) => {
                      const newTexts = [...editedTexts];
                      newTexts[index] = e.target.value;
                      setEditedTexts(newTexts);
                    }}
                    rows={6}
                    className="resize-none"
                  />
                ) : (
                  <div className="p-4 border rounded-lg bg-muted/50">
                    <p className="whitespace-pre-line">{editedTexts[index] || variation.text}</p>
                  </div>
                )}
              </div>

              {/* Image Suggestions */}
              <div className="space-y-3">
                <Label className="text-base font-medium">Image Suggestions</Label>
                <div className="space-y-3">
                  {variation.image_prompts.map((prompt, promptIndex) => (
                    <ImagePrompt key={promptIndex} prompt={prompt} index={promptIndex} />
                  ))}
                </div>
              </div>

              {/* Video Ideas */}
              <div className="space-y-3">
                <Label className="text-base font-medium">Video Ideas</Label>
                <div className="space-y-2">
                  {variation.video_ideas.map((idea, ideaIndex) => (
                    <div key={ideaIndex} className="p-3 border rounded-lg">
                      <p className="text-sm">{idea}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Further Suggestions */}
              <div className="space-y-3">
                <Label className="text-base font-medium">Further Suggestions</Label>
                <div className="space-y-2">
                  {variation.further_suggestions.map((suggestion, suggestionIndex) => (
                    <div key={suggestionIndex} className="p-3 border rounded-lg">
                      <p className="text-sm">{suggestion}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Bar */}
              <div className="flex items-center gap-4 pt-4 border-t">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-auto justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {scheduledDate ? format(scheduledDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={scheduledDate}
                      onSelect={setScheduledDate}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                
                <Button 
                  onClick={() => scheduledDate && onSaveCampaign(editedTexts[index] || variation.text, scheduledDate)}
                  disabled={!scheduledDate}
                >
                  Save as Campaign
                </Button>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

// Main Component
const GenerateContent = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { toast } = useToast();
  
  // Core State Variables
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingDirect, setIsGeneratingDirect] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [directMessageContent, setDirectMessageContent] = useState<DirectMessage[]>([]);
  const [error, setError] = useState<string>("");
  const [generationStatus, setGenerationStatus] = useState<string | null>(null);
  const [copiedStatus, setCopiedStatus] = useState<Record<string, boolean>>({});

  // Form Data State
  const [formData, setFormData] = useState({
    campaign_type: "general",
    platform: "social_media",
    focus_keywords: "",
    seasonal_theme: "",
    custom_prompt: "",
    call_to_action_goal: "",
    target_keyword: "",
    target_segment: ""
  });

  const [targetingMode, setTargetingMode] = useState<'keyword' | 'segment'>('keyword');
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  
  // Mock data states
  const [businessProfile] = useState<BusinessProfile>(mockBusinessProfile);
  const [customers] = useState<Customer[]>(mockCustomers);

  // URL Parameter Handling
  useEffect(() => {
    const magic = searchParams.get("magic");
    const reactivation = searchParams.get("reactivation");
    
    if (magic === "true") {
      console.log("Magic mode activated");
      setFormData(prev => ({
        ...prev,
        custom_prompt: "Create a surprise marketing campaign that I haven't thought of - something creative and unique for my business!"
      }));
    } else if (reactivation === "true") {
      setFormData(prev => ({
        ...prev,
        campaign_type: 'personalized',
        platform: 'direct_to_customer',
        call_to_action_goal: 'win_back',
        target_segment: 'inactive_customer'
      }));
    }
    
    if (location.state?.suggestion) {
      setFormData(prev => ({
        ...prev,
        custom_prompt: location.state.suggestion
      }));
    }
  }, [searchParams, location.state]);

  // Initial data loading
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      // Simulate data loading
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    };
    loadData();
  }, []);

  // Live Customer Filtering
  useEffect(() => {
    if (formData.campaign_type === 'personalized') {
      let filtered = [];
      
      if (targetingMode === 'keyword' && formData.target_keyword.trim()) {
        filtered = customers.filter(customer => 
          customer.purchase_history.toLowerCase().includes(formData.target_keyword.toLowerCase())
        );
      } else if (targetingMode === 'segment' && formData.target_segment) {
        filtered = customers.filter(customer => 
          customer.segment === formData.target_segment
        );
      }
      
      setFilteredCustomers(filtered);
    } else {
      setFilteredCustomers([]);
    }
  }, [formData.target_keyword, formData.target_segment, targetingMode, customers, formData.campaign_type]);

  // AI Prompt Construction
  const createAIPrompt = (targetCustomer?: Customer, targetSegment?: string): string => {
    let prompt = `You are an expert marketing content creator named PromoPal.\n\n`;
    
    // Business Profile Injection
    prompt += `BUSINESS PROFILE:\n`;
    prompt += `Name: ${businessProfile.business_name}\n`;
    prompt += `Category: ${businessProfile.business_category}\n`;
    prompt += `Location: ${businessProfile.location}\n`;
    prompt += `Brand Voice: ${businessProfile.brand_voice} (interpret this tone throughout all content)\n`;
    prompt += `Business Bio: ${businessProfile.business_bio}\n`;
    prompt += `Products/Services/Menu: ${businessProfile.products_services}\n`;
    
    if (businessProfile.services_menu_files?.length) {
      prompt += `Additional Product/Service Documents: Available for reference\n`;
    }
    
    prompt += `\nCAMPAIGN REQUIREMENTS:\n`;
    prompt += `Platform: ${formData.platform}\n`;
    prompt += `Campaign Type: ${formData.campaign_type}\n`;
    
    if (formData.seasonal_theme) {
      prompt += `Theme: ${formData.seasonal_theme}\n`;
    }
    
    if (formData.focus_keywords) {
      prompt += `Focus Keywords: ${formData.focus_keywords}\n`;
    }
    
    if (formData.call_to_action_goal) {
      prompt += `CTA Goal: ${formData.call_to_action_goal}\n`;
    }
    
    if (formData.custom_prompt) {
      prompt += `Special Instructions/Additional Context: ${formData.custom_prompt}\n`;
    }

    // Conditional Prompting Logic
    if (targetCustomer) {
      // Scenario 1: Personalized, Per-Customer Message
      prompt += `\nPERSONALIZATION DETAILS:\n`;
      prompt += `Customer Name: ${targetCustomer.name}\n`;
      prompt += `Email: ${targetCustomer.email}\n`;
      if (targetCustomer.phone) prompt += `Phone: ${targetCustomer.phone}\n`;
      prompt += `Purchase History: ${targetCustomer.purchase_history}\n`;
      prompt += `Segment: ${targetCustomer.segment}\n`;
      prompt += `Segment Reason: ${targetCustomer.segment_reason}\n`;
      prompt += `Total Spent: $${targetCustomer.total_spent}\n`;
      prompt += `Last Purchase: ${targetCustomer.last_purchase_date}\n`;
      
      prompt += `\nTASK: Write a compelling personalized message from ${businessProfile.business_name} to ${targetCustomer.name}. Use their specific purchase history and segment characteristics to create highly relevant content. The response should be only the message content.`;
    } else if (targetSegment) {
      // Scenario 2: Personalized, Segment-Based Message
      prompt += `\nTARGET SEGMENT: ${targetSegment}\n`;
      prompt += `\nTASK: Write a compelling marketing message to customers in the '${targetSegment}' segment. Address the segment's specific characteristics. **Use {{name}} as a placeholder for customer names.** The response must be only the message content.`;
    } else {
      // Scenario 3: General Marketing Content
      prompt += `\nTASK: Generate 3 distinct variations of marketing content. Respond in this exact JSON format:\n`;
      prompt += `{
  "content_variations": [
    {
      "text": "...",
      "image_prompts": ["...", "...", "..."],
      "video_ideas": ["...", "..."],
      "further_suggestions": ["...", "..."]
    }
  ]
}`;
    }
    
    return prompt;
  };

  // Smart InvokeLLM function that uses actual prompt data
  const InvokeLLM = async (prompt: string, responseJsonSchema?: any): Promise<any> => {
    // Simulate API delay with randomness for uniqueness
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));
    
    if (responseJsonSchema) {
      // Generate unique content based on actual business profile and form data
      const variations = [];
      const currentTime = new Date().getTime();
      
      // Create themes based on business data and form inputs
      const baseThemes = [
        {
          focus: formData.focus_keywords || "community",
          tone: businessProfile.brand_voice || "friendly",
          cta: formData.call_to_action_goal || "engagement"
        },
        {
          focus: formData.seasonal_theme || "quality",
          tone: businessProfile.brand_voice === "professional" ? "premium" : "welcoming",
          cta: "product showcase"
        },
        {
          focus: "experience",
          tone: "storytelling",
          cta: formData.call_to_action_goal || "customer connection"
        }
      ];

      for (let i = 0; i < 3; i++) {
        const theme = baseThemes[i];
        const uniqueId = `${currentTime}-${i}`;
        const seasonalContext = formData.seasonal_theme ? ` with ${formData.seasonal_theme} elements` : '';
        const keywordsContext = formData.focus_keywords ? ` highlighting ${formData.focus_keywords}` : '';
        const locationContext = businessProfile.location ? ` in ${businessProfile.location}` : '';
        
        // Create unique content based on actual business data
        let contentText = `✨ ${theme.focus.charAt(0).toUpperCase() + theme.focus.slice(1)} at ${businessProfile.business_name}! \n\n`;
        
        if (businessProfile.business_bio) {
          contentText += `${businessProfile.business_bio}${seasonalContext}${keywordsContext}\n\n`;
        }
        
        if (formData.call_to_action_goal === 'promotion') {
          contentText += `🎉 Special offer for our valued customers${locationContext}!\n\n`;
        } else if (formData.call_to_action_goal === 'engagement') {
          contentText += `Join our community${locationContext} and be part of something special!\n\n`;
        }
        
        contentText += `📍 ${businessProfile.location || 'Visit us today'} | Experience the ${businessProfile.brand_voice || 'amazing'} difference!\n`;
        contentText += `#${businessProfile.business_name.replace(/\s+/g, '')} #${businessProfile.business_category || 'Business'} #${businessProfile.location?.replace(/\s+/g, '') || 'Local'}`;
        
        variations.push({
          text: contentText,
          image_prompts: [
            `Professional ${businessProfile.business_category || 'business'} photography showing ${businessProfile.products_services || 'services'}, ${theme.tone} atmosphere, ${businessProfile.location || 'modern'} setting${seasonalContext}`,
            `${businessProfile.brand_voice || 'welcoming'} styled interior of ${businessProfile.business_name}, customers enjoying ${businessProfile.products_services || 'the experience'}, warm natural lighting`,
            `Close-up product shot of signature items from ${businessProfile.business_name}, premium quality, appealing presentation${seasonalContext}`
          ],
          video_ideas: [
            `Behind-the-scenes at ${businessProfile.business_name}: ${theme.focus} in action`,
            `Customer testimonial showcasing the ${businessProfile.brand_voice || 'excellent'} experience at ${businessProfile.business_name}`
          ],
          further_suggestions: [
            `Create a ${theme.focus}-focused program for ${businessProfile.business_name} customers`,
            `Partner with local ${businessProfile.location || 'area'} businesses for cross-promotion${seasonalContext ? ` during ${formData.seasonal_theme}` : ''}`
          ]
        });
      }
      
      return { content_variations: variations };
    } else {
      // Return personalized message based on actual customer data and business profile
      const customerName = prompt.match(/Customer Name: ([^\n]+)/)?.[1] || "Valued Customer";
      const purchaseHistory = prompt.match(/Purchase History: ([^\n]+)/)?.[1] || "your favorite items";
      const segment = prompt.match(/Segment: ([^\n]+)/)?.[1] || "customer";
      const totalSpent = prompt.match(/Total Spent: \$([^\n]+)/)?.[1] || "0";
      
      // Generate smart personalized content based on segment and purchase data
      if (segment.includes("new")) {
        return `Welcome to ${businessProfile.business_name}, ${customerName}! 🌟 We're thrilled to have you join our ${businessProfile.location || 'local'} community. Based on your interest in ${purchaseHistory}, we think you'll love our ${businessProfile.products_services || 'offerings'}. As a special welcome, enjoy 20% off your next visit when you mention this message. We can't wait to create your perfect ${businessProfile.business_category || 'experience'}!`;
      } else if (segment.includes("vip")) {
        return `Dear ${customerName}, 💎 Your loyalty to ${businessProfile.business_name} means everything to us! With your impressive history of ${purchaseHistory} and $${totalSpent} in purchases, we know you appreciate quality. As our VIP customer, you get exclusive early access to our new premium selections launching next week. Plus, enjoy complimentary upgrades all month. Thank you for being such an important part of our ${businessProfile.location || ''} story!`;
      } else if (segment.includes("returning")) {
        return `Hi ${customerName}! 👋 We love seeing you regularly at ${businessProfile.business_name}. Your consistent orders of ${purchaseHistory} show excellent taste! This week, we're featuring new items that perfectly complement your favorites from our ${businessProfile.products_services || 'menu'}. Come try them with 25% off - we're excited to expand your ${businessProfile.business_category || 'experience'} horizons!`;
      } else if (segment.includes("at-risk")) {
        return `We miss you, ${customerName}! 💝 It's been a while since your last visit to ${businessProfile.business_name}${businessProfile.location ? ` in ${businessProfile.location}` : ''}. We remember how much you enjoyed ${purchaseHistory} and we'd love to welcome you back. Here's 30% off your return visit - plus we have exciting new additions to our ${businessProfile.products_services || 'menu'} that we think you'll love based on your past preferences. Hope to see you soon!`;
      } else {
        return `Hi ${customerName}! Thanks for being part of the ${businessProfile.business_name} family${businessProfile.location ? ` here in ${businessProfile.location}` : ''}. Based on your preference for ${purchaseHistory}, we've prepared something special just for you. Visit us this week for a personalized ${businessProfile.business_category || 'experience'} that celebrates your unique taste and our ${businessProfile.brand_voice || 'exceptional'} ${businessProfile.products_services || 'service'}!`;
      }
    }
  };

  // Content Generation Flow
  const generateContent = async () => {
    if (!businessProfile) {
      setError("Business profile is required for content generation.");
      return;
    }

    setError("");
    setGeneratedContent(null);
    setDirectMessageContent([]);

    try {
      if (formData.platform === 'direct_to_customer') {
        setIsGeneratingDirect(true);
        
        if (targetingMode === 'keyword') {
          // Sub-branch 1: Individual customer messages
          const messages: DirectMessage[] = [];
          for (const customer of filteredCustomers) {
            const prompt = createAIPrompt(customer);
            const response = await InvokeLLM(prompt);
            messages.push({ customer, messageText: response });
          }
          setDirectMessageContent(messages);
        } else {
          // Sub-branch 2: Template-based messages
          const prompt = createAIPrompt(undefined, formData.target_segment);
          const template = await InvokeLLM(prompt);
          
          const messages: DirectMessage[] = filteredCustomers.map(customer => ({
            customer,
            messageText: template.replace(/\{\{name\}\}/g, customer.name.split(' ')[0])
          }));
          setDirectMessageContent(messages);
        }
      } else {
        // General Marketing
        setIsGenerating(true);
        const prompt = createAIPrompt();
        const responseJsonSchema = { /* schema object */ };
        const response = await InvokeLLM(prompt, responseJsonSchema);
        setGeneratedContent(response);
      }
      
      setGenerationStatus('Generated');
      toast({
        title: "Content generated successfully!",
        description: "Your AI-powered marketing content is ready to review."
      });
    } catch (err) {
      setError("Failed to generate content. Please try again.");
      console.error(err);
    } finally {
      setIsGenerating(false);
      setIsGeneratingDirect(false);
    }
  };

  // Save Campaign Function
  const saveCampaign = async (text: string, date: Date) => {
    setIsSaving(true);
    try {
      // Create campaign object
      const newCampaign = {
        id: `campaign-${Date.now()}`,
        title: text.split('\n')[0].replace(/[^\w\s]/gi, '').trim().substring(0, 50) || 'Generated Campaign',
        content: text,
        platform: formData.platform === 'social_media' ? 'Social Media' : formData.platform === 'email' ? 'Email' : 'Direct Message',
        status: 'scheduled' as const,
        date: date
      };
      
      // Save to localStorage for MarketingCalendar to access
      const existingCampaigns = JSON.parse(localStorage.getItem('savedCampaigns') || '[]');
      existingCampaigns.push(newCampaign);
      localStorage.setItem('savedCampaigns', JSON.stringify(existingCampaigns));
      
      // Simulate saving delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Campaign saved!",
        description: `Campaign scheduled for ${format(date, "PPP")}.`
      });
      setGenerationStatus('Saved');
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to save campaign.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Copy functions
  const copyForEmail = (customerId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStatus(prev => ({ ...prev, [customerId]: true }));
    setTimeout(() => {
      setCopiedStatus(prev => ({ ...prev, [customerId]: false }));
    }, 2000);
    toast({
      title: "Copied for email!",
      description: "Message copied to clipboard."
    });
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
        <div className="space-y-6">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
      {/* Left Column - Settings */}
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-brand-purple" />
            AI Content Generation
          </h1>
          <p className="text-muted-foreground mt-2">
            Create compelling marketing content powered by AI. Choose your campaign type and let our AI craft personalized content using your complete business profile and customer insights.
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-purple" />
              Content Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Campaign Type */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Campaign Type</Label>
              <RadioGroup 
                value={formData.campaign_type} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, campaign_type: value }))}
              >
                <div className="flex items-start space-x-3 p-3 border rounded-lg">
                  <RadioGroupItem value="general" id="general" className="mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="general" className="font-medium">General Marketing</Label>
                      <Badge variant="secondary" className="text-xs">AI Powered</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Broad content for all audiences</p>
                  </div>
                </div>
                
                <div className={cn(
                  "flex items-start space-x-3 p-3 border rounded-lg",
                  customers.length === 0 && "opacity-50"
                )}>
                  <RadioGroupItem 
                    value="personalized" 
                    id="personalized" 
                    className="mt-1"
                    disabled={customers.length === 0}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="personalized" className="font-medium">Personalized Marketing</Label>
                      <Badge variant="secondary" className="text-xs">AI Powered</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Targeted content for specific customers</p>
                    {customers.length === 0 && (
                      <p className="text-xs text-destructive mt-1">Upload customer data first</p>
                    )}
                  </div>
                </div>
              </RadioGroup>
            </div>

            {/* Platform Type */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Platform Type</Label>
              <RadioGroup 
                value={formData.platform} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, platform: value }))}
              >
                {formData.campaign_type === "personalized" ? (
                  <div className="flex items-start space-x-3 p-3 border rounded-lg">
                    <RadioGroupItem value="direct_to_customer" id="direct" className="mt-1" />
                    <div>
                      <Label htmlFor="direct" className="font-medium">Direct to Customer</Label>
                      <p className="text-sm text-muted-foreground">Personalized Email or Text Messages</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start space-x-3 p-3 border rounded-lg">
                      <RadioGroupItem value="social_media" id="social" className="mt-1" />
                      <div>
                        <Label htmlFor="social" className="font-medium">Social Media Post</Label>
                        <p className="text-sm text-muted-foreground">Facebook, Instagram, Twitter, etc.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3 p-3 border rounded-lg">
                      <RadioGroupItem value="email_campaign" id="email" className="mt-1" />
                      <div>
                        <Label htmlFor="email" className="font-medium">Email Campaign</Label>
                        <p className="text-sm text-muted-foreground">Newsletter or promotional email</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3 p-3 border rounded-lg">
                      <RadioGroupItem value="local_ad" id="local" className="mt-1" />
                      <div>
                        <Label htmlFor="local" className="font-medium">Local Advertisement</Label>
                        <p className="text-sm text-muted-foreground">Google Ads, local listings, print media</p>
                      </div>
                    </div>
                  </>
                )}
              </RadioGroup>
            </div>

            {/* Target Audience Section */}
            {formData.campaign_type === "personalized" && (
              <div className="space-y-4 p-4 bg-brand-accent rounded-lg border border-brand-purple/20">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-brand-purple" />
                  <Label className="text-base font-medium">Target Audience</Label>
                </div>
                
                <RadioGroup value={targetingMode} onValueChange={(value) => setTargetingMode(value as 'keyword' | 'segment')}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="keyword" id="keyword" />
                    <Label htmlFor="keyword">Target by Keyword in Purchase History</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="segment" id="segment" />
                    <Label htmlFor="segment">Target by Segment</Label>
                  </div>
                </RadioGroup>

                {targetingMode === "keyword" && (
                  <div className="space-y-2">
                    <Input
                      placeholder="e.g., coffee, latte, muffin"
                      value={formData.target_keyword}
                      onChange={(e) => setFormData(prev => ({ ...prev, target_keyword: e.target.value }))}
                    />
                    <p className="text-sm text-muted-foreground">
                      Enter a keyword to find in customer purchase history.
                    </p>
                  </div>
                )}

                {targetingMode === "segment" && (
                  <Select 
                    value={formData.target_segment} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, target_segment: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a segment to target" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new_customer">New Customers</SelectItem>
                      <SelectItem value="returning_customer">Returning Customers</SelectItem>
                      <SelectItem value="vip_customer">VIP Customers</SelectItem>
                      <SelectItem value="inactive_customer">Inactive Customers</SelectItem>
                      <SelectItem value="high_spender">High Spenders</SelectItem>
                      <SelectItem value="low_engagement">Low Engagement</SelectItem>
                      <SelectItem value="upsell_opportunity">Upsell Opportunities</SelectItem>
                    </SelectContent>
                  </Select>
                )}

                <p className="text-sm text-brand-purple font-medium">
                  {filteredCustomers.length} customer(s) found matching your criteria
                </p>
              </div>
            )}

            {/* Additional Settings */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cta">Call-to-Action Goal (Optional)</Label>
                <Select 
                  value={formData.call_to_action_goal} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, call_to_action_goal: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a campaign goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="visit">Drive Store Visits</SelectItem>
                    <SelectItem value="purchase">Increase Sales</SelectItem>
                    <SelectItem value="engagement">Boost Engagement</SelectItem>
                    <SelectItem value="awareness">Build Brand Awareness</SelectItem>
                    <SelectItem value="loyalty">Strengthen Customer Loyalty</SelectItem>
                    <SelectItem value="win_back">Win Back Customers</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="seasonal">Seasonal Theme (Optional)</Label>
                <Select 
                  value={formData.seasonal_theme} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, seasonal_theme: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a seasonal theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="summer">Summer</SelectItem>
                    <SelectItem value="fall">Fall/Autumn</SelectItem>
                    <SelectItem value="winter">Winter</SelectItem>
                    <SelectItem value="spring">Spring</SelectItem>
                    <SelectItem value="holidays">Winter Holidays</SelectItem>
                    <SelectItem value="valentines">Valentine's Day</SelectItem>
                    <SelectItem value="mothers_day">Mother's Day</SelectItem>
                    <SelectItem value="back_to_school">Back to School</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="keywords">Focus Keywords (Optional)</Label>
                <Input
                  id="keywords"
                  placeholder="sale, discount, limited time, etc."
                  value={formData.focus_keywords}
                  onChange={(e) => setFormData(prev => ({ ...prev, focus_keywords: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="instructions">Additional Context & Instructions</Label>
                <Textarea
                  id="instructions"
                  placeholder="Provide any specific details, desired content length, tone adjustments, special offers, or other context that will help the AI create better content for your campaign..."
                  value={formData.custom_prompt}
                  onChange={(e) => setFormData(prev => ({ ...prev, custom_prompt: e.target.value }))}
                  rows={4}
                />
                <p className="text-sm text-muted-foreground">
                  The AI will incorporate all this additional context along with your business profile and customer data to create highly personalized content.
                </p>
              </div>
            </div>

            <Button 
              onClick={generateContent}
              disabled={isGenerating || isGeneratingDirect || (formData.campaign_type === 'personalized' && filteredCustomers.length === 0)}
              className="w-full"
              size="lg"
            >
              {isGenerating || isGeneratingDirect ? (
                <>
                  <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                  Generating... Please wait
                </>
              ) : generationStatus === 'Generated' ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Content Generated!
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 mr-2" />
                  Generate AI Content
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Right Column - Results */}
      <div className="space-y-6">
        {(isGenerating || isGeneratingDirect) && (
          <Card>
            <CardContent className="p-12 text-center">
              <Sparkles className="w-16 h-16 text-brand-purple mx-auto mb-4 animate-pulse" />
              <h3 className="text-xl font-semibold mb-2">Generating brilliant marketing ideas...</h3>
              <p className="text-muted-foreground">Our AI is crafting personalized content based on your business profile and preferences.</p>
            </CardContent>
          </Card>
        )}

        {!isGenerating && !isGeneratingDirect && !generatedContent && directMessageContent.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Wand2 className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-muted-foreground">Ready to Create Amazing Content?</h3>
              <p className="text-muted-foreground">Configure your settings and click "Generate AI Content" to get started.</p>
            </CardContent>
          </Card>
        )}

        {generatedContent && formData.campaign_type === "general" && (
          <ContentPreview 
            generatedContent={generatedContent}
            onSaveCampaign={saveCampaign}
          />
        )}

        {directMessageContent.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Personalized Customer Messages</CardTitle>
              <CardDescription>Review and send individual messages to your targeted customers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {directMessageContent.map(({ customer, messageText }, index) => (
                  <div key={customer.id} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{customer.name}</h4>
                        <p className="text-sm text-muted-foreground">{customer.email}</p>
                      </div>
                      <Badge variant="outline">{customer.segment.replace('_', ' ')}</Badge>
                    </div>
                    
                    <div className="p-3 bg-muted/50 rounded border">
                      <p className="text-sm whitespace-pre-line">{messageText}</p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => copyForEmail(customer.id, messageText)}
                      >
                        {copiedStatus[customer.id] ? (
                          <Check className="w-4 h-4 mr-2" />
                        ) : (
                          <Copy className="w-4 h-4 mr-2" />
                        )}
                        {copiedStatus[customer.id] ? "Copied!" : "Copy for Email"}
                      </Button>
                      {customer.phone && (
                        <Button variant="outline" size="sm">
                          Send Text
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default GenerateContent;