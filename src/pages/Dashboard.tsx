import { useState } from "react";
import { GlassCard } from "@/components/GlassCard";
import { ScoreGauge } from "@/components/ScoreGauge";
import { calculateHealthScore, forecastCashFlow } from "@/lib/financialEngines";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { TrendingUp, TrendingDown, Wallet, PiggyBank, CreditCard, Target, FileText, Landmark, ArrowUpRight, Send } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { LoanApplicationModal, DocumentGeneratorModal, GrantSigningModal, QuickTransferModal } from "@/components/ActionModals";
import { useUser } from "@/context/UserContext";

export default function Dashboard() {
  const { userData } = useUser();
  const [loanOpen, setLoanOpen] = useState(false);
  const [docOpen, setDocOpen] = useState(false);
  const [grantOpen, setGrantOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);

  const healthScore = calculateHealthScore(userData);
  const cashFlow = forecastCashFlow(userData.monthlyIncome, userData.monthlyExpenses, 5000, 12);

  const stats = [
    { label: "Monthly Income", value: `₹${userData.monthlyIncome.toLocaleString()}`, icon: Wallet, trend: "+8%", up: true },
    { label: "Monthly Expenses", value: `₹${userData.monthlyExpenses.toLocaleString()}`, icon: CreditCard, trend: "-3%", up: false },
    { label: "Total Savings", value: `₹${(userData.totalSavings / 1000).toFixed(1)}k`, icon: PiggyBank, trend: "+12%", up: true },
    { label: "Active Goals", value: "3", icon: Target, trend: "On Track", up: true },
  ];

  const spendingData = [
    { category: "Rent", amount: 10000 },
    { category: "Food", amount: 6000 },
    { category: "Transport", amount: 3000 },
    { category: "Education", amount: 4000 },
    { category: "Entertainment", amount: 2500 },
    { category: "Other", amount: 2500 },
  ];

  return (
    <div className="space-y-6 max-w-7xl">
      <LoanApplicationModal open={loanOpen} onOpenChange={setLoanOpen} />
      <DocumentGeneratorModal open={docOpen} onOpenChange={setDocOpen} />
      <GrantSigningModal open={grantOpen} onOpenChange={setGrantOpen} />
      <QuickTransferModal open={transferOpen} onOpenChange={setTransferOpen} />

      {/* Header */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Financial Overview</h1>
          <p className="text-muted-foreground text-sm mt-1">Your real-time financial health dashboard</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="gradient" size="sm" onClick={() => setLoanOpen(true)}>
            <Landmark className="w-4 h-4" /> Apply for Loan
          </Button>
          <Button variant="neon" size="sm" onClick={() => setDocOpen(true)}>
            <FileText className="w-4 h-4" /> Generate Docs
          </Button>
          <Button variant="success" size="sm" onClick={() => setGrantOpen(true)}>
            <ArrowUpRight className="w-4 h-4" /> {userData.scholarshipClaimed ? "View Grants" : "Sign Grants"}
          </Button>
          <Button variant="outline" size="sm" onClick={() => setTransferOpen(true)}>
            <Send className="w-4 h-4" /> Transfer
          </Button>
        </div>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat, i) => (
          <GlassCard key={stat.label} delay={i * 0.1} className="flex items-center gap-3 sm:gap-4 !p-4 sm:!p-6">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <stat.icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{stat.label}</p>
              <p className="font-bold text-foreground text-base sm:text-lg mono">{stat.value}</p>
            </div>
            <div className={`hidden sm:flex items-center gap-1 text-xs font-medium ${stat.up ? 'text-neon-emerald' : 'text-neon-rose'}`}>
              {stat.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {stat.trend}
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Quick Actions Row */}
      <GlassCard delay={0.2} className="!p-4">
        <h3 className="text-sm font-semibold text-muted-foreground mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { label: "Pay EMI", icon: CreditCard, desc: `₹${userData.emiAmount.toLocaleString()} due Mar 1`, action: () => setTransferOpen(true) },
            { label: "Claim Scholarship", icon: ArrowUpRight, desc: userData.scholarshipClaimed ? "Claimed" : "3 grants eligible", action: () => setGrantOpen(true) },
            { label: "Download Report", icon: FileText, desc: "Monthly summary", action: () => setDocOpen(true) },
            { label: "Refinance Loan", icon: Landmark, desc: "Save ₹42k interest", action: () => setLoanOpen(true) },
          ].map((item) => (
            <button
              key={item.label}
              onClick={item.action}
              className="flex flex-col items-center gap-2 p-3 sm:p-4 rounded-xl bg-muted/20 border border-border hover:bg-primary/10 hover:border-primary/30 transition-all duration-200 group"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm font-medium text-foreground">{item.label}</span>
              <span className="text-[10px] text-muted-foreground">{item.desc}</span>
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard delay={0.3} className="flex flex-col items-center justify-center relative">
          <h3 className="text-sm font-semibold text-muted-foreground mb-4 self-start">Financial Health</h3>
          <div className="relative">
            <ScoreGauge
              score={healthScore}
              maxScore={100}
              label="Health Score"
              color={healthScore > 70 ? "neon-emerald" : healthScore > 40 ? "neon-amber" : "destructive"}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-4 text-center">
            {healthScore > 70 ? "Strong financial position. Keep it up!" : healthScore > 40 ? "Room for improvement. Review spending." : "Attention needed. Reduce debt exposure."}
          </p>
        </GlassCard>

        <GlassCard delay={0.4} className="lg:col-span-2">
          <h3 className="text-sm font-semibold text-muted-foreground mb-4">12-Month Cash Flow Forecast</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={cashFlow}>
              <defs>
                <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(258, 60%, 55%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(258, 60%, 55%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" stroke="hsl(215, 20%, 55%)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(215, 20%, 55%)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
              <Tooltip contentStyle={{ backgroundColor: "hsl(222, 40%, 10%)", border: "1px solid hsl(222, 20%, 18%)", borderRadius: "8px", fontSize: "12px" }} />
              <Area type="monotone" dataKey="income" stroke="hsl(199, 89%, 48%)" fill="url(#incomeGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="expenses" stroke="hsl(258, 60%, 55%)" fill="url(#expenseGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>
    </div>
  );
}