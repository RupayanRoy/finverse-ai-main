import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, FileText, Send, Download, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ActionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// ===== Loan Application Modal =====
export function LoanApplicationModal({ open, onOpenChange }: ActionModalProps) {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
      toast({ title: "Loan Application Submitted!", description: "Your application is being processed. Track status in Debt Intelligence." });
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) setStep(0); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Apply for Education Loan</DialogTitle>
          <DialogDescription>Fill in your details to apply for a student loan</DialogDescription>
        </DialogHeader>

        {step === 0 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-muted-foreground">Full Name</Label>
              <Input placeholder="Enter your name" className="bg-muted/30 border-border" />
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground">Institution</Label>
              <Input placeholder="University / College name" className="bg-muted/30 border-border" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-muted-foreground">Loan Amount (₹)</Label>
                <Input type="number" placeholder="500000" className="bg-muted/30 border-border" />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Tenure (Years)</Label>
                <Input type="number" placeholder="5" className="bg-muted/30 border-border" />
              </div>
            </div>
            <Button variant="gradient" className="w-full" onClick={() => setStep(1)}>
              Continue <Send className="w-4 h-4" />
            </Button>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-muted-foreground">Annual Family Income (₹)</Label>
              <Input type="number" placeholder="600000" className="bg-muted/30 border-border" />
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground">Co-applicant Name</Label>
              <Input placeholder="Parent / Guardian name" className="bg-muted/30 border-border" />
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground">Purpose</Label>
              <Textarea placeholder="Describe purpose of loan..." className="bg-muted/30 border-border resize-none" rows={3} />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setStep(0)}>Back</Button>
              <Button variant="gradient" className="flex-1" onClick={handleSubmit} disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit Application"}
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col items-center py-6 text-center">
            <div className="w-16 h-16 rounded-full bg-neon-emerald/20 flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-neon-emerald" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Application Submitted!</h3>
            <p className="text-sm text-muted-foreground mb-4">Reference: FINV-{Date.now().toString().slice(-8)}</p>
            <p className="text-xs text-muted-foreground mb-6">You'll receive a confirmation within 24 hours. Track your application in the Debt Intelligence module.</p>
            <Button variant="neon" onClick={() => onOpenChange(false)}>Done</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ===== Document Generator Modal =====
