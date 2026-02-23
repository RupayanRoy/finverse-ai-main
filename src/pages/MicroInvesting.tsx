import { useState } from "react";
import { GlassCard } from "@/components/GlassCard";
import { calculateSIPFutureValue, generateInvestmentProjection } from "@/lib/financialEngines";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { QuickTransferModal, DocumentGeneratorModal } from "@/components/ActionModals";
import { Play, Pause, TrendingUp, FileText, ArrowDownToLine, Zap, Target, ShieldCheck } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const RISK_PROFILES = {
  Low: { equity: 20, debt: 60, gold: 15, crypto: 5, return: 8 },
  Medium: { equity: 45, debt: 30, gold: 15, crypto: 10, return: 12 },
  High: { equity: 65, debt: 10, gold: 10, crypto: 15, return: 16 },
};

const COLORS = ["hsl(199, 89%, 48%)", "hsl(258, 60%, 55%)", "hsl(38, 92%, 50%)", "hsl(160, 84%, 39%)"];

const GOALS = [
  { id: "college", label: "College Fund", target: 1000000, current: 320000, icon: Target },
  { id: "travel", label: "Travel Fund", target: 200000, current: 85000, icon: Zap },
  { id: "emergency", label: "Emergency", target: 300000, current: 120000, icon: ShieldCheck },
];

