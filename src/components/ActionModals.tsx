import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ActionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuickTransferModal({ open, onOpenChange }: ActionModalProps) {
  const [selectedAccount, setSelectedAccount] = useState("Savings Account");
  const [amount, setAmount] = useState("5000");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    setLoading(true);
    const traceId = `TX-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    try {
      // Fetching from the new Port 8001
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

// Stubs for other modals to prevent errors
export function LoanApplicationModal() { return null; }
export function DocumentGeneratorModal() { return null; }
export function GrantSigningModal() { return null; }