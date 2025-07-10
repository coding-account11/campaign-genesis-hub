import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Upload, 
  FileText, 
  Users, 
  Plus, 
  Download, 
  Edit, 
  Info,
  Sparkles 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { GoogleGenerativeAI } from "@google/generative-ai";
import GeminiApiKeyInput from "@/components/GeminiApiKeyInput";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  purchaseHistory: string;
  segment: string;
  segmentReason: string;
  totalSpent: number;
  lastPurchaseDate: string;
}

const CustomerData = () => {
  const { toast } = useToast();
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    purchaseHistory: "",
    segment: "new"
  });

  // Mock customer data - make it mutable so we can add new customers
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: "1",
      name: "Sarah Johnson",
      email: "sarahjohnson55@gmail.com",
      phone: "555-0123",
      purchaseHistory: "Regular coffee orders, loves seasonal lattes",
      segment: "new",
      segmentReason: "Recent first-time customer with positive engagement",
      totalSpent: 87.50,
      lastPurchaseDate: "2024-01-15"
    },
    {
      id: "2", 
      name: "Emma Davis",
      email: "emma.davis@email.com",
      phone: "555-0789",
      purchaseHistory: "Weekend brunch regular, pastry enthusiast",
      segment: "returning",
      segmentReason: "Consistent weekly visits, moderate spending pattern",
      totalSpent: 245.75,
      lastPurchaseDate: "2024-01-12"
    },
    {
      id: "3",
      name: "Mike Chen", 
      email: "mike.chen@email.com",
      phone: "555-0456",
      purchaseHistory: "Large catering orders for office events",
      segment: "vip",
      segmentReason: "High-value customer with premium spending habits",
      totalSpent: 1250.00,
      lastPurchaseDate: "2024-01-18"
    }
  ]);

  const segments = [
    { value: "new", label: "New Customer", description: "Recently acquired customer", color: "bg-blue-100 text-blue-800" },
    { value: "returning", label: "Returning Customer", description: "Regular customer with consistent visits", color: "bg-green-100 text-green-800" },
    { value: "vip", label: "VIP Customer", description: "High-value customer", color: "bg-purple-100 text-purple-800" },
    { value: "inactive", label: "Inactive Customer", description: "Haven't visited in 60+ days", color: "bg-red-100 text-red-800" },
    { value: "at-risk", label: "At Risk of Churning", description: "Declining engagement pattern", color: "bg-orange-100 text-orange-800" },
    { value: "high-spender", label: "High Spender", description: "Above average spending", color: "bg-indigo-100 text-indigo-800" },
    { value: "low-engagement", label: "Low Engagement", description: "Minimal interaction with business", color: "bg-gray-100 text-gray-800" },
    { value: "upsell", label: "Upsell Opportunity", description: "Potential for service expansion", color: "bg-teal-100 text-teal-800" }
  ];

  const getSegmentInfo = (segmentValue: string) => {
    return segments.find(s => s.value === segmentValue) || segments[0];
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadFile(file);
    }
  };

  const processUpload = async () => {
    if (!uploadFile) return;
    
    toast({
      title: "Processing file with Gemini AI...",
      description: "Analyzing customer data and performing intelligent segmentation."
    });

    try {
      // Initialize Gemini AI
      const genAI = new GoogleGenerativeAI(
        localStorage.getItem('gemini_api_key') || 'your-api-key-here'
      );
      
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });
      
      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target?.result as string;
        
        // Create comprehensive prompt for Gemini to analyze customer data
        const prompt = `
          Analyze the following customer data file and extract structured customer information with intelligent segmentation:
          
          FILE CONTENT:
          ${text}
          
          INSTRUCTIONS:
          1. Parse all customer records from the file (CSV, TXT, or any format)
          2. Extract: name, email, phone, purchase history/notes
          3. Assign intelligent customer segments based on available data:
             - "new": First-time or recent customers
             - "returning": Regular customers with consistent activity
             - "vip": High-value customers with premium spending
             - "inactive": Customers who haven't engaged recently
             - "at-risk": Customers showing declining engagement
             - "high-spender": Above-average spending patterns
             - "low-engagement": Minimal interaction customers
             - "upsell": Potential for service expansion
          4. Provide reasoning for each segment assignment
          5. Generate realistic spending amounts and recent purchase dates
          
          Return ONLY a valid JSON object with this structure:
          {
            "customers": [
              {
                "name": "Customer Name",
                "email": "email@domain.com",
                "phone": "phone number",
                "purchaseHistory": "purchase details and preferences",
                "segment": "segment_value",
                "segmentReason": "AI reasoning for this segment",
                "totalSpent": 150.00,
                "lastPurchaseDate": "2024-01-15"
              }
            ]
          }
        `;
        
        try {
          const result = await model.generateContent(prompt);
          const response = await result.response;
          const aiText = response.text();
          
          // Parse the JSON response
          const jsonMatch = aiText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsedResponse = JSON.parse(jsonMatch[0]);
            
            // Add unique IDs to customers
            const newCustomers: Customer[] = parsedResponse.customers.map((customer: any, index: number) => ({
              ...customer,
              id: `ai-${Date.now()}-${index}`,
              totalSpent: Number(customer.totalSpent) || 0
            }));
            
            // Add all parsed customers
            setCustomers(prevCustomers => [...prevCustomers, ...newCustomers]);
            
            toast({
              title: `Successfully imported ${newCustomers.length} customers!`,
              description: "Gemini AI completed intelligent segmentation and data structuring."
            });
          } else {
            throw new Error('Invalid AI response format');
          }
          
        } catch (aiError) {
          console.error('AI processing error:', aiError);
          // Fallback to basic parsing
          const lines = text.split('\n').filter(line => line.trim());
          const newCustomers: Customer[] = [];
          const segments = ["new", "returning", "vip", "inactive", "at-risk", "high-spender", "low-engagement", "upsell"];
          
          lines.forEach((line, index) => {
            if (index === 0 && line.includes(',')) return; // Skip header row
            
            const parts = line.split(',').map(part => part.trim().replace(/"/g, ''));
            if (parts.length >= 2) {
              const randomSegment = segments[Math.floor(Math.random() * segments.length)];
              const randomSpent = Math.floor(Math.random() * 2000) + 50;
              
              newCustomers.push({
                id: `upload-${Date.now()}-${index}`,
                name: parts[0] || `Customer ${index + 1}`,
                email: parts[1] || `customer${index + 1}@email.com`,
                phone: parts[2] || `555-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
                purchaseHistory: parts[3] || "Various purchases, loyal customer",
                segment: randomSegment,
                segmentReason: `Fallback segmentation - please check Gemini API key`,
                totalSpent: randomSpent,
                lastPurchaseDate: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
              });
            }
          });
          
          setCustomers(prevCustomers => [...prevCustomers, ...newCustomers]);
          
          toast({
            title: `Imported ${newCustomers.length} customers with basic processing`,
            description: "AI processing failed, used fallback parsing. Please check your Gemini API key.",
            variant: "destructive"
          });
        }
        
        setUploadFile(null);
      };
      
      reader.readAsText(uploadFile);
      
    } catch (error) {
      console.error('Error processing upload:', error);
      toast({
        title: "Upload Processing Failed",
        description: "Please check your file format and Gemini API key.",
        variant: "destructive"
      });
      setUploadFile(null);
    }
  };

  const handleAddCustomer = () => {
    if (editingCustomer) {
      // Update existing customer
      setCustomers(prevCustomers => 
        prevCustomers.map(customer => 
          customer.id === editingCustomer.id 
            ? {
                ...customer,
                name: newCustomer.name,
                email: newCustomer.email,
                phone: newCustomer.phone,
                purchaseHistory: newCustomer.purchaseHistory,
                segment: newCustomer.segment
              }
            : customer
        )
      );
      toast({
        title: "Customer updated",
        description: `${newCustomer.name} has been updated successfully.`
      });
    } else {
      // Add new customer
      const newCustomerData: Customer = {
        id: `manual-${Date.now()}`,
        name: newCustomer.name,
        email: newCustomer.email,
        phone: newCustomer.phone,
        purchaseHistory: newCustomer.purchaseHistory,
        segment: newCustomer.segment,
        segmentReason: "Manually added customer",
        totalSpent: 0,
        lastPurchaseDate: new Date().toISOString().split('T')[0]
      };
      
      setCustomers(prevCustomers => [...prevCustomers, newCustomerData]);
      toast({
        title: "Customer added",
        description: `${newCustomer.name} has been added to your customer database.`
      });
    }
    
    setNewCustomer({ name: "", email: "", phone: "", purchaseHistory: "", segment: "new" });
    setEditingCustomer(null);
    setShowAddDialog(false);
  };

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setNewCustomer({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      purchaseHistory: customer.purchaseHistory,
      segment: customer.segment
    });
    setShowAddDialog(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="w-8 h-8 text-brand-teal" />
            Customer Data Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Upload and manage your customer data to enable personalized marketing campaigns with AI-powered content generation and advanced customer segmentation.
          </p>
        </div>
      </div>

      <GeminiApiKeyInput />

      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upload">Upload & Import</TabsTrigger>
          <TabsTrigger value="manage">Manage Customers</TabsTrigger>
          <TabsTrigger value="api">API Setup</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* AI-Powered Import */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-brand-purple" />
                  AI-Powered Customer Data Import
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8">
                    <div className="text-center">
                      <FileText className="mx-auto h-12 w-12 text-brand-purple mb-4" />
                      <div className="text-lg font-medium mb-2">Drag & Drop Any CSV or TXT File</div>
                      <p className="text-muted-foreground mb-4">
                        Our AI will automatically read, structure, and categorize your customer data with advanced segmentation.
                      </p>
                      <input
                        type="file"
                        accept=".csv,.txt"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="customer-file-upload"
                      />
                      <Button variant="outline" asChild>
                        <label htmlFor="customer-file-upload" className="cursor-pointer">
                          Choose File
                        </label>
                      </Button>
                    </div>
                  </div>

                  {uploadFile && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 border rounded-lg">
                        <FileText className="w-5 h-5 text-muted-foreground" />
                        <span className="text-sm">{uploadFile.name}</span>
                      </div>
                      <Button onClick={processUpload} className="w-full">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Process with AI
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* AI Customer Segmentation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-brand-teal" />
                  AI Customer Segmentation
                </CardTitle>
                <CardDescription>
                  The AI will automatically assign customers to segments based on spending patterns, frequency, and behavior. Hover to see definitions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {segments.map((segment) => (
                    <div key={segment.value} className="relative group">
                      <Badge className={`${segment.color} w-full justify-center cursor-help`}>
                        {segment.label}
                        <Info className="w-3 h-3 ml-1" />
                      </Badge>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                        {segment.description}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="manage" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-brand-purple" />
                    Customer Database
                  </CardTitle>
                  <CardDescription>
                    {customers.length} Customers
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export CSV
                  </Button>
                  <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Customer
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>
                          {editingCustomer ? "Edit Customer" : "Add New Customer"}
                        </DialogTitle>
                        <DialogDescription>
                          {editingCustomer ? "Update customer information" : "Manually add a customer to your database"}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Name</Label>
                          <Input
                            value={newCustomer.name}
                            onChange={(e) => setNewCustomer(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Customer name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Email</Label>
                          <Input
                            type="email"
                            value={newCustomer.email}
                            onChange={(e) => setNewCustomer(prev => ({ ...prev, email: e.target.value }))}
                            placeholder="email@example.com"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Phone</Label>
                          <Input
                            value={newCustomer.phone}
                            onChange={(e) => setNewCustomer(prev => ({ ...prev, phone: e.target.value }))}
                            placeholder="555-0123"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Purchase History</Label>
                          <Textarea
                            value={newCustomer.purchaseHistory}
                            onChange={(e) => setNewCustomer(prev => ({ ...prev, purchaseHistory: e.target.value }))}
                            placeholder="Previous orders, preferences, etc."
                            rows={3}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Segment</Label>
                          <Select value={newCustomer.segment} onValueChange={(value) => setNewCustomer(prev => ({ ...prev, segment: value }))}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {segments.map((segment) => (
                                <SelectItem key={segment.value} value={segment.value}>
                                  {segment.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                         <div className="flex gap-2 pt-4">
                           <Button variant="outline" onClick={() => {
                             setShowAddDialog(false);
                             setEditingCustomer(null);
                             setNewCustomer({ name: "", email: "", phone: "", purchaseHistory: "", segment: "new" });
                           }} className="flex-1">
                             Cancel
                           </Button>
                           <Button onClick={handleAddCustomer} className="flex-1">
                             {editingCustomer ? "Update" : "Add"} Customer
                           </Button>
                         </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Purchase History</TableHead>
                    <TableHead>Segment</TableHead>
                    <TableHead>Spending</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((customer) => {
                    const segmentInfo = getSegmentInfo(customer.segment);
                    return (
                      <TableRow key={customer.id}>
                        <TableCell className="font-medium">{customer.name}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm">{customer.email}</div>
                            <div className="text-sm text-muted-foreground">{customer.phone}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs">
                            <p className="text-sm truncate">{customer.purchaseHistory}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Badge className={segmentInfo.color}>
                              {segmentInfo.label}
                            </Badge>
                            <div className="relative group">
                              <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                                {customer.segmentReason}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium">${customer.totalSpent.toFixed(2)}</div>
                            <div className="text-sm text-muted-foreground">
                              Last: {new Date(customer.lastPurchaseDate).toLocaleDateString()}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditCustomer(customer)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomerData;