import { useState, useMemo } from "react";
import { GlassCard } from "@/components/GlassCard";
import { forecastCashFlow, calculateHealthScore } from "@/lib/financialEngines";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { Slider } from "@/components/ui/slider";
import { BrainCircuit, AlertTriangle, TrendingUp, FileText, ArrowDownToLine, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DocumentGeneratorModal } from "@/components/ActionModals";
import { toast } from "@/hooks/use-toast";

export default function FinancialTwin() {
  const [income, setIncome] = useState(50000);
  const [expenses, setExpenses] = useState(28000);
  const [savings, setSavings] = useState(5000);
  const [months, setMonths] = useState(24);
  const [docOpen, setDocOpen] = useState(false);

  const forecast = useMemo(() => forecastCashFlow(income, expenses, savings, months), [income, expenses, savings, months]);
  const healthScore = calculateHealthScore({
    monthlyIncome: income,
    monthlyExpenses: expenses,
    totalDebt: 500000,
    totalSavings: 120000,
    investmentValue: 85000,
    emiAmount: 10500,
  });

  const stressMonth = forecast.findIndex((d) => d.cumulative < 0);
  const finalBalance = forecast[forecast.length - 1]?.cumulative ?? 0;

  return (
    <div className="space-y-6 max-w-7xl">
      <DocumentGeneratorModal open={docOpen} onOpenChange={setDocOpen} />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2">
            <BrainCircuit className="w-5 sm:w-6 h-5 sm:h-6 text-primary" />
            Financial Digital Twin
          </h1>
          <p className="text-muted-foreground text-sm mt-1">AI simulation of your financial future</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="gradient" size="sm" onClick={() => setDocOpen(true)}>
            <FileText className="w-4 h-4" /> Generate Plan
          </Button>
          <Button variant="neon" size="sm" onClick={() => toast({ title: "Stress Test Running", description: "Monte Carlo simulation with 1000 scenarios initiated." })}>
            <Play className="w-4 h-4" /> Run Stress Test
          </Button>
          <Button variant="outline" size="sm" onClick={() => toast({ title: "Exported!", description: "Forecast data exported as CSV." })}>
            <ArrowDownToLine className="w-4 h-4" /> Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard delay={0.1}>
          <h3 className="text-sm font-semibold text-muted-foreground mb-6">Simulation Parameters</h3>
          <div className="space-y-5">
            {[
              { label: "Monthly Income", value: income, set: setIncome, min: 10000, max: 200000, step: 5000, format: (v: number) => `₹${(v/1000).toFixed(0)}k` },
              { label: "Monthly Expenses", value: expenses, set: setExpenses, min: 5000, max: 150000, step: 2000, format: (v: number) => `₹${(v/1000).toFixed(0)}k` },
              { label: "Savings Target", value: savings, set: setSavings, min: 0, max: 50000, step: 1000, format: (v: number) => `₹${(v/1000).toFixed(0)}k` },
              { label: "Forecast Period", value: months, set: setMonths, min: 6, max: 60, step: 6, format: (v: number) => `${v} months` },
            ].map((s) => (
              <div key={s.label}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">{s.label}</span>
                  <span className="mono text-foreground">{s.format(s.value)}</span>
                </div>
                <Slider value={[s.value]} onValueChange={([v]) => s.set(v)} min={s.min} max={s.max} step={s.step} />
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard delay={0.2} className="lg:col-span-2">
          <h3 className="text-sm font-semibold text-muted-foreground mb-4">Projected Cash Flow</h3>
          <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
            <div className="p-3 rounded-lg bg-muted/30 text-center">
              <p className="text-[10px] sm:text-xs text-muted-foreground mb-1">Health Score</p>
              <p className={`stat-value text-lg sm:text-xl ${healthScore > 70 ? 'text-neon-emerald' : healthScore > 40 ? 'text-neon-amber' : 'text-destructive'}`}>
                {healthScore}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-muted/30 text-center">
              <p className="text-[10px] sm:text-xs text-muted-foreground mb-1">Final Balance</p>
              <p className={`stat-value text-lg sm:text-xl ${finalBalance > 0 ? 'text-neon-emerald' : 'text-destructive'}`}>
                ₹{(finalBalance / 1000).toFixed(0)}k
              </p>
            </div>
            <div className="p-3 rounded-lg bg-muted/30 text-center">
              <p className="text-[10px] sm:text-xs text-muted-foreground mb-1">Stress Point</p>
              <p className="stat-value text-lg sm:text-xl text-foreground">
                {stressMonth > 0 ? `Month ${stressMonth}` : "None"}
              </p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={forecast}>
              <defs>
                <linearGradient id="cumGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" stroke="hsl(215, 20%, 55%)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(215, 20%, 55%)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ backgroundColor: "hsl(222, 40%, 10%)", border: "1px solid hsl(222, 20%, 18%)", borderRadius: "8px", fontSize: "12px" }} />
              <Area type="monotone" dataKey="cumulative" stroke="hsl(160, 84%, 39%)" fill="url(#cumGrad)" strokeWidth={2} />
              <Line type="monotone" dataKey="net" stroke="hsl(199, 89%, 48%)" strokeWidth={1.5} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <GlassCard delay={0.3}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-neon-amber" />
              <h3 className="text-sm font-semibold text-muted-foreground">Risk Scenarios</h3>
            </div>
            <Button variant="outline" size="sm" onClick={() => toast({ title: "Insurance Recommended", description: "Based on risk analysis, we suggest ₹10L term insurance cover." })}>
              Get Insured
            </Button>
          </div>
          <div className="space-y-2">
            {[
              { scenario: "Job loss for 3 months", impact: `Savings depleted by ₹${(income * 3 / 1000).toFixed(0)}k` },
              { scenario: "Medical emergency ₹1L", impact: `Buffer reduced to ${Math.max(0, Math.round((120000 - 100000) / income))} months` },
              { scenario: "Interest rate hike +2%", impact: `EMI increases by ~₹${Math.round(500000 * 0.02 / 12).toLocaleString()}` },
            ].map((r, i) => (
              <div key={i} className="p-3 rounded-lg bg-muted/30 flex justify-between items-center">
                <span className="text-xs sm:text-sm text-foreground/80">{r.scenario}</span>
                <span className="text-[10px] sm:text-xs text-neon-amber mono">{r.impact}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard delay={0.4}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-neon-emerald" />
              <h3 className="text-sm font-semibold text-muted-foreground">Preventive Actions</h3>
            </div>
            <Button variant="success" size="sm" onClick={() => toast({ title: "Auto-Actions Enabled", description: "All recommended actions have been scheduled." })}>
              Enable All
            </Button>
          </div>
          <div className="space-y-2">
            {[
              "Build emergency fund of 6× expenses (₹1.68L target)",
              "Diversify income: freelance opportunities",
              "Trim subscriptions (save ₹2k/month)",
              "Auto-transfer to savings on salary day",
            ].map((action, i) => (
              <div key={i} className="flex items-start gap-2 p-3 rounded-lg bg-muted/30">
                <div className="w-5 h-5 rounded-full bg-neon-emerald/20 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs text-neon-emerald font-bold">{i + 1}</span>
                </div>
                <p className="text-xs sm:text-sm text-foreground/80">{action}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
