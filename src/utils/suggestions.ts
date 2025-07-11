interface Suggestion {
  id: string;
  title: string;
  description: string;
  type: 'personalized' | 'general';
  categories: string[];
  priority: 'high' | 'medium';
}

export const businessSuggestions: Suggestion[] = [
  // Restaurant/Cafe Suggestions
  {
    id: 'rest_daily_special',
    title: 'Showcase Today\'s Chef Special',
    description: 'Highlight your daily special with mouth-watering descriptions and behind-the-scenes preparation.',
    type: 'general',
    categories: ['restaurant', 'cafe'],
    priority: 'high'
  },
  {
    id: 'rest_customer_favorite',
    title: 'Feature a Customer\'s Favorite Dish',
    description: 'Share a story about a regular customer and their go-to order to create personal connections.',
    type: 'general',
    categories: ['restaurant', 'cafe'],
    priority: 'medium'
  },
  {
    id: 'rest_vip_outreach',
    title: 'VIP Customer Appreciation Message',
    description: 'Send personalized thank you messages to your most loyal customers with exclusive offers.',
    type: 'personalized',
    categories: ['restaurant', 'cafe'],
    priority: 'high'
  },
  {
    id: 'rest_seasonal_menu',
    title: 'Seasonal Menu Launch',
    description: 'Announce your new seasonal menu items with fresh, local ingredients.',
    type: 'general',
    categories: ['restaurant', 'cafe'],
    priority: 'high'
  },
  {
    id: 'rest_cooking_tips',
    title: 'Share Chef\'s Cooking Secrets',
    description: 'Give customers insider cooking tips or ingredient spotlights from your kitchen.',
    type: 'general',
    categories: ['restaurant', 'cafe'],
    priority: 'medium'
  },
  {
    id: 'rest_inactive_winback',
    title: 'Win Back Inactive Diners',
    description: 'Reach out to customers who haven\'t visited recently with special comeback offers.',
    type: 'personalized',
    categories: ['restaurant', 'cafe'],
    priority: 'high'
  },

  // Fitness Suggestions
  {
    id: 'fit_workout_spotlight',
    title: 'Weekly Workout Challenge',
    description: 'Create engaging workout challenges that members can participate in and share.',
    type: 'general',
    categories: ['fitness', 'gym'],
    priority: 'high'
  },
  {
    id: 'fit_member_transformation',
    title: 'Member Success Story',
    description: 'Showcase inspiring member transformations and fitness journeys.',
    type: 'general',
    categories: ['fitness', 'gym'],
    priority: 'high'
  },
  {
    id: 'fit_personalized_goals',
    title: 'Personalized Fitness Goal Check-in',
    description: 'Send customized messages to members about their fitness goals and progress.',
    type: 'personalized',
    categories: ['fitness', 'gym'],
    priority: 'medium'
  },
  {
    id: 'fit_nutrition_tips',
    title: 'Nutrition and Wellness Tips',
    description: 'Share expert nutrition advice and healthy lifestyle tips.',
    type: 'general',
    categories: ['fitness', 'gym'],
    priority: 'medium'
  },
  {
    id: 'fit_class_promo',
    title: 'New Class Introduction',
    description: 'Promote new fitness classes or training programs with instructor spotlights.',
    type: 'general',
    categories: ['fitness', 'gym'],
    priority: 'high'
  },

  // Retail/Boutique Suggestions
  {
    id: 'retail_new_arrivals',
    title: 'New Arrivals Showcase',
    description: 'Feature your latest products with styling tips and outfit ideas.',
    type: 'general',
    categories: ['retail', 'boutique', 'fashion'],
    priority: 'high'
  },
  {
    id: 'retail_style_guide',
    title: 'Seasonal Style Guide',
    description: 'Create outfit inspiration and styling advice for the current season.',
    type: 'general',
    categories: ['retail', 'boutique', 'fashion'],
    priority: 'medium'
  },
  {
    id: 'retail_vip_preview',
    title: 'VIP Early Access Preview',
    description: 'Give your best customers exclusive early access to sales and new collections.',
    type: 'personalized',
    categories: ['retail', 'boutique', 'fashion'],
    priority: 'high'
  },
  {
    id: 'retail_customer_feature',
    title: 'Customer Style Feature',
    description: 'Highlight how real customers style your products in their daily lives.',
    type: 'general',
    categories: ['retail', 'boutique', 'fashion'],
    priority: 'medium'
  },
  {
    id: 'retail_size_reminder',
    title: 'Personalized Size and Fit Reminders',
    description: 'Send targeted messages about sizes and fits based on purchase history.',
    type: 'personalized',
    categories: ['retail', 'boutique', 'fashion'],
    priority: 'medium'
  },

  // Beauty/Wellness Suggestions
  {
    id: 'beauty_treatment_spotlight',
    title: 'Treatment of the Month',
    description: 'Highlight a specific treatment or service with benefits and client testimonials.',
    type: 'general',
    categories: ['beauty', 'wellness', 'spa'],
    priority: 'high'
  },
  {
    id: 'beauty_skincare_tips',
    title: 'Expert Skincare Advice',
    description: 'Share professional skincare tips and routines from your specialists.',
    type: 'general',
    categories: ['beauty', 'wellness', 'spa'],
    priority: 'medium'
  },
  {
    id: 'beauty_appointment_reminder',
    title: 'Personalized Appointment Reminders',
    description: 'Send customized reminders for regular treatments and maintenance appointments.',
    type: 'personalized',
    categories: ['beauty', 'wellness', 'spa'],
    priority: 'high'
  },
  {
    id: 'beauty_product_recommendation',
    title: 'Personalized Product Recommendations',
    description: 'Suggest products based on client\'s skin type and previous treatments.',
    type: 'personalized',
    categories: ['beauty', 'wellness', 'spa'],
    priority: 'medium'
  },

  // General Business Suggestions
  {
    id: 'gen_behind_scenes',
    title: 'Behind the Scenes Content',
    description: 'Show the passion and work that goes into your business operations.',
    type: 'general',
    categories: ['general'],
    priority: 'medium'
  },
  {
    id: 'gen_community_impact',
    title: 'Community Impact Story',
    description: 'Share how your business contributes to and supports the local community.',
    type: 'general',
    categories: ['general'],
    priority: 'medium'
  },
  {
    id: 'gen_milestone_celebration',
    title: 'Business Milestone Celebration',
    description: 'Celebrate anniversaries, achievements, and special business moments.',
    type: 'general',
    categories: ['general'],
    priority: 'medium'
  },
  {
    id: 'gen_customer_appreciation',
    title: 'Customer Appreciation Post',
    description: 'Express gratitude to your customers and share appreciation messages.',
    type: 'general',
    categories: ['general'],
    priority: 'medium'
  },
  {
    id: 'gen_expert_tips',
    title: 'Industry Expert Tips',
    description: 'Share professional insights and tips that position you as an industry expert.',
    type: 'general',
    categories: ['general'],
    priority: 'medium'
  },
  {
    id: 'gen_seasonal_content',
    title: 'Seasonal Business Updates',
    description: 'Create content that ties your business to current seasons and holidays.',
    type: 'general',
    categories: ['general'],
    priority: 'medium'
  },
  {
    id: 'gen_team_spotlight',
    title: 'Team Member Spotlight',
    description: 'Introduce your team members and their unique skills and personalities.',
    type: 'general',
    categories: ['general'],
    priority: 'medium'
  },
  {
    id: 'gen_loyalty_program',
    title: 'Loyalty Program Promotion',
    description: 'Promote your loyalty program benefits and encourage customer retention.',
    type: 'general',
    categories: ['general'],
    priority: 'high'
  },
  {
    id: 'gen_referral_campaign',
    title: 'Customer Referral Campaign',
    description: 'Encourage existing customers to refer friends and family with incentives.',
    type: 'personalized',
    categories: ['general'],
    priority: 'high'
  },
  {
    id: 'gen_educational_content',
    title: 'Educational Content Series',
    description: 'Create informative content that educates customers about your industry.',
    type: 'general',
    categories: ['general'],
    priority: 'medium'
  },
  {
    id: 'gen_customer_survey',
    title: 'Customer Feedback Request',
    description: 'Ask for customer feedback and testimonials to improve your services.',
    type: 'personalized',
    categories: ['general'],
    priority: 'medium'
  }
];

export const getSuggestionsForBusiness = (businessCategory: string, date: Date = new Date()): Suggestion[] => {
  // Create a seed based on the date for consistent daily rotation
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);
  
  // Filter suggestions by business category
  const relevantSuggestions = businessSuggestions.filter(suggestion => 
    suggestion.categories.includes(businessCategory.toLowerCase()) || 
    suggestion.categories.includes('general')
  );
  
  // Shuffle suggestions based on the day
  const shuffled = [...relevantSuggestions].sort(() => {
    return ((dayOfYear * 9301 + 49297) % 233280) / 233280 - 0.5;
  });
  
  // Return top 3 suggestions for the day
  return shuffled.slice(0, 3);
};

export const mapSuggestionToRoute = (suggestion: Suggestion): string => {
  if (suggestion.type === 'personalized') {
    return 'personalized-email';
  } else if (suggestion.title.toLowerCase().includes('special') || 
             suggestion.title.toLowerCase().includes('menu') ||
             suggestion.title.toLowerCase().includes('promotion')) {
    return 'seasonal-promo';
  } else if (suggestion.title.toLowerCase().includes('community') || 
             suggestion.title.toLowerCase().includes('local')) {
    return 'local-event';
  } else {
    return 'general';
  }
};