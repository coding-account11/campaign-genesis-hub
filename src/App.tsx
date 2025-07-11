import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Contact from "./pages/Contact";
import Pricing from "./pages/Pricing";
import Dashboard from "./pages/NewDashboard";
import BusinessProfile from "./pages/BusinessProfile";
import GenerateContent from "./pages/GenerateContent";
import MarketingCalendar from "./pages/MarketingCalendar";
import CustomerData from "./pages/CustomerData";
import Settings from "./pages/Settings";
import Support from "./pages/Support";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Landing and Auth routes (no layout) */}
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/pricing" element={<Pricing />} />
          
          {/* Dashboard routes (with layout) */}
          <Route path="/dashboard" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="business-profile" element={<BusinessProfile />} />
            <Route path="generate-content" element={<GenerateContent />} />
            <Route path="marketing-calendar" element={<MarketingCalendar />} />
            <Route path="customer-data" element={<CustomerData />} />
            <Route path="settings" element={<Settings />} />
            <Route path="support" element={<Support />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
