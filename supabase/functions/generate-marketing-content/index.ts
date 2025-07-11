import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.24.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ContentGenerationRequest {
  campaignType: string;
  platformType: string;
  targetAudience: string;
  targetKeyword?: string;
  selectedSegment?: string;
  callToActionGoal: string;
  seasonalTheme?: string;
  focusKeywords?: string;
  additionalInstructions: string;
  businessProfile: any;
  customerData: any[];
  targetedCustomers: any[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) {
      console.error('GEMINI_API_KEY not found in environment variables');
      return new Response(
        JSON.stringify({ error: 'Gemini API key not configured' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const request: ContentGenerationRequest = await req.json();
    console.log('Generating content for campaign type:', request.campaignType);

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Calculate personalized marketing reach
    let personalizedCount = 0;
    if (request.campaignType === "personalized") {
      if (request.platformType === "direct") {
        personalizedCount = request.customerData.filter((customer: any) => 
          customer.email && customer.email.includes('@')
        ).length;
      } else {
        personalizedCount = Math.floor(request.customerData.length * 0.8);
      }
    }
    
    // Analyze customer segments
    const customerSegments = request.customerData.reduce((acc: any, customer: any) => {
      acc[customer.segment] = (acc[customer.segment] || 0) + 1;
      return acc;
    }, {});

    // Create comprehensive prompt for Gemini
    const prompt = `
      Create 3 unique and highly creative marketing content variations based on the following comprehensive campaign setup:
      
      BUSINESS PROFILE:
      - Business Name: ${request.businessProfile.businessName || 'N/A'}
      - Business Category: ${request.businessProfile.businessCategory || 'N/A'}
      - Location: ${request.businessProfile.location || 'N/A'}
      - Brand Voice: ${request.businessProfile.brandVoice || 'N/A'}
      - Business Bio: ${request.businessProfile.businessBio || 'N/A'}
      - Products/Services: ${request.businessProfile.productsServices || 'N/A'}
      
      CAMPAIGN CONFIGURATION:
      - Campaign Type: ${request.campaignType === "personalized" ? "Personalized Marketing - Targeted content for specific customers" : "General Marketing - Broad content for all audiences"}
      - Platform Type: ${request.platformType === "direct" ? "Direct to Customer (Email/SMS)" : 
        request.platformType === "social" ? "Social Media Post (Facebook, Instagram, Twitter)" :
        request.platformType === "email" ? "Email Campaign (Newsletter/Promotional)" :
        request.platformType === "local" ? "Local Advertisement (Google Ads, local listings)" : "General Marketing"}
      - Target Audience Strategy: ${request.targetAudience === "keyword" ? `Target by Keywords in Purchase History: "${request.targetKeyword}"` : `Target by Customer Segment: "${request.selectedSegment}"`}
      - Call-to-Action Goal: ${request.callToActionGoal}
      - Seasonal Theme: ${request.seasonalTheme || 'None'}
      - Focus Keywords: ${request.focusKeywords || 'None specified'}
      - Additional Instructions: ${request.additionalInstructions}
      
      CUSTOMER DATA INSIGHTS:
      - Total Customers: ${request.customerData.length}
      - Customer Segments: ${JSON.stringify(customerSegments)}
      - Targeted Customer Count: ${request.targetedCustomers.length}
      - Sample Targeted Profiles: ${JSON.stringify(request.targetedCustomers.slice(0, 3))}
      
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
    
    console.log('Sending prompt to Gemini AI...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('Received response from Gemini AI');
    
    // Parse the JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsedResponse = JSON.parse(jsonMatch[0]);
      
      return new Response(
        JSON.stringify({
          variations: parsedResponse.variations,
          personalizedCount: personalizedCount
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      );
    } else {
      throw new Error('Invalid response format from AI');
    }
    
  } catch (error: any) {
    console.error('Error generating content:', error);
    
    // Check if it's a quota error
    if (error.status === 429 || error.message?.includes('quota')) {
      return new Response(
        JSON.stringify({ error: 'Quota limit reached. Please wait or upgrade your plan.' }),
        {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    } else {
      return new Response(
        JSON.stringify({ error: 'Content generation failed. Please try again.' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
  }
});