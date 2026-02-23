import { useState } from "react";
import { GlassCard } from "@/components/GlassCard";
import { ScoreGauge } from "@/components/ScoreGauge";
import { calculateCreditScore, getCreditRating, type CreditFactors } from "@/lib/financialEngines";
import { Slider } from "@/components/ui/slider";
import { motion } from "framer-motion";
import { Shield, TrendingUp, Lightbulb, FileText, ArrowDownToLine, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DocumentGeneratorModal } from "@/components/ActionModals";
import { toast } from "@/hooks/use-toast";

export default function CreditGraph() {
  const [factors, setFactors] = useState<CreditFactors>({
    savingsConsistency: 72,
    investmentDiscipline: 65,
    emiHistory: 80,
    expenseStability: 58,
    subscriptionConsistency: 70,
  });
  const [docOpen, setDocOpen] = useState(false);

  const score = calculateCreditScore(factors);
  const rating = getCreditRating(score);

  const updateFactor = (key: keyof CreditFactors, value: number) => {
    setFactors((prev) => ({ ...prev, [key]: value }));
  };

  const factorLabels: { key: keyof CreditFactors; label: string; desc: string }[] = [
    { key: "savingsConsistency", label: "Savings Consistency", desc: "Monthly savings regularity" },
    { key: "investmentDiscipline", label: "Investment Discipline", desc: "SIP & investment streak" },
    { key: "emiHistory", label: "EMI History", desc: "On-time payment track record" },
    { key: "expenseStability", label: "Expense Stability", desc: "Predictable spending pattern" },
    { key: "subscriptionConsistency", label: "Subscription Consistency", desc: "Bill payment regularity" },
  ];

  const suggestions = score < 750
    ? [
        "Maintain a consistent monthly savings habit for 6+ months",
        "Set up auto-pay for all EMIs and subscriptions",
        "Keep expense volatility below 15% month-to-month",
        "Start a SIP of any amount to build investment discipline",
      ]
    : [
        "Your credit profile is excellent! Keep it up.",
        "Consider increasing SIP contributions for wealth growth.",
      ];

  return (
    <div className="space-y-6 max-w-7xl">
      <DocumentGeneratorModal open={docOpen} onOpenChange={setDocOpen} />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Youth Credit Graph</h1>
          <p className="text-muted-foreground text-sm mt-1">Alternative credit scoring based on financial behavior</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="gradient" size="sm" onClick={() => setDocOpen(true)}>
            <FileText className="w-4 h-4" /> Credit Certificate
          </Button>
          <Button variant="neon" size="sm" onClick={() => toast({ title: "Score Shared!", description: "Your credit score has been shared with partnered lenders." })}>
            <Share2 className="w-4 h-4" /> Share Score
          </Button>
          <Button variant="outline" size="sm" onClick={() => toast({ title: "Report Downloaded", description: "Full credit analysis report saved." })}>
            <ArrowDownToLine className="w-4 h-4" /> Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard delay={0.1} className="flex flex-col items-center justify-center">
          <div className="flex items-center gap-2 mb-4 self-start">
            <Shield className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-muted-foreground">Credit Score</h3>
          </div>
          <div className="relative">
            <ScoreGauge score={score} maxScore={900} label={rating.label} color={rating.color} size={180} />
          </div>
          <div className="mt-4 px-4 py-2 rounded-full bg-muted/30 text-sm">
            <span className="text-muted-foreground">Rating: </span>
            <span className="font-semibold text-foreground">{rating.label}</span>
          </div>

          {/* Eligibility badges */}
          <div className="mt-4 w-full space-y-2">
            <p className="text-xs text-muted-foreground font-medium">Eligibility</p>
            {[
              { label: "Education Loan", eligible: score >= 600 },
              { label: "Credit Card", eligible: score >= 700 },
              { label: "Personal Loan", eligible: score >= 750 },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between p-2 rounded-lg bg-muted/20">
                <span className="text-xs text-foreground/80">{item.label}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${item.eligible ? 'bg-neon-emerald/20 text-neon-emerald' : 'bg-destructive/20 text-destructive'}`}>
                  {item.eligible ? '✓ Eligible' : '✗ Not Yet'}
                </span>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard delay={0.2} className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-muted-foreground">Behavioral Factors</h3>
          </div>
          <div className="space-y-5">
            {factorLabels.map((f) => (
              <div key={f.key}>
                <div className="flex justify-between text-sm mb-1.5">
                  <div>
                    <span className="text-foreground/80">{f.label}</span>
                    <span className="text-muted-foreground text-xs ml-2 hidden sm:inline">— {f.desc}</span>
                  </div>
                  <span className="mono text-foreground">{factors[f.key]}%</span>
                </div>
                <Slider value={[factors[f.key]]} onValueChange={([v]) => updateFactor(f.key, v)} min={0} max={100} step={1} />
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      <GlassCard delay={0.3}>
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-4 h-4 text-neon-amber" />
          <h3 className="text-sm font-semibold text-muted-foreground">Improvement Suggestions</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {suggestions.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="flex items-start gap-3 p-3 rounded-lg bg-muted/30"
            >
              <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-xs text-primary font-bold">{i + 1}</span>
              </div>
              <p className="text-sm text-foreground/80">{s}</p>
            </motion.div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
