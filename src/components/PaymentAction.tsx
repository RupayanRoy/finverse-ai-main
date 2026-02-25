import { useState } from "react";
import { GlassCard } from "./GlassCard";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ShieldCheck, Loader2, CheckCircle, XCircle, ArrowRight } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { treasuryStore } from "@/lib/treasuryStore";
import { toast } from "@/hooks/use-toast";

interface PaymentActionProps {
  amount: number;
  recipient: string;
  onComplete: () => void;
}

export function PaymentAction({ amount, recipient, onComplete }: PaymentActionProps) {
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const { updateSavings, userData } = useUser();

  const handleTransfer = async () => {
    if (password !== "123") {
      setStatus('error');
      toast({ variant: "destructive", title: "Auth Failed", description: "Incorrect authorization code." });
      return;
    }

    if (userData.totalSavings < amount) {
      toast({ variant: "destructive", title: "Insufficient Funds", description: "Your balance is too low for this transfer." });
      return;
    }

    setStatus('loading');
    await new Promise(r => setTimeout(r, 1500));

    // Update User Balance
    updateSavings(-amount);

    // If recipient is admin, log in treasury
    if (recipient.toLowerCase().includes("admin")) {
      treasuryStore.addTransaction({
        trace_id: `AI-TX-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
        destination: "ADMIN_TREASURY",
        amount: amount,
      });
    }

    setStatus('success');
    toast({ title: "Transfer Complete", description: `₹${amount} sent to ${recipient}` });
    setTimeout(onComplete, 2000);
  };

  if (status === 'success') {
    return (
      <div className="mt-3 p-4 rounded-xl bg-neon-emerald/10 border border-neon-emerald/20 flex flex-col items-center text-center">
        <CheckCircle className="w-8 h-8 text-neon-emerald mb-2" />
        <p className="text-sm font-bold text-neon-emerald uppercase italic">Transaction Verified</p>
        <p className="text-[10px] text-muted-foreground mt-1">Funds have been successfully relayed.</p>
      </div>
    );
  }

  return (
    <div className="mt-3 p-4 rounded-xl bg-white/5 border border-white/10 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-primary" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Secure Payment Box</span>
        </div>
        <span className="text-[10px] font-mono text-primary">AUTH_REQUIRED</span>
      </div>

      <div className="flex items-center justify-between bg-black/20 p-3 rounded-lg border border-white/5">
        <div>
          <p className="text-[9px] uppercase text-muted-foreground">Recipient</p>
          <p className="text-xs font-bold text-white">{recipient.toUpperCase()}</p>
        </div>
        <ArrowRight className="w-4 h-4 text-muted-foreground" />
        <div className="text-right">
          <p className="text-[9px] uppercase text-muted-foreground">Amount</p>
          <p className="text-xs font-bold text-neon-emerald">₹{amount.toLocaleString()}</p>
        </div>
      </div>

      <div className="space-y-2">
        <Input
          type="password"
          placeholder="Enter Auth Code (123)"
          value={password}
          onChange={(e) => { setPassword(e.target.value); setStatus('idle'); }}
          className="bg-black/40 border-white/10 h-9 text-xs text-center tracking-[0.5em]"
        />
        <Button 
          onClick={handleTransfer} 
          disabled={status === 'loading' || !password}
          className="w-full h-9 bg-primary hover:bg-primary/90 text-white font-bold uppercase italic text-[10px]"
        >
          {status === 'loading' ? <Loader2 className="w-4 h-4 animate-spin" /> : "Authorize Transfer"}
        </Button>
      </div>

      {status === 'error' && (
        <div className="flex items-center gap-2 text-neon-rose justify-center">
          <XCircle className="w-3 h-3" />
          <span className="text-[9px] font-bold uppercase">Invalid Authorization Code</span>
        </div>
      )}
    </div>
  );
}