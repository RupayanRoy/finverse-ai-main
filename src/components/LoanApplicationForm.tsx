import { useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { SignaturePad } from "./SignaturePad";
import { Landmark, Info } from "lucide-react";

interface LoanApplicationFormProps {
  onSubmit: (data: any) => void;
}

export function LoanApplicationForm({ onSubmit }: LoanApplicationFormProps) {
  const [step, setStep] = useState<'details' | 'signature'>('details');
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    purpose: "",
    income: "",
    tenure: "12",
  });

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.amount && formData.purpose && formData.income) {
      setStep('signature');
    }
  };

  const handleSignatureSave = (signatureDataUrl: string) => {
    onSubmit({ ...formData, signature: signatureDataUrl });
  };

  return (
    <div className="mt-4 p-5 rounded-xl bg-white/5 border border-white/10 space-y-4 w-full max-w-md">
      <div className="flex items-center gap-2 mb-2">
        <Landmark className="w-4 h-4 text-primary" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Treasury Application Portal</span>
      </div>

      {step === 'details' ? (
        <form onSubmit={handleNext} className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase text-muted-foreground">Full Name</Label>
              <Input 
                placeholder="Enter your name" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="bg-black/20 border-white/10 h-9 text-xs"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-[10px] uppercase text-muted-foreground">Amount (₹)</Label>
                <Input 
                  type="number"
                  placeholder="50000" 
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  className="bg-black/20 border-white/10 h-9 text-xs"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] uppercase text-muted-foreground">Tenure (Mo)</Label>
                <Input 
                  type="number"
                  placeholder="12" 
                  value={formData.tenure}
                  onChange={(e) => setFormData({...formData, tenure: e.target.value})}
                  className="bg-black/20 border-white/10 h-9 text-xs"
                  required
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase text-muted-foreground">Purpose</Label>
              <Input 
                placeholder="e.g. Education, Laptop" 
                value={formData.purpose}
                onChange={(e) => setFormData({...formData, purpose: e.target.value})}
                className="bg-black/20 border-white/10 h-9 text-xs"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase text-muted-foreground">Monthly Income</Label>
              <Input 
                type="number"
                placeholder="25000" 
                value={formData.income}
                onChange={(e) => setFormData({...formData, income: e.target.value})}
                className="bg-black/20 border-white/10 h-9 text-xs"
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-bold uppercase italic text-[10px] h-9">
            Proceed to Signature
          </Button>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/10 flex gap-3">
            <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <p className="text-[10px] text-blue-300/70 leading-relaxed">
              Reviewing application for <strong>₹{parseFloat(formData.amount).toLocaleString()}</strong>. Please sign below to finalize.
            </p>
          </div>
          <SignaturePad onSave={handleSignatureSave} />
          <Button 
            variant="ghost" 
            onClick={() => setStep('details')}
            className="w-full text-[10px] uppercase text-muted-foreground hover:text-white"
          >
            Back to Details
          </Button>
        </div>
      )}
    </div>
  );
}