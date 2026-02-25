import { useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Button } from "./ui/button";
import { Trash2, CheckCircle } from "lucide-react";

interface SignaturePadProps {
  onSave: (signatureDataUrl: string) => void;
}

export function SignaturePad({ onSave }: SignaturePadProps) {
  // Using any for the ref to avoid strict type conflicts with the library's internal types in some environments
  const sigPad = useRef<any>(null);

  const clear = () => {
    sigPad.current?.clear();
  };

  const save = () => {
    if (!sigPad.current || sigPad.current.isEmpty()) return;
    
    // getTrimmedCanvas() is the method that was causing the error in the alpha version
    const canvas = sigPad.current.getTrimmedCanvas();
    const dataUrl = canvas.toDataURL("image/png");
    if (dataUrl) onSave(dataUrl);
  };

  return (
    <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10 space-y-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Digital Signature Pad</span>
        <button 
          type="button"
          onClick={clear} 
          className="text-neon-rose hover:text-neon-rose/80 transition-colors p-1"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      
      <div className="bg-white rounded-lg overflow-hidden h-40 border border-white/10">
        <SignatureCanvas
          ref={sigPad}
          penColor="black"
          canvasProps={{ 
            className: "signature-canvas",
            style: { width: '100%', height: '100%', cursor: 'crosshair' }
          }}
        />
      </div>

      <p className="text-[9px] text-muted-foreground italic text-center">
        Sign above using your mouse or touch screen
      </p>

      <Button 
        type="button"
        onClick={save}
        className="w-full bg-neon-emerald hover:bg-neon-emerald/90 text-white font-bold uppercase italic text-[10px]"
      >
        <CheckCircle className="w-4 h-4 mr-2" />
        Confirm Signature
      </Button>
    </div>
  );
}