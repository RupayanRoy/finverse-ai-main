import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import AICopilot from "@/pages/AICopilot";
import DebtIntelligence from "@/pages/DebtIntelligence";
import MicroInvesting from "@/pages/MicroInvesting";
import TaxIntelligence from "@/pages/TaxIntelligence";
import CreditGraph from "@/pages/CreditGraph";
import FinancialTwin from "@/pages/FinancialTwin";
import NotFound from "@/pages/NotFound";
import AdminTreasury from '@/pages/AdminTreasury';
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Main User Application with Sidebar */}
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/copilot" element={<AICopilot />} />
            <Route path="/debt" element={<DebtIntelligence />} />
            <Route path="/investing" element={<MicroInvesting />} />
            <Route path="/tax" element={<TaxIntelligence />} />
            <Route path="/credit" element={<CreditGraph />} />
            <Route path="/twin" element={<FinancialTwin />} />
          </Route>

          {/* Standalone Admin Treasury Portal */}
          {/* Keeping this outside Layout gives it that "Grand" Command Center feel */}
          <Route path="/admin" element={<AdminTreasury />} /> 

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;