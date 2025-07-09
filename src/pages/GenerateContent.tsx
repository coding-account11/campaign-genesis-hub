import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Copy, Calendar, Users, Eye, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const GenerateContent = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  const [campaignType, setCampaignType] = useState("general");
  const [platformType, setPlatformType] = useState("social");
  const [targetingMode, setTargetingMode] = useState("keyword");
  const [targetingValue, setTargetingValue] = useState("");
  const [callToAction, setCallToAction] = useState("");
  const [seasonalTheme, setSeasonalTheme] = useState("");
  const [focusKeywords, setFocusKeywords] = useState("");
  const [additionalInstructions, setAdditionalInstructions] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [matchingCustomers, setMatchingCustomers] = useState(5);

  // Handle URL parameters for special modes
  useEffect(() => {
    const magic = searchParams.get("magic");
    const reactivation = searchParams.get("reactivation");
    const idea = searchParams.get("idea");

    if (magic === "true") {
      setAdditionalInstructions("Create a surprise marketing campaign that I haven't thought of - something creative and unique for my business!");
    } else if (reactivation === "true") {
      setCampaignType("personalized");
      setPlatformType("email");
      setTargetingMode("segment");
      setTargetingValue("inactive");
      setAdditionalInstructions("Create a win-back email campaign to re-engage customers who haven't made a purchase in 60+ days. Focus on bringing them back with special offers or updates.");
    } else if (idea) {
      setAdditionalInstructions(`Create content based on this idea: ${idea}`);
    }
  }, [searchParams]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    // Simulate AI generation
    setTimeout(() => {
      const mockContent = {
        variations: [
          {
            text: "☕ Start your week right with our Monday Morning Special! \n\nGet 20% off your favorite latte when you visit us before 10 AM. Our freshly roasted beans and handcrafted drinks are the perfect way to fuel your week ahead.\n\n#MondayMotivation #CoffeeLovers #CozyCornerCafe",
            imagePrompts: [
              "A steaming latte with beautiful latte art on a rustic wooden table, morning sunlight streaming through a cafe window",
              "Close-up of coffee beans being poured into a vintage coffee roaster, warm lighting",
              "Cozy cafe interior with customers enjoying morning coffee, soft natural lighting"
            ],
            videoIdeas: [
              "Time-lapse of a barista creating latte art",
              "Behind-the-scenes of morning coffee preparation"
            ],
            suggestions: [
              "Share customer testimonials about their favorite Monday drinks",
              "Create a loyalty program for early morning customers"
            ]
          },
          {
            text: "🌟 New Week, New Flavors! \n\nIntroducing our limited-time Autumn Spice Latte - a perfect blend of cinnamon, nutmeg, and our signature espresso. Available only this month at Cozy Corner Cafe.\n\nTreat yourself to something special. You deserve it!\n\n#NewFlavor #AutumnVibes #SpecialtyDrinks",
            imagePrompts: [
              "Autumn spice latte with cinnamon stick garnish, fall leaves in background",
              "Ingredients laid out artistically - cinnamon sticks, nutmeg, coffee beans",
              "Barista preparing the special autumn drink with steaming milk"
            ],
            videoIdeas: [
              "Recipe reveal showing the special spice blend",
              "Customer reactions when trying the new flavor"
            ],
            suggestions: [
              "Create a seasonal menu board highlighting fall flavors",
              "Partner with local spice suppliers for authentic ingredients"
            ]
          },
          {
            text: "💫 Monday = Motivation Monday at Cozy Corner! \n\nStart your week with intention. Grab your favorite coffee and take a moment to set your weekly goals. We're here to fuel your ambitions with the perfect cup.\n\nWhat's one goal you're excited to work on this week? Share in the comments! ⬇️\n\n#MotivationMonday #WeeklyGoals #CommunityLove",
            imagePrompts: [
              "Person writing in a journal with coffee cup nearby, inspiring workspace setup",
              "Motivational quote written on a chalkboard with coffee shop ambiance",
              "Coffee cup with steam forming inspirational shapes in the air"
            ],
            videoIdeas: [
              "Quick tips for setting weekly goals over coffee",
              "Local entrepreneurs sharing their Monday motivation"
            ],
            suggestions: [
              "Host weekly goal-setting meetups at your cafe",
              "Create branded notebooks for customers who want to journal"
            ]
          }
        ]
      };

      setGeneratedContent(mockContent);
      setIsGenerating(false);
      
      toast({
        title: "Content generated successfully!",
        description: "Your AI-powered marketing content is ready to review."
      });
    }, 3000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Content has been copied to your clipboard."
    });
  };

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
              <RadioGroup value={campaignType} onValueChange={setCampaignType}>
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
                
                <div className="flex items-start space-x-3 p-3 border rounded-lg">
                  <RadioGroupItem value="personalized" id="personalized" className="mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="personalized" className="font-medium">Personalized Marketing</Label>
                      <Badge variant="secondary" className="text-xs">AI Powered</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Targeted content for specific customers</p>
                  </div>
                </div>
              </RadioGroup>
            </div>

            {/* Platform Type */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Platform Type</Label>
              <RadioGroup value={platformType} onValueChange={setPlatformType}>
                {campaignType === "personalized" ? (
                  <div className="flex items-start space-x-3 p-3 border rounded-lg">
                    <RadioGroupItem value="direct" id="direct" className="mt-1" />
                    <div>
                      <Label htmlFor="direct" className="font-medium">Direct to Customer</Label>
                      <p className="text-sm text-muted-foreground">Personalized Email or Text Messages</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start space-x-3 p-3 border rounded-lg">
                      <RadioGroupItem value="social" id="social" className="mt-1" />
                      <div>
                        <Label htmlFor="social" className="font-medium">Social Media Post</Label>
                        <p className="text-sm text-muted-foreground">Facebook, Instagram, Twitter, etc.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3 p-3 border rounded-lg">
                      <RadioGroupItem value="email" id="email" className="mt-1" />
                      <div>
                        <Label htmlFor="email" className="font-medium">Email Campaign</Label>
                        <p className="text-sm text-muted-foreground">Newsletter or promotional email</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3 p-3 border rounded-lg">
                      <RadioGroupItem value="local" id="local" className="mt-1" />
                      <div>
                        <Label htmlFor="local" className="font-medium">Local Advertisement</Label>
                        <p className="text-sm text-muted-foreground">Google Ads, local listings, print media</p>
                      </div>
                    </div>
                  </>
                )}
              </RadioGroup>
            </div>

            {/* Personalization Section */}
            {campaignType === "personalized" && (
              <div className="space-y-4 p-4 bg-brand-accent rounded-lg border border-brand-purple/20">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-brand-purple" />
                  <Label className="text-base font-medium">Target Audience</Label>
                </div>
                
                <RadioGroup value={targetingMode} onValueChange={setTargetingMode}>
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
                      placeholder="e.g., coffee, new shoes, VIP"
                      value={targetingValue}
                      onChange={(e) => setTargetingValue(e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground">
                      Enter a keyword or select a segment to target.
                    </p>
                  </div>
                )}

                {targetingMode === "segment" && (
                  <Select value={targetingValue} onValueChange={setTargetingValue}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a segment to target" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New Customers</SelectItem>
                      <SelectItem value="returning">Returning Customers</SelectItem>
                      <SelectItem value="vip">VIP Customers</SelectItem>
                      <SelectItem value="inactive">Inactive Customers</SelectItem>
                      <SelectItem value="high-spenders">High Spenders</SelectItem>
                      <SelectItem value="low-engagement">Low Engagement</SelectItem>
                      <SelectItem value="upsell">Upsell Opportunities</SelectItem>
                    </SelectContent>
                  </Select>
                )}

                <p className="text-sm text-brand-purple font-medium">
                  {matchingCustomers} customer(s) found matching your criteria
                </p>
              </div>
            )}

            {/* Additional Settings */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cta">Call-to-Action Goal (Optional)</Label>
                <Select value={callToAction} onValueChange={setCallToAction}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a campaign goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="visit">Drive Store Visits</SelectItem>
                    <SelectItem value="purchase">Increase Sales</SelectItem>
                    <SelectItem value="engagement">Boost Engagement</SelectItem>
                    <SelectItem value="awareness">Build Brand Awareness</SelectItem>
                    <SelectItem value="loyalty">Strengthen Customer Loyalty</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="seasonal">Seasonal Theme (Optional)</Label>
                <Select value={seasonalTheme} onValueChange={setSeasonalTheme}>
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
                    <SelectItem value="mothers-day">Mother's Day</SelectItem>
                    <SelectItem value="back-to-school">Back to School</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="keywords">Focus Keywords (Optional)</Label>
                <Input
                  id="keywords"
                  placeholder="sale, discount, limited time, etc."
                  value={focusKeywords}
                  onChange={(e) => setFocusKeywords(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="instructions">Additional Context & Instructions</Label>
                <Textarea
                  id="instructions"
                  placeholder="Provide any specific details, desired content length, tone adjustments, special offers, or other context that will help the AI create better content for your campaign..."
                  value={additionalInstructions}
                  onChange={(e) => setAdditionalInstructions(e.target.value)}
                  rows={4}
                />
                <p className="text-sm text-muted-foreground">
                  The AI will incorporate all this additional context along with your business profile and customer data to create highly personalized content.
                </p>
              </div>
            </div>

            <Button 
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate AI Content
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Right Column - Results */}
      <div className="space-y-6">
        {isGenerating && (
          <Card>
            <CardContent className="p-12 text-center">
              <Sparkles className="w-16 h-16 text-brand-purple mx-auto mb-4 animate-pulse" />
              <h3 className="text-xl font-semibold mb-2">Generating brilliant marketing ideas...</h3>
              <p className="text-muted-foreground">Our AI is crafting personalized content based on your business profile and preferences.</p>
            </CardContent>
          </Card>
        )}

        {!isGenerating && !generatedContent && (
          <Card>
            <CardContent className="p-12 text-center">
              <Wand2 className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-muted-foreground">Ready to Create Amazing Content?</h3>
              <p className="text-muted-foreground">Configure your settings and click "Generate AI Content" to get started.</p>
            </CardContent>
          </Card>
        )}

        {generatedContent && campaignType === "general" && (
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
                
                {generatedContent.variations.map((variation: any, index: number) => (
                  <TabsContent key={index} value={index.toString()} className="space-y-6 mt-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-base font-medium">Generated Text</Label>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => copyToClipboard(variation.text)}
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copy
                        </Button>
                      </div>
                      <div className="p-4 border rounded-lg bg-muted/50">
                        <p className="whitespace-pre-line">{variation.text}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-base font-medium">Image Suggestions</Label>
                      <div className="space-y-3">
                        {variation.imagePrompts.map((prompt: string, promptIndex: number) => (
                          <div key={promptIndex} className="p-3 border rounded-lg">
                            <p className="text-sm mb-3">{prompt}</p>
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => copyToClipboard(prompt)}
                              >
                                <Copy className="w-4 h-4 mr-1" />
                                Copy
                              </Button>
                              <Button variant="outline" size="sm">
                                <Sparkles className="w-4 h-4 mr-1" />
                                Generate
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-base font-medium">Video Ideas</Label>
                      <div className="space-y-2">
                        {variation.videoIdeas.map((idea: string, ideaIndex: number) => (
                          <div key={ideaIndex} className="p-3 border rounded-lg">
                            <p className="text-sm">{idea}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-base font-medium">Further Suggestions</Label>
                      <div className="space-y-2">
                        {variation.suggestions.map((suggestion: string, suggestionIndex: number) => (
                          <div key={suggestionIndex} className="p-3 border rounded-lg">
                            <p className="text-sm">{suggestion}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 pt-4 border-t">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <input 
                          type="date" 
                          className="border rounded px-3 py-1 text-sm"
                        />
                      </div>
                      <Button>
                        Save as Campaign
                      </Button>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default GenerateContent;