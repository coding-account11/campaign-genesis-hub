import { useState, useEffect } from "react";
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
  Info, // Make sure Info is imported
  Sparkles,
  Trash2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

  // Load customers from localStorage or use default data
  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('customerData');
    if (saved) {
      return JSON.parse(saved);
    }
    // Only return dummy data if no saved data exists
    return [];
  });

  const segments = [
    { value: "new", label: "New Customer", description: "First-time customer with recent signup", color: "bg-blue-100 text-blue-800" },
    { value: "returning", label: "Returning Customer", description: "Regular customer with 2+ purchases", color: "bg-green-100 text-green-800" },
    { value: "vip", label: "VIP Customer", description: "High-value customer with frequent visits", color: "bg-purple-100 text-purple-800" },
    { value: "inactive", label: "Inactive Customer", description: "Low spending, haven't visited in 60+ days", color: "bg-red-100 text-red-800" },
    { value: "at-risk", label: "At Risk of Churning", description: "Declining visit frequency", color: "bg-orange-100 text-orange-800" },
    { value: "high-spender", label: "High Spender", description: "Above average spending per visit", color: "bg-indigo-100 text-indigo-800" },
    { value: "low-engagement", label: "Low Engagement", description: "Minimal interaction and low purchase frequency", color: "bg-gray-100 text-gray-800" },
    { value: "upsell", label: "Upsell Opportunity", description: "Regular customer ready for premium offerings", color: "bg-teal-100 text-teal-800" }
  ];

  const getSegmentInfo = (segmentValue: string) => {
    return segments.find(s => s.value === segmentValue) || segments[0];
  };

  const calculateSmartSpending = (customerData: any) => {
    // Get business profile for pricing information
    const businessProfile = JSON.parse(localStorage.getItem('businessProfile') || '{}');
    const businessPrices = businessProfile.productsServices || '';

    // Extract prices from business profile
    const priceMatches = businessPrices.match(/\$[\d,]+(\.\d{2})?/g);
    const prices = priceMatches ? priceMatches.map((p: string) => parseFloat(p.replace(/[$,]/g, ''))) : [5, 10, 15, 25];
    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;

    // Calculate spending based on segment and purchase history
    let multiplier = 1;
    if (customerData.segment === 'vip') multiplier = 3;
    else if (customerData.segment === 'returning') multiplier = 1.5;
    else if (customerData.segment === 'high-spender') multiplier = 2.5;
    else if (customerData.segment === 'inactive') multiplier = 0.3;

    const purchaseFrequency = Math.floor(Math.random() * 10) + 1;
    return Math.round(avgPrice * purchaseFrequency * multiplier);
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
      title: "Processing file with AI...",
      description: "Intelligently parsing and segmenting customer data."
    });

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim());
        const newCustomers: Customer[] = [];

        // Get business profile for intelligent segmentation
        const businessProfile = JSON.parse(localStorage.getItem('businessProfile') || '{}');

        lines.forEach((line, index) => {
          if (index === 0 && line.includes(',')) return; // Skip header row

          const parts = line.split(',').map(part => part.trim().replace(/"/g, ''));
          if (parts.length >= 1) {
            // Extract available data intelligently
            let name = parts[0] || '';
            let email = '';
            let phone = '';
            let purchaseHistory = '';
            let totalSpent = 0;

            // Smart data extraction based on content patterns
            parts.forEach(part => {
              if (part.includes('@')) email = part;
              else if (/^\d{3}-?\d{3}-?\d{4}$/.test(part.replace(/[^\d-]/g, ''))) phone = part;
              else if (/\$/.test(part)) {
                const spent = parseFloat(part.replace(/[$,]/g, ''));
                if (!isNaN(spent)) totalSpent = spent;
              }
              else if (part.length > 20 && !email && !phone) purchaseHistory = part;
            });

            // Only add if we have at least a name
            if (name) {
            // Intelligent segmentation based on available data
              let segment = 'new';
              let segmentReason = 'New customer - first-time buyer';

              if (totalSpent > 0) {
                if (totalSpent > 500) {
                  segment = 'vip';
                  segmentReason = `VIP customer with high spending of $${totalSpent}`;
                } else if (totalSpent > 200) {
                  segment = 'high-spender';
                  segmentReason = `High-value customer with $${totalSpent} total spent`;
                } else if (totalSpent > 50) {
                  segment = 'returning';
                  segmentReason = `Returning customer with moderate spending of $${totalSpent}`;
                } else {
                  segment = 'new';
                  segmentReason = `New customer with initial purchase of $${totalSpent}`;
                }
              } else if (purchaseHistory && purchaseHistory.length > 0) {
                // Analyze purchase history text for meaningful patterns
                const historyLower = purchaseHistory.toLowerCase();
                const purchaseCount = (historyLower.match(/purchase|order|visit|buy/g) || []).length;

                if (historyLower.includes('frequent') || historyLower.includes('regular') || historyLower.includes('weekly') || purchaseCount > 3) {
                  segment = 'returning';
                  segmentReason = `Regular customer with ${purchaseCount > 0 ? purchaseCount + ' recorded purchases' : 'frequent visit pattern'}`;
                } else if (historyLower.includes('vip') || historyLower.includes('premium') || historyLower.includes('loyalty')) {
                  segment = 'vip';
                  segmentReason = 'VIP customer with premium service history';
                } else if (historyLower.includes('inactive') || historyLower.includes('not visited') || historyLower.includes('churned')) {
                  segment = 'at-risk';
                  segmentReason = 'At-risk customer showing signs of reduced engagement';
                } else if (historyLower.includes('dissatisfied') || historyLower.includes('complaint') || historyLower.includes('issue')) {
                  segment = 'inactive';
                  segmentReason = 'Inactive customer with service issues noted';
                } else if (purchaseCount === 1) {
                  segment = 'new';
                  segmentReason = 'Customer with single purchase record';
                } else {
                  segment = 'low-engagement';
                  segmentReason = 'Customer with minimal recorded activity';
                }
              }

              newCustomers.push({
                id: `upload-${Date.now()}-${index}`,
                name: name,
                email: email || 'N/A',
                phone: phone || 'N/A',
                purchaseHistory: purchaseHistory || 'No purchase history available',
                segment: segment,
                segmentReason: segmentReason,
                totalSpent: totalSpent,
                lastPurchaseDate: totalSpent > 0 ?
                  new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000).toISOString().split('T')[0] :
                  'N/A'
              });
            }
          }
        });

        setCustomers(newCustomers);
        localStorage.setItem('customerData', JSON.stringify(newCustomers));

        toast({
          title: `Successfully imported ${newCustomers.length} customers!`,
          description: "Customer data has been intelligently processed and segmented."
        });

        setUploadFile(null);
      };

      reader.readAsText(uploadFile);

    } catch (error) {
      console.error('Error processing upload:', error);
      toast({
        title: "Upload Processing Failed",
        description: "Please check your file format and try again.",
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

  const handleDeleteCustomer = (customerId: string) => {
    setCustomers(prevCustomers => prevCustomers.filter(customer => customer.id !== customerId));
    toast({
      title: "Customer deleted",
      description: "Customer has been removed from your database."
    });
  };

  // Persist customer data to localStorage whenever customers change
  useEffect(() => {
    if (customers.length > 0) {
      localStorage.setItem('customerData', JSON.stringify(customers));
    }
  }, [customers]);

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



      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">Upload & Import</TabsTrigger>
          <TabsTrigger value="manage">Manage Customers</TabsTrigger>
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
                  The AI will automatically assign customers to segments based on spending patterns, frequency, and behavior. Hover over a segment badge to see its definition.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {segments.map((segment) => (
                    // FIX: Wrapped Badge and Info icon in a single div for consistent hover target
                    <div key={segment.value} className="relative group flex items-center justify-center">
                      <Badge className={`${segment.color} w-full justify-center cursor-help py-2`}>
                        {segment.label}
                        {/* Removed Info icon here as it's part of the main hover target now */}
                      </Badge>
                      {/* Tooltip for segment description, positioned relative to the group parent */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50 whitespace-nowrap pointer-events-none">
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
                            {editingCustomer && (
                              <Button
                                variant="destructive"
                                onClick={() => {
                                  handleDeleteCustomer(editingCustomer.id);
                                  setShowAddDialog(false);
                                  setEditingCustomer(null);
                                  setNewCustomer({ name: "", email: "", phone: "", purchaseHistory: "", segment: "new" });
                                }}
                                className="flex items-center gap-2"
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete
                              </Button>
                            )}
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
                          {/* FIX: Wrapped Badge and Info icon in a single relative div for consistent hover target */}
                          <div className="relative group flex items-center gap-2">
                            <Badge className={segmentInfo.color}>
                              {segmentInfo.label}
                            </Badge>
                            <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                            {/* Tooltip for segment reason, positioned relative to the group parent */}
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50 whitespace-nowrap pointer-events-none">
                              {customer.segmentReason}
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
