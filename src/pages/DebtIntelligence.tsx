import { useState } from "react";
import { GlassCard } from "@/components/GlassCard";
import { generateAmortization } from "@/lib/financialEngines";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { LoanApplicationModal, DocumentGeneratorModal } from "@/components/ActionModals";
import { FileText, Landmark, RefreshCw, ArrowDownToLine, Calculator } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function DebtIntelligence() {
  const [principal, setPrincipal] = useState(500000);
  const [rate, setRate] = useState(9);
  const [tenure, setTenure] = useState(60);
  const [loanOpen, setLoanOpen] = useState(false);
  const [docOpen, setDocOpen] = useState(false);

  const result = generateAmortization(principal, rate, tenure);
  const chartData = result.schedule.filter((_, i) => i % 3 === 0);

  // Refinance comparison
  const refinanceRate = Math.max(rate - 2, 4);
  const refinanceResult = generateAmortization(principal, refinanceRate, tenure);
  const refinanceSavings = result.totalInterest - refinanceResult.totalInterest;

  return (
    <div className="space-y-6 max-w-7xl">
      <LoanApplicationModal open={loanOpen} onOpenChange={setLoanOpen} />
      <DocumentGeneratorModal open={docOpen} onOpenChange={setDocOpen} />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Debt Intelligence</h1>
          <p className="text-muted-foreground text-sm mt-1">Smart loan analysis & optimization</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="gradient" size="sm" onClick={() => setLoanOpen(true)}>
            <Landmark className="w-4 h-4" /> Apply for Loan
          </Button>
          <Button variant="neon" size="sm" onClick={() => setDocOpen(true)}>
            <FileText className="w-4 h-4" /> Loan Agreement
          </Button>
          <Button variant="outline" size="sm" onClick={() => toast({ title: "Prepayment Scheduled", description: "₹20,000 prepayment will be processed on next EMI date." })}>
            <ArrowDownToLine className="w-4 h-4" /> Prepay EMI
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard delay={0.1}>
          <h3 className="text-sm font-semibold text-muted-foreground mb-6">Loan Parameters</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Loan Amount</span>
                <span className="mono text-foreground">₹{(principal / 100000).toFixed(1)}L</span>
              </div>
              <Slider value={[principal]} onValueChange={([v]) => setPrincipal(v)} min={100000} max={3000000} step={50000} className="py-1" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Interest Rate</span>
                <span className="mono text-foreground">{rate}%</span>
              </div>
              <Slider value={[rate]} onValueChange={([v]) => setRate(v)} min={4} max={20} step={0.5} className="py-1" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Tenure (months)</span>
                <span className="mono text-foreground">{tenure} mo</span>
              </div>
              <Slider value={[tenure]} onValueChange={([v]) => setTenure(v)} min={12} max={120} step={6} className="py-1" />
            </div>
          </div>
        </GlassCard>

        <GlassCard delay={0.2} className="lg:col-span-2">
          <h3 className="text-sm font-semibold text-muted-foreground mb-4">Loan Summary</h3>
          <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
            <div className="p-3 sm:p-4 rounded-lg bg-muted/30 text-center">
              <p className="text-[10px] sm:text-xs text-muted-foreground mb-1">Monthly EMI</p>
              <p className="stat-value text-lg sm:text-xl text-primary">₹{result.emi.toLocaleString()}</p>
            </div>
            <div className="p-3 sm:p-4 rounded-lg bg-muted/30 text-center">
              <p className="text-[10px] sm:text-xs text-muted-foreground mb-1">Total Interest</p>
              <p className="stat-value text-lg sm:text-xl text-neon-rose">₹{(result.totalInterest / 1000).toFixed(0)}k</p>
            </div>
            <div className="p-3 sm:p-4 rounded-lg bg-muted/30 text-center">
              <p className="text-[10px] sm:text-xs text-muted-foreground mb-1">Total Payment</p>
              <p className="stat-value text-lg sm:text-xl text-foreground">₹{(result.totalPayment / 100000).toFixed(1)}L</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="balGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" stroke="hsl(215, 20%, 55%)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(215, 20%, 55%)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
              <Tooltip contentStyle={{ backgroundColor: "hsl(222, 40%, 10%)", border: "1px solid hsl(222, 20%, 18%)", borderRadius: "8px", fontSize: "12px" }} />
              <Area type="monotone" dataKey="balance" stroke="hsl(199, 89%, 48%)" fill="url(#balGrad)" strokeWidth={2} />
              <Line type="monotone" dataKey="interest" stroke="hsl(350, 80%, 55%)" strokeWidth={1.5} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>

      {/* Refinance Card */}
      <GlassCard delay={0.25}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-neon-emerald/10 flex items-center justify-center shrink-0">
              <RefreshCw className="w-5 h-5 text-neon-emerald" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Refinance Opportunity</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Switch to {refinanceRate}% rate and save <span className="text-neon-emerald mono font-bold">₹{refinanceSavings.toLocaleString()}</span> in interest
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                New EMI: <span className="mono">₹{refinanceResult.emi.toLocaleString()}</span> (saves ₹{(result.emi - refinanceResult.emi).toLocaleString()}/month)
              </p>
            </div>
          </div>
          <Button variant="success" size="sm" onClick={() => toast({ title: "Refinance Request Sent", description: `Application for ${refinanceRate}% rate submitted. Expect confirmation in 48 hours.` })}>
            Apply to Refinance
          </Button>
        </div>
      </GlassCard>

      {/* Amortization Table */}
      <GlassCard delay={0.3}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-muted-foreground">Amortization Schedule</h3>
          <Button variant="outline" size="sm" onClick={() => toast({ title: "Exported!", description: "Amortization schedule downloaded as CSV." })}>
            <ArrowDownToLine className="w-3 h-3" /> Export
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="text-left py-2 font-medium">Month</th>
                <th className="text-right py-2 font-medium">EMI</th>
                <th className="text-right py-2 font-medium hidden sm:table-cell">Principal</th>
                <th className="text-right py-2 font-medium">Interest</th>
                <th className="text-right py-2 font-medium">Balance</th>
              </tr>
            </thead>
            <tbody>
              {result.schedule.filter((_, i) => i % 6 === 0).map((row) => (
                <tr key={row.month} className="border-b border-border/50 text-foreground/80">
                  <td className="py-2 mono">{row.month}</td>
                  <td className="text-right py-2 mono">₹{row.emi.toLocaleString()}</td>
                  <td className="text-right py-2 mono text-neon-emerald hidden sm:table-cell">₹{row.principal.toLocaleString()}</td>
                  <td className="text-right py-2 mono text-neon-rose">₹{row.interest.toLocaleString()}</td>
                  <td className="text-right py-2 mono">₹{row.balance.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
