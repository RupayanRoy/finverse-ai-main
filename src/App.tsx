import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { AuthProvider } from "@/context/AuthContext";
import { UserProvider } from "@/context/UserContext";
import { AuthGuard } from "@/components/AuthGuard";
import Dashboard from "@/pages/Dashboard";
import AICopilot from "@/pages/AICopilot";
import DebtIntelligence from "@/pages/DebtIntelligence";
import MicroInvesting from "@/pages/MicroInvesting";
import TaxIntelligence from "@/pages/TaxIntelligence";
import CreditGraph from "@/pages/CreditGraph";
import FinancialTwin from "@/pages/FinancialTwin";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import NotFound from "@/pages/NotFound";
import AdminTreasury from '@/pages/AdminTreasury';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <UserProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected User Application */}
              <Route element={<AuthGuard />}>
                <Route element={<Layout />}>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/copilot" element={<AICopilot />} />
                  <Route path="/debt" element={<DebtIntelligence />} />
                  <Route path="/investing" element={<MicroInvesting />} />
                  <Route path="/tax" element={<TaxIntelligence />} />
                  <Route path="/credit" element={<CreditGraph />} />
                  <Route path="/twin" element={<FinancialTwin />} />
                </Route>
                <Route path="/admin" element={<AdminTreasury />} /> 
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </UserProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;