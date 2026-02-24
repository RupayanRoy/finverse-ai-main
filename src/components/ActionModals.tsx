import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, Loader2, FileCheck, Landmark, ShieldCheck, ArrowRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useUser } from "@/context/UserContext";

interface ActionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuickTransferModal({ open, onOpenChange }: ActionModalProps) {
  const [selectedAccount, setSelectedAccount] = useState("Savings Account");
  const [amount, setAmount] = useState("5000");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const { updateSavings } = useUser();

  const handleSend = async () => {
    setLoading(true);
    const traceId = `TX-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    try {
      const response = await fetch("http://localhost:8001/api/treasury/relay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trace_id: traceId,
          destination: selectedAccount.toUpperCase().replace(" ", "_"),
          amount: parseFloat(amount),
        }),
      });

      if (!response.ok) throw new Error();
      
      updateSavings(-parseFloat(amount));
      setSent(true);
      toast({ title: "Relay Successful", description: `Trace ID: ${traceId}` });
    } catch (error) {
      toast({ title: "Failed", description: "Node Offline", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) setSent(false); }}>
      <DialogContent className="max-w-sm bg-[#0a0c10] text-white border-white/5">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold uppercase italic tracking-tighter">Quick Transfer</DialogTitle>
        </DialogHeader>

        {!sent ? (
          <div className="space-y-6 pt-4">
            <div className="grid grid-cols-2 gap-2">
              {["Savings Account", "SIP Fund", "Emergency Fund", "Goal Fund"].map((acc) => (
                <button 
                  key={acc} 
                  onClick={() => setSelectedAccount(acc)}
                  className={`p-3 rounded-lg border text-[10px] uppercase font-bold transition-all ${
                    selectedAccount === acc ? "bg-blue-500/20 border-blue-500 text-blue-400" : "bg-white/5 border-white/5 text-gray-500"
                  }`}
                >
                  {acc}
                </button>
              ))}
            </div>
            <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="bg-white/5 border-white/10" />
            <Button className="w-full bg-blue-600 font-black uppercase italic" onClick={handleSend} disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : "Initiate Handshake"}
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center py-8">
            <CheckCircle className="w-16 h-16 text-emerald-500 mb-4" />
            <h3 className="text-2xl font-black uppercase italic">Verified</h3>
            <Button className="mt-6 w-full" variant="outline" onClick={() => onOpenChange(false)}>Done</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function GrantSigningModal({ open, onOpenChange }: ActionModalProps) {
  const { userData, claimScholarship } = useUser();
  const [claiming, setClaiming] = useState(false);
  const scholarshipAmount = 25000;

  const approvedDocs = [
    { name: "Academic Transcript", status: "Verified", date: "2024-03-15" },
    { name: "Income Certificate", status: "Verified", date: "2024-03-18" },
    { name: "Identity Proof (Aadhar)", status: "Verified", date: "2024-03-10" },
  ];

  const handleClaim = () => {
    setClaiming(true);
    setTimeout(() => {
      claimScholarship(scholarshipAmount);
      setClaiming(false);
      onOpenChange(false);
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-[#0a0c10] text-white border-white/5">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold uppercase italic tracking-tighter flex items-center gap-2">
            <Landmark className="w-5 h-5 text-neon-emerald" />
            Scholarship Portal
          </DialogTitle>
          <DialogDescription className="text-gray-500">
            Review approved documents and claim your grant.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          <div className="space-y-3">
            <Label className="text-[10px] uppercase tracking-widest text-gray-500">Approved Documents</Label>
            {approvedDocs.map((doc) => (
              <div key={doc.name} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
                <div className="flex items-center gap-3">
                  <FileCheck className="w-4 h-4 text-neon-emerald" />
                  <div>
                    <p className="text-xs font-bold">{doc.name}</p>
                    <p className="text-[10px] text-gray-500">{doc.date}</p>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-neon-emerald/10 text-neon-emerald font-bold uppercase">
                  {doc.status}
                </span>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-neon-emerald/10 border border-neon-emerald/20 text-center">
            <p className="text-[10px] uppercase tracking-widest text-neon-emerald font-bold mb-1">Approved Grant Amount</p>
            <h2 className="text-3xl font-black italic">₹{scholarshipAmount.toLocaleString()}</h2>
          </div>

          {userData.scholarshipClaimed ? (
            <div className="flex flex-col items-center gap-2 py-2">
              <CheckCircle className="w-8 h-8 text-neon-emerald" />
              <p className="text-sm font-bold text-neon-emerald uppercase italic">Already Claimed</p>
            </div>
          ) : (
            <Button 
              className="w-full bg-neon-emerald hover:bg-neon-emerald/90 text-white font-black uppercase italic h-12"
              onClick={handleClaim}
              disabled={claiming}
            >
              {claiming ? <Loader2 className="animate-spin mr-2" /> : <ShieldCheck className="w-4 h-4 mr-2" />}
              {claiming ? "Processing..." : "Claim Scholarship"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function LoanApplicationModal({ open, onOpenChange }: ActionModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-[#0a0c10] text-white border-white/5">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold uppercase italic tracking-tighter">Loan Application</DialogTitle>
        </DialogHeader>
        <div className="py-8 text-center text-gray-500 font-mono text-xs uppercase tracking-widest">
          Module Initializing...
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function DocumentGeneratorModal({ open, onOpenChange }: ActionModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-[#0a0c10] text-white border-white/5">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold uppercase italic tracking-tighter">Document Engine</DialogTitle>
        </DialogHeader>
        <div className="py-8 text-center text-gray-500 font-mono text-xs uppercase tracking-widest">
          Generating Templates...
        </div>
      </DialogContent>
    </Dialog>
  );
}