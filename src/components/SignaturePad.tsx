import { useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Button } from "./ui/button";
import { Trash2, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface SignaturePadProps {
  onSave: (signatureDataUrl: string) => void;
}

export function SignaturePad({ onSave }: SignaturePadProps) {
  const sigPad = useRef<any>(null);

  const clear = () => {
    if (sigPad.current) {
      sigPad.current.clear();
    }
  };

  const save = () => {
    if (!sigPad.current) {
      toast({ 
        variant: "destructive", 
        title: "System Error", 
        description: "Signature pad not initialized. Please refresh." 
      });
      return;
    }

    if (sigPad.current.isEmpty()) {
      toast({ 
        variant: "destructive", 
        title: "Signature Required", 
        description: "Please provide a signature before confirming." 
      });
      return;
    }

    try {
      // Use the standard data URL method which is more reliable across environments
      const dataUrl = sigPad.current.getCanvas().toDataURL("image/png");
      
      if (dataUrl) {
        onSave(dataUrl);
        toast({ title: "Signature Captured", description: "Finalizing your application..." });
      }
    } catch (error) {
      console.error("Signature capture failed:", error);
      toast({ 
        variant: "destructive", 
        title: "Capture Failed", 
        description: "Could not process signature. Please try again." 
      });
    }
  };

  return (
    <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10 space-y-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Digital Signature Pad</span>
        </div>
        <button 
          type="button"
          onClick={clear} 
          className="text-neon-rose hover:text-neon-rose/80 transition-colors p-1"
          title="Clear Signature"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      
      <div className="bg-white rounded-lg overflow-hidden h-40 border border-white/10 shadow-inner">
        <SignatureCanvas
          ref={sigPad}
          penColor="black"
          canvasProps={{ 
            className: "signature-canvas",
            style: { width: '100%', height: '100%', cursor: 'crosshair' }
          }}
        />
      </div>

      <div className="flex items-center gap-2 justify-center text-[9px] text-muted-foreground italic">
        <AlertCircle className="w-3 h-3" />
        Sign above using your mouse or touch screen
      </div>

      <Button 
        type="button"
        onClick={save}
        className="w-full bg-neon-emerald hover:bg-neon-emerald/90 text-white font-bold uppercase italic text-[10px] h-10 shadow-lg shadow-neon-emerald/20"
      >
        <CheckCircle className="w-4 h-4 mr-2" />
        Confirm Signature
      </Button>
    </div>
  );
}