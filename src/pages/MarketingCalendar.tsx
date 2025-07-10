import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Calendar, Copy, Trash2, ExternalLink } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface Campaign {
  id: string;
  title: string;
  content: string;
  platform: string;
  status: "scheduled" | "draft" | "posted";
  date: Date;
}

const MarketingCalendar = () => {
  const { toast } = useToast();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Load campaigns from localStorage and combine with mock data
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: "1",
      title: "Monday Morning Special",
      content: "☕ Start your week right with our Monday Morning Special! \n\nGet 20% off your favorite latte when you visit us before 10 AM. Our freshly roasted beans and handcrafted drinks are the perfect way to fuel your week ahead.\n\n#MondayMotivation #CoffeeLovers #CozyCornerCafe",
      platform: "Social Media",
      status: "scheduled",
      date: new Date(2024, 6, 15) // July 15, 2024
    },
    {
      id: "2", 
      title: "Customer Spotlight",
      content: "🌟 Customer Spotlight: Meet Sarah, our regular who stops by every Tuesday for her favorite caramel macchiato. 'Cozy Corner isn't just a coffee shop - it's my second home where everyone knows my name and my order!' Thanks for being part of our family, Sarah! ☕️❤️",
      platform: "Social Media",
      status: "draft",
      date: new Date(2024, 6, 18)
    },
    {
      id: "3",
      title: "Weekend Brunch Menu",
      content: "🥞 Weekend vibes are here! Join us for our special brunch menu featuring fluffy pancakes, artisanal omelets, and our famous avocado toast. Plus, bottomless coffee for all brunch orders! See you this weekend! 🌅",
      platform: "Email",
      status: "scheduled", 
      date: new Date(2024, 6, 20)
    },
    {
      id: "4",
      title: "Something magical happening at Cozy Corner Cafe today!",
      content: "✨ There's something magical happening at Cozy Corner Cafe today! Our Seattle, WA community deserves the best, and that's exactly what we're serving up. Whether you're a regular or discovering us for the first time, prepare for an experience that'll brighten your entire afternoon. Come be part of something special! 🌟",
      platform: "Social Media",
      status: "scheduled",
      date: new Date(2024, 6, 24)
    }
  ]);

  // Load saved campaigns from localStorage on component mount
  useEffect(() => {
    const savedCampaigns = JSON.parse(localStorage.getItem('campaigns') || '[]');
    if (savedCampaigns.length > 0) {
      // Convert date strings back to Date objects and merge with default campaigns
      const processedCampaigns = savedCampaigns.map((campaign: any) => ({
        ...campaign,
        date: new Date(campaign.date)
      }));
      // Replace all campaigns with processed ones to maintain consistency
      setCampaigns(prev => [...prev, ...processedCampaigns]);
    }
  }, []);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const getCampaignsForDate = (date: Date | null) => {
    if (!date) return [];
    return campaigns.filter(campaign => 
      campaign.date.getDate() === date.getDate() &&
      campaign.date.getMonth() === date.getMonth() &&
      campaign.date.getFullYear() === date.getFullYear()
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled": return "default";
      case "draft": return "secondary";
      case "posted": return "outline";
      default: return "default";
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case "Social Media": return "bg-blue-100 text-blue-800";
      case "Email": return "bg-green-100 text-green-800";
      case "Local Ad": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleCampaignSelect = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    // Auto scroll to bottom to show campaign details
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 100);
  };

  const handleDeleteCampaign = () => {
    if (selectedCampaign) {
      // Remove campaign from both local state and localStorage
      const updatedCampaigns = campaigns.filter(campaign => campaign.id !== selectedCampaign.id);
      setCampaigns(updatedCampaigns);
      
      // Update localStorage with the filtered campaigns (remove hard-coded ones too)
      const savedCampaigns = JSON.parse(localStorage.getItem('campaigns') || '[]');
      const updatedSavedCampaigns = savedCampaigns.filter((campaign: any) => campaign.id !== selectedCampaign.id);
      localStorage.setItem('campaigns', JSON.stringify(updatedSavedCampaigns));
      
      toast({
        title: "Campaign deleted",
        description: `"${selectedCampaign.title}" has been removed from your calendar.`
      });
      setSelectedCampaign(null);
      setShowDeleteDialog(false);
    }
  };

  const handleCopyContent = () => {
    if (selectedCampaign) {
      navigator.clipboard.writeText(selectedCampaign.content);
      toast({
        title: "Content copied",
        description: "Campaign content has been copied to your clipboard."
      });
    }
  };

  const days = getDaysInMonth(currentDate);
  const today = new Date();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Marketing Calendar</h1>
          <p className="text-muted-foreground mt-1">Plan and schedule your marketing campaigns</p>
        </div>
        <Button onClick={() => window.location.href = '/generate-content'}>
          Create Campaign
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </CardTitle>
              <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
            {/* Day headers */}
            {daysOfWeek.map(day => (
              <div key={day} className="bg-muted p-4 text-center text-sm font-medium">
                {day}
              </div>
            ))}
            
            {/* Calendar days */}
            {days.map((date, index) => {
              const campaignsForDate = getCampaignsForDate(date);
              const isToday = date && 
                date.getDate() === today.getDate() &&
                date.getMonth() === today.getMonth() &&
                date.getFullYear() === today.getFullYear();

              return (
                <div 
                  key={index} 
                  className={`bg-background p-2 min-h-[120px] border-r border-b ${
                    isToday ? 'bg-brand-accent' : ''
                  } ${date ? 'hover:bg-accent cursor-pointer' : ''}`}
                >
                  {date && (
                    <>
                      <div className={`text-sm mb-2 ${isToday ? 'font-bold text-brand-purple' : ''}`}>
                        {date.getDate()}
                      </div>
                      <div className="space-y-1">
                        {campaignsForDate.map(campaign => (
                          <div
                            key={campaign.id}
                            onClick={() => handleCampaignSelect(campaign)}
                            className="text-xs p-1 rounded bg-primary text-primary-foreground cursor-pointer hover:bg-primary/80 transition-colors"
                          >
                            <div className="flex items-center gap-1">
                              <div className={`w-2 h-2 rounded-full ${
                                campaign.status === 'scheduled' ? 'bg-green-400' :
                                campaign.status === 'draft' ? 'bg-yellow-400' : 'bg-blue-400'
                              }`} />
                              <span className="truncate">{campaign.title}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Campaign Details Card - Only show if campaign is clicked */}
      {selectedCampaign && (
        <Card className="mt-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>{selectedCampaign.title}</CardTitle>
                <CardDescription>
                  Scheduled for {selectedCampaign.date.toLocaleDateString()}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Badge variant={getStatusColor(selectedCampaign.status)} className="capitalize">
                  {selectedCampaign.status}
                </Badge>
                <Badge className={getPlatformColor(selectedCampaign.platform)}>
                  {selectedCampaign.platform}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-medium mb-3">Content</h4>
              <div className="p-4 border rounded-lg bg-muted/50">
                <p className="whitespace-pre-line">{selectedCampaign.content}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Actions</h4>
              
              <div className="space-y-3">
                <div>
                  <h5 className="text-sm font-medium mb-2">Post on Platforms</h5>
                  <div className="flex flex-wrap gap-2">
                    {selectedCampaign.platform === "Social Media" && (
                      <>
                        <Button variant="outline" size="sm" asChild>
                          <a 
                            href="https://facebook.com/composer" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-2"
                          >
                            <ExternalLink className="w-3 h-3" />
                            Facebook
                          </a>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <a 
                            href="https://instagram.com" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-2"
                          >
                            <ExternalLink className="w-3 h-3" />
                            Instagram
                          </a>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <a 
                            href="https://twitter.com/compose/post" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-2"
                          >
                            <ExternalLink className="w-3 h-3" />
                            Twitter
                          </a>
                        </Button>
                      </>
                    )}
                    {selectedCampaign.platform === "Email" && (
                      <Button variant="outline" size="sm" asChild>
                        <a 
                          href={`mailto:?subject=${encodeURIComponent(selectedCampaign.title)}&body=${encodeURIComponent(selectedCampaign.content)}`}
                          className="flex items-center gap-2"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Send Email
                        </a>
                      </Button>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleCopyContent}>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Content
                  </Button>
                  
                  <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                    <DialogTrigger asChild>
                      <Button variant="destructive">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Campaign
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Delete Campaign</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to delete "{selectedCampaign.title}"? This action cannot be undone.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                          Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteCampaign}>
                          Delete
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MarketingCalendar;