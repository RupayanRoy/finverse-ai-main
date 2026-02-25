import { GlassCard } from "./GlassCard";
import { FileText, ShieldCheck } from "lucide-react";

interface LoanDocumentProps {
  data: {
    name: string;
    purpose: string;
    amount: string;
    income: string;
    tenure: string;
    signature: string;
  };
}

export function LoanDocument({ data }: LoanDocumentProps) {
  const date = new Date().toLocaleDateString();

  return (
    <div className="mt-4 p-6 rounded-xl bg-white text-slate-900 font-serif shadow-2xl border-t-4 border-primary">
      <div className="flex justify-between items-start mb-8 border-b pb-4">
        <div>
          <h2 className="text-xl font-bold uppercase tracking-tighter text-primary">FINVERSE TREASURY</h2>
          <p className="text-[10px] font-sans text-slate-500 uppercase tracking-widest">Financial Assistance Application</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-sans text-slate-500">DATE: {date}</p>
          <p className="text-[10px] font-sans text-slate-500">REF: APP-{Math.random().toString(36).substring(2, 8).toUpperCase()}</p>
        </div>
      </div>

      <div className="space-y-4 text-sm">
        <p><strong>Applicant Name:</strong> {data.name}</p>
        <p><strong>Requested Amount:</strong> ₹{parseFloat(data.amount).toLocaleString()}</p>
        <p><strong>Purpose of Funds:</strong> {data.purpose}</p>
        <p><strong>Monthly Income/Allowance:</strong> ₹{parseFloat(data.income).toLocaleString()}</p>
        <p><strong>Proposed Tenure:</strong> {data.tenure} Months</p>

        <div className="mt-8 pt-8 border-t border-slate-200">
          <p className="text-xs leading-relaxed italic text-slate-600">
            "I, <strong>{data.name}</strong>, hereby declare that the information provided above is true and correct to the best of my knowledge. I understand that this application is subject to Treasury review and approval based on my Finverse Credit Graph."
          </p>
        </div>

        <div className="mt-8 flex flex-col items-end">
          <div className="w-48 h-20 border-b border-slate-400 flex items-center justify-center mb-2">
            <img src={data.signature} alt="Signature" className="max-h-full max-w-full object-contain" />
          </div>
          <p className="text-[10px] font-sans uppercase tracking-widest text-slate-500">Digital Signature</p>
        </div>
      </div>

      <div className="mt-8 pt-4 border-t border-slate-100 flex items-center gap-2 text-[9px] font-sans text-slate-400 uppercase tracking-widest">
        <ShieldCheck className="w-3 h-3" />
        Verified via Finverse OS Blockchain Relay
      </div>
    </div>
  );
}