export default function MicroInvesting() {
  const [sip, setSip] = useState(5000);
  const [years, setYears] = useState(10);
  const [risk, setRisk] = useState<keyof typeof RISK_PROFILES>("Medium");
  const [transferOpen, setTransferOpen] = useState(false);
  const [docOpen, setDocOpen] = useState(false);
  const [sipActive, setSipActive] = useState(true);

  const profile = RISK_PROFILES[risk];
  const futureValue = Math.round(calculateSIPFutureValue(sip, profile.return, years));
  const totalInvested = sip * years * 12;
  const gains = futureValue - totalInvested;
  const projection = generateInvestmentProjection(sip, profile.return, years);

  const allocation = [
    { name: "Equity", value: profile.equity },
    { name: "Debt", value: profile.debt },
    { name: "Gold", value: profile.gold },
    { name: "Crypto", value: profile.crypto },
  ];

  return (
    <div className="space-y-6 max-w-7xl">
      <QuickTransferModal open={transferOpen} onOpenChange={setTransferOpen} />
      <DocumentGeneratorModal open={docOpen} onOpenChange={setDocOpen} />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Micro-Investment Engine</h1>
          <p className="text-muted-foreground text-sm mt-1">Goal-based portfolio simulation & SIP projections</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={sipActive ? "destructive" : "gradient"}
            size="sm"
            onClick={() => {
              setSipActive(!sipActive);
              toast({ title: sipActive ? "SIP Paused" : "SIP Resumed", description: sipActive ? "Your SIP has been paused. Resume anytime." : "SIP of ₹" + sip.toLocaleString() + "/month is active." });
            }}
          >
            {sipActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {sipActive ? "Pause SIP" : "Resume SIP"}
          </Button>
          <Button variant="neon" size="sm" onClick={() => setTransferOpen(true)}>
            <TrendingUp className="w-4 h-4" /> Quick Invest
          </Button>
          <Button variant="outline" size="sm" onClick={() => setDocOpen(true)}>
            <FileText className="w-4 h-4" /> Report
          </Button>
        </div>
      </div>

      {/* Goals */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {GOALS.map((goal, i) => {
          const pct = Math.round((goal.current / goal.target) * 100);
          return (
            <GlassCard key={goal.id} delay={i * 0.1} className="!p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <goal.icon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{goal.label}</p>
                  <p className="text-xs text-muted-foreground">₹{(goal.current / 1000).toFixed(0)}k / ₹{(goal.target / 100000).toFixed(0)}L</p>
                </div>
              </div>
              <div className="w-full h-2 rounded-full bg-muted/50 overflow-hidden">
                <div className="h-full rounded-full bg-primary transition-all duration-700" style={{ width: `${pct}%` }} />
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-[10px] text-muted-foreground">{pct}% complete</span>
                <button
                  className="text-[10px] text-primary hover:underline"
                  onClick={() => setTransferOpen(true)}
                >
                  + Add Funds
                </button>
              </div>
            </GlassCard>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard delay={0.1}>
          <h3 className="text-sm font-semibold text-muted-foreground mb-6">Investment Parameters</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Monthly SIP</span>
                <span className="mono text-foreground">₹{sip.toLocaleString()}</span>
              </div>
              <Slider value={[sip]} onValueChange={([v]) => setSip(v)} min={500} max={50000} step={500} />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Duration</span>
                <span className="mono text-foreground">{years} years</span>
              </div>
              <Slider value={[years]} onValueChange={([v]) => setYears(v)} min={1} max={30} step={1} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-3">Risk Profile</p>
              <div className="flex gap-2">
                {(Object.keys(RISK_PROFILES) as Array<keyof typeof RISK_PROFILES>).map((r) => (
                  <button
                    key={r}
                    onClick={() => setRisk(r)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      risk === r ? "bg-primary/20 text-primary border border-primary/30" : "bg-muted/30 text-muted-foreground hover:bg-muted/50"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* SIP Status */}
          <div className={`mt-6 p-3 rounded-lg border ${sipActive ? 'bg-neon-emerald/5 border-neon-emerald/20' : 'bg-neon-amber/5 border-neon-amber/20'}`}>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${sipActive ? 'bg-neon-emerald animate-pulse' : 'bg-neon-amber'}`} />
              <span className="text-xs font-medium text-foreground">SIP {sipActive ? 'Active' : 'Paused'}</span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">
              {sipActive ? `₹${sip.toLocaleString()}/month auto-investing` : 'Tap Resume to restart auto-investing'}
            </p>
          </div>
        </GlassCard>

        <GlassCard delay={0.2} className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-muted-foreground">Projected Growth</h3>
            <Button variant="outline" size="sm" onClick={() => toast({ title: "Exported!", description: "Investment projection saved as PDF." })}>
              <ArrowDownToLine className="w-3 h-3" /> Export
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
            <div className="p-3 sm:p-4 rounded-lg bg-muted/30 text-center">
              <p className="text-[10px] sm:text-xs text-muted-foreground mb-1">Invested</p>
              <p className="stat-value text-lg sm:text-xl text-foreground">₹{(totalInvested / 100000).toFixed(1)}L</p>
            </div>
            <div className="p-3 sm:p-4 rounded-lg bg-muted/30 text-center">
              <p className="text-[10px] sm:text-xs text-muted-foreground mb-1">Future Value</p>
              <p className="stat-value text-lg sm:text-xl text-primary">₹{(futureValue / 100000).toFixed(1)}L</p>
            </div>
            <div className="p-3 sm:p-4 rounded-lg bg-muted/30 text-center">
              <p className="text-[10px] sm:text-xs text-muted-foreground mb-1">Wealth Gain</p>
              <p className="stat-value text-lg sm:text-xl text-neon-emerald">₹{(gains / 100000).toFixed(1)}L</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={projection}>
              <defs>
                <linearGradient id="valueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="year" stroke="hsl(215, 20%, 55%)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(215, 20%, 55%)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} />
              <Tooltip contentStyle={{ backgroundColor: "hsl(222, 40%, 10%)", border: "1px solid hsl(222, 20%, 18%)", borderRadius: "8px", fontSize: "12px" }} />
              <Area type="monotone" dataKey="invested" stroke="hsl(215, 20%, 55%)" fill="transparent" strokeWidth={1.5} strokeDasharray="5 5" />
              <Area type="monotone" dataKey="value" stroke="hsl(199, 89%, 48%)" fill="url(#valueGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>

      {/* Allocation */}
      <GlassCard delay={0.3}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-muted-foreground">Portfolio Allocation — {risk} Risk</h3>
          <Button variant="neon" size="sm" onClick={() => toast({ title: "Rebalanced!", description: "Portfolio has been rebalanced according to your risk profile." })}>
            Rebalance
          </Button>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-8">
          <div className="w-48 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={allocation} dataKey="value" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} strokeWidth={0}>
                  {allocation.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3">
            {allocation.map((item, i) => (
              <div key={item.name} className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                <span className="text-sm text-foreground/80 w-16">{item.name}</span>
                <span className="mono text-sm text-foreground">{item.value}%</span>
                <span className="text-xs text-muted-foreground">₹{((sip * item.value) / 100).toLocaleString()}/mo</span>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
