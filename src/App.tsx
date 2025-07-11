import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Pricing from "./pages/Pricing";
import Dashboard from "./pages/Dashboard";
import BusinessProfile from "./pages/BusinessProfile";
import GenerateContent from "./pages/GenerateContent";
import MarketingCalendar from "./pages/MarketingCalendar";
import CustomerData from "./pages/CustomerData";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/pricing" element={<Pricing />} />
          
          {/* Protected routes with layout */}
          <Route path="/dashboard" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="business-profile" element={<BusinessProfile />} />
            <Route path="generate-content" element={<GenerateContent />} />
            <Route path="marketing-calendar" element={<MarketingCalendar />} />
            <Route path="customer-data" element={<CustomerData />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          
          {/* Redirect old routes */}
          <Route path="/business-profile" element={<Layout />}>
            <Route index element={<BusinessProfile />} />
          </Route>
          <Route path="/generate-content" element={<Layout />}>
            <Route index element={<GenerateContent />} />
          </Route>
          <Route path="/marketing-calendar" element={<Layout />}>
            <Route index element={<MarketingCalendar />} />
          </Route>
          <Route path="/customer-data" element={<Layout />}>
            <Route index element={<CustomerData />} />
          </Route>
          <Route path="/settings" element={<Layout />}>
            <Route index element={<Settings />} />
          </Route>
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
