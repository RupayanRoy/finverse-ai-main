import { useState } from "react";
import { GlassCard } from "@/components/GlassCard";
import { compareTaxRegimes } from "@/lib/financialEngines";
import { Slider } from "@/components/ui/slider";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { CheckCircle, AlertCircle, FileText, ArrowDownToLine, Calculator, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DocumentGeneratorModal } from "@/components/ActionModals";
import { toast } from "@/hooks/use-toast";

export default function TaxIntelligence() {
  const [salary, setSalary] = useState(600000);
  const [ded80C, setDed80C] = useState(150000);
  const [ded80D, setDed80D] = useState(25000);
  const [hra, setHra] = useState(120000);
  const [other, setOther] = useState(50000);
  const [docOpen, setDocOpen] = useState(false);

  const result = compareTaxRegimes({ salary, deductions80C: ded80C, deductions80D: ded80D, hra, otherDeductions: other });
  const chartData = [
    { regime: "Old Regime", tax: result.oldRegime },
    { regime: "New Regime", tax: result.newRegime },
  ];

  return (
    <div className="space-y-6 max-w-7xl">
      <DocumentGeneratorModal open={docOpen} onOpenChange={setDocOpen} />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Tax Intelligence</h1>
          <p className="text-muted-foreground text-sm mt-1">AI-powered tax regime comparison & optimization</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="gradient" size="sm" onClick={() => setDocOpen(true)}>
            <FileText className="w-4 h-4" /> Generate Tax Filing
          </Button>
          <Button variant="neon" size="sm" onClick={() => toast({ title: "Tax Filing Initiated", description: "Pre-filled ITR form is being prepared with your data." })}>
            <Send className="w-4 h-4" /> File ITR
          </Button>
          <Button variant="outline" size="sm" onClick={() => toast({ title: "Exported!", description: "Tax comparison report saved as PDF." })}>
            <ArrowDownToLine className="w-4 h-4" /> Export
          </Button>
        </div>
      </div>

      {/* Deduction Tracker */}
      <GlassCard delay={0.05} className="!p-4">
        <h3 className="text-sm font-semibold text-muted-foreground mb-3">Deduction Tracker</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "80C Used", current: ded80C, max: 150000, color: "bg-primary" },
            { label: "80D Used", current: ded80D, max: 100000, color: "bg-neon-violet" },
            { label: "HRA Claimed", current: hra, max: 300000, color: "bg-neon-emerald" },
            { label: "Other Ded.", current: other, max: 200000, color: "bg-neon-amber" },
          ].map((d) => {
            const pct = Math.round((d.current / d.max) * 100);
            return (
              <div key={d.label} className="p-3 rounded-lg bg-muted/20 border border-border">
                <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                  <span>{d.label}</span>
                  <span className="mono">{pct}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-muted/50 overflow-hidden">
                  <div className={`h-full rounded-full ${d.color} transition-all duration-500`} style={{ width: `${Math.min(pct, 100)}%` }} />
                </div>
                <p className="text-xs text-foreground mono mt-1">₹{(d.current / 1000).toFixed(0)}k / ₹{(d.max / 1000).toFixed(0)}k</p>
              </div>
            );
          })}
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard delay={0.1} className="lg:col-span-1">
          <h3 className="text-sm font-semibold text-muted-foreground mb-6">Income & Deductions</h3>
          <div className="space-y-5">
            {[
              { label: "Annual Salary", value: salary, set: setSalary, min: 200000, max: 5000000, step: 50000 },
              { label: "80C Deductions", value: ded80C, set: setDed80C, min: 0, max: 150000, step: 10000 },
              { label: "80D (Health)", value: ded80D, set: setDed80D, min: 0, max: 100000, step: 5000 },
              { label: "HRA Exemption", value: hra, set: setHra, min: 0, max: 300000, step: 10000 },
              { label: "Other Deductions", value: other, set: setOther, min: 0, max: 200000, step: 10000 },
            ].map((s) => (
              <div key={s.label}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">{s.label}</span>
                  <span className="mono text-foreground">₹{(s.value / 1000).toFixed(0)}k</span>
                </div>
                <Slider value={[s.value]} onValueChange={([v]) => s.set(v)} min={s.min} max={s.max} step={s.step} />
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard delay={0.2} className="lg:col-span-2">
          <h3 className="text-sm font-semibold text-muted-foreground mb-4">Tax Comparison</h3>

          <div className={`p-4 rounded-lg mb-6 flex items-start gap-3 ${result.recommended === 'new' ? 'bg-neon-emerald/10 border border-neon-emerald/20' : 'bg-primary/10 border border-primary/20'}`}>
            <CheckCircle className={`w-5 h-5 shrink-0 mt-0.5 ${result.recommended === 'new' ? 'text-neon-emerald' : 'text-primary'}`} />
            <div>
              <p className="text-sm font-semibold text-foreground">
                {result.recommended === 'new' ? 'New Regime' : 'Old Regime'} is better for you
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                You save ₹{result.savings.toLocaleString()} annually by choosing the {result.recommended} regime.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 rounded-lg bg-muted/30 text-center">
              <p className="text-xs text-muted-foreground mb-1">Old Regime Tax</p>
              <p className="stat-value text-xl text-foreground">₹{result.oldRegime.toLocaleString()}</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/30 text-center">
              <p className="text-xs text-muted-foreground mb-1">New Regime Tax</p>
              <p className="stat-value text-xl text-foreground">₹{result.newRegime.toLocaleString()}</p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={chartData}>
              <XAxis dataKey="regime" stroke="hsl(215, 20%, 55%)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(215, 20%, 55%)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ backgroundColor: "hsl(222, 40%, 10%)", border: "1px solid hsl(222, 20%, 18%)", borderRadius: "8px", fontSize: "12px" }} />
              <Bar dataKey="tax" radius={[6, 6, 0, 0]} barSize={60}>
                <Cell fill={result.recommended === 'old' ? "hsl(199, 89%, 48%)" : "hsl(215, 20%, 35%)"} />
                <Cell fill={result.recommended === 'new' ? "hsl(160, 84%, 39%)" : "hsl(215, 20%, 35%)"} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>

      {/* Tax Saving Tips */}
      <GlassCard delay={0.25}>
        <h3 className="text-sm font-semibold text-muted-foreground mb-3">💡 Tax Saving Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { tip: "Max out 80C by investing ₹" + ((150000 - ded80C) / 1000).toFixed(0) + "k more in ELSS/PPF", action: "Invest Now", cta: () => toast({ title: "Redirecting...", description: "Opening ELSS investment page." }) },
            { tip: "Get health insurance for ₹25k tax benefit under 80D", action: "Get Quote", cta: () => toast({ title: "Quote Requested", description: "Health insurance comparison will be sent to your email." }) },
            { tip: "Claim NPS additional ₹50,000 deduction under 80CCD(1B)", action: "Open NPS", cta: () => toast({ title: "NPS Portal", description: "Redirecting to NPS e-NPS portal." }) },
            { tip: "Submit rent receipts for HRA exemption claim", action: "Upload", cta: () => toast({ title: "Upload Receipts", description: "Upload portal opening — submit rent receipts for FY 2025-26." }) },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border">
              <p className="text-xs text-foreground/80 flex-1 mr-3">{item.tip}</p>
              <Button variant="neon" size="sm" className="shrink-0 text-xs" onClick={item.cta}>
                {item.action}
              </Button>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* ELI15 */}
      <GlassCard delay={0.3}>
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-neon-amber shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-2">Explain Like I'm 15 💡</h3>
            <p className="text-sm text-foreground/70 leading-relaxed">
              India has two tax systems. The <strong>Old Regime</strong> lets you subtract things like rent (HRA), insurance (80D), and investments (80C) from your salary before calculating tax — so you pay less if you have lots of deductions.
              The <strong>New Regime</strong> has lower tax rates but doesn't allow most deductions. If your deductions are small, the new regime usually wins. Your best option right now is the <strong>{result.recommended} regime</strong>, saving you <strong>₹{result.savings.toLocaleString()}</strong> per year.
            </p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