export function DocumentGeneratorModal({ open, onOpenChange }: ActionModalProps) {
  const [docType, setDocType] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const docTypes = [
    { id: "loan-agreement", label: "Loan Agreement", desc: "Standard loan terms & conditions" },
    { id: "investment-report", label: "Investment Report", desc: "Portfolio performance summary" },
    { id: "tax-filing", label: "Tax Filing Document", desc: "Pre-filled tax return form" },
    { id: "credit-report", label: "Credit Report", desc: "Alternative credit score certificate" },
    { id: "financial-plan", label: "Financial Plan", desc: "Personalized financial roadmap" },
  ];

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
      toast({ title: "Document Generated!", description: `Your ${docTypes.find(d => d.id === docType)?.label} is ready to download.` });
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) { setDocType(null); setGenerated(false); } }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><FileText className="w-5 h-5 text-primary" /> Generate Document</DialogTitle>
          <DialogDescription>Create AI-powered financial documents</DialogDescription>
        </DialogHeader>

        {!generated ? (
          <div className="space-y-3">
            {docTypes.map((doc) => (
              <button
                key={doc.id}
                onClick={() => setDocType(doc.id)}
                className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${
                  docType === doc.id
                    ? "bg-primary/10 border-primary/30 text-foreground"
                    : "bg-muted/20 border-border hover:bg-muted/40 text-foreground/80"
                }`}
              >
                <p className="text-sm font-medium">{doc.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{doc.desc}</p>
              </button>
            ))}
            <Button variant="gradient" className="w-full mt-2" disabled={!docType || generating} onClick={handleGenerate}>
              {generating ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</> : "Generate Document"}
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center py-6 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Document Ready!</h3>
            <p className="text-xs text-muted-foreground mb-6">{docTypes.find(d => d.id === docType)?.label} has been generated with your financial data.</p>
            <div className="flex gap-3">
              <Button variant="neon" onClick={() => { toast({ title: "Downloaded!", description: "Document saved to your device." }); }}>
                <Download className="w-4 h-4" /> Download PDF
              </Button>
              <Button variant="outline" onClick={() => { setDocType(null); setGenerated(false); }}>
                Generate Another
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ===== Grant Signing Modal =====
export function GrantSigningModal({ open, onOpenChange }: ActionModalProps) {
  const [signed, setSigned] = useState(false);
  const [loading, setLoading] = useState(false);

  const grants = [
    { id: 1, name: "National Scholarship Portal", amount: "₹50,000/yr", status: "Eligible", deadline: "Mar 30, 2026" },
    { id: 2, name: "PM Vidyalakshmi Scheme", amount: "₹1,00,000", status: "Pre-approved", deadline: "Apr 15, 2026" },
    { id: 3, name: "State Merit Grant", amount: "₹25,000", status: "Eligible", deadline: "May 01, 2026" },
  ];

  const handleSign = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSigned(true);
      toast({ title: "Grant Agreement Signed!", description: "Your digital signature has been recorded. Funds will be disbursed within 15 days." });
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) setSigned(false); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Sign Grant Agreement</DialogTitle>
          <DialogDescription>Review and sign eligible grants & scholarships</DialogDescription>
        </DialogHeader>

        {!signed ? (
          <div className="space-y-3">
            {grants.map((grant) => (
              <div key={grant.id} className="p-3 rounded-lg bg-muted/20 border border-border">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-foreground">{grant.name}</p>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-neon-emerald/20 text-neon-emerald">{grant.status}</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">Amount: <span className="mono text-foreground">{grant.amount}</span></p>
                  <p className="text-xs text-muted-foreground">Deadline: {grant.deadline}</p>
                </div>
              </div>
            ))}

            <div className="p-3 rounded-lg bg-neon-amber/5 border border-neon-amber/20">
              <p className="text-xs text-neon-amber">⚠️ By signing, you agree to the terms and conditions of the selected grants. Digital signature will be timestamped and recorded.</p>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground">Digital Signature (Full Name)</Label>
              <Input placeholder="Type your full legal name" className="bg-muted/30 border-border font-mono" />
            </div>

            <Button variant="gradient" className="w-full" onClick={handleSign} disabled={loading}>
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing...</> : "Sign All Eligible Grants"}
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center py-6 text-center">
            <div className="w-16 h-16 rounded-full bg-neon-emerald/20 flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-neon-emerald" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">All Grants Signed!</h3>
            <p className="text-xs text-muted-foreground mb-2">Signed at: {new Date().toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mb-6">Disbursement will begin within 15 working days. Track status in your dashboard.</p>
            <Button variant="neon" onClick={() => onOpenChange(false)}>Done</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ===== Quick Transfer Modal =====
export function QuickTransferModal({ open, onOpenChange }: ActionModalProps) {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSend = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
      toast({ title: "Transfer Initiated!", description: "₹5,000 will be transferred within 2 hours." });
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) setSent(false); }}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Quick Transfer</DialogTitle>
          <DialogDescription>Send money to savings or investment account</DialogDescription>
        </DialogHeader>

        {!sent ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-muted-foreground">Transfer To</Label>
              <div className="grid grid-cols-2 gap-2">
                {["Savings Account", "SIP Fund", "Emergency Fund", "Goal Fund"].map((acc) => (
                  <button key={acc} className="p-2.5 rounded-lg bg-muted/20 border border-border text-xs text-foreground/80 hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-all">
                    {acc}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground">Amount (₹)</Label>
              <Input type="number" placeholder="5000" className="bg-muted/30 border-border mono" />
            </div>
            <Button variant="gradient" className="w-full" onClick={handleSend} disabled={loading}>
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</> : "Transfer Now"}
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center py-6 text-center">
            <div className="w-14 h-14 rounded-full bg-neon-emerald/20 flex items-center justify-center mb-4">
              <CheckCircle className="w-7 h-7 text-neon-emerald" />
            </div>
            <h3 className="text-base font-semibold text-foreground mb-1">Transfer Initiated!</h3>
            <p className="text-xs text-muted-foreground mb-4">Expected completion: ~2 hours</p>
            <Button variant="neon" size="sm" onClick={() => onOpenChange(false)}>Done</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
