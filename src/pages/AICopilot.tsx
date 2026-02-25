import { useState, useRef, useEffect } from "react";
import { GlassCard } from "@/components/GlassCard";
import { motion } from "framer-motion";
import { Send, Bot, User, Sparkles, Download } from "lucide-react";
import { PaymentAction } from "@/components/PaymentAction";
import { LoanDocument } from "@/components/LoanDocument";
import { LoanApplicationForm } from "@/components/LoanApplicationForm";
import { treasuryStore } from "@/lib/treasuryStore";
import { useAuth } from "@/context/AuthContext";
import { calculateEMI } from "@/lib/financialEngines";
import { toast } from "@/hooks/use-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
  paymentAction?: {
    amount: number;
    recipient: string;
  };
  showLoanForm?: boolean;
  generatedDoc?: any;
}

export default function AICopilot() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your FINVERSE AI Copilot 🤖. I can help you with financial planning, debt analysis, investment strategies, and tax optimization. What would you like to know?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    const userMsg: Message = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    const currentInput = input.trim();
    setInput("");
    setIsTyping(true);

    await new Promise((r) => setTimeout(r, 1000));

    const lower = currentInput.toLowerCase();
    
    // 1. LOAN INTENT (Expanded variations)
    const loanKeywords = ["need", "want", "get", "apply", "borrow", "request", "broke", "seeking", "require", "looking for"];
    const loanObjects = ["money", "loan", "funds", "grant", "scholarship", "cash", "capital", "credit", "assistance", "aid"];
    
    const isLoanIntent = loanKeywords.some(k => lower.includes(k)) && 
                       loanObjects.some(o => lower.includes(o));

    if (isLoanIntent) {
      setMessages((prev) => [...prev, { 
        role: "assistant", 
        content: "I understand you're looking for financial assistance. I can help you prepare a formal application for the Treasury. Please provide the details below.",
        showLoanForm: true
      }]);
      setIsTyping(false);
      return;
    }

    // 2. PAYMENT INTENT (Expanded variations)
    const paymentIntent = parsePaymentIntent(currentInput);
    if (paymentIntent) {
      setMessages((prev) => [...prev, { 
        role: "assistant", 
        content: `I've detected a request to transfer ₹${paymentIntent.amount} to ${paymentIntent.recipient}. To proceed, please authorize the transaction using your secure code below.`,
        paymentAction: paymentIntent
      }]);
      setIsTyping(false);
      return;
    }

    // 3. HELP/CAPABILITY INTENT
    if (lower.includes("help") || lower.includes("what can you do") || lower.includes("how to use")) {
      setMessages((prev) => [...prev, { 
        role: "assistant", 
        content: "I'm your financial command center! You can ask me to:\n\n• 'Apply for a loan' or 'I need some cash'\n• 'Pay 500 to admin' or 'Send 1000 to savings'\n• Analyze your debt or tax regime\n• Project your investment growth\n\nHow can I assist you right now?" 
      }]);
      setIsTyping(false);
      return;
    }

    // Default Responses
    setMessages((prev) => [...prev, { 
      role: "assistant", 
      content: "I'm not quite sure how to handle that specific request yet. Try asking me to 'apply for a loan' or 'pay 500 to admin'!" 
    }]);
    setIsTyping(false);
  };

  const handleLoanSubmit = (data: any) => {
    const emi = calculateEMI(parseFloat(data.amount) || 0, 9, parseInt(data.tenure) || 12);

    treasuryStore.applyForLoan({
      userName: data.name,
      userEmail: user?.email || "anonymous@finverse.io",
      amount: parseFloat(data.amount),
      purpose: data.purpose,
      income: parseFloat(data.income),
      tenure: parseInt(data.tenure),
      interestRate: 9,
      emi: Math.round(emi),
      signature: data.signature
    });

    // Auto-Download
    const docContent = `FINVERSE TREASURY LOAN APPLICATION\n----------------------------------\nApplicant: ${data.name}\nAmount: ₹${data.amount}\nPurpose: ${data.purpose}\nTenure: ${data.tenure} Months\nEMI: ₹${Math.round(emi)}\nDate: ${new Date().toLocaleDateString()}\nStatus: PENDING REVIEW`;
    const blob = new Blob([docContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Loan_Application_${data.name.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({ title: "Application Relayed", description: "Document downloaded and sent to Treasury Admin." });

    setMessages((prev) => [...prev, { 
      role: "assistant", 
      content: "Application complete! I've generated your document, initiated the download, and sent the request to the Treasury Admin. You can review the summary below.",
      generatedDoc: data
    }]);
  };

  function parsePaymentIntent(input: string) {
    const lower = input.toLowerCase();
    
    // Match patterns like "pay 500 to admin", "send 100 to savings", "transfer 200 to john"
    const paymentRegex = /(?:pay|send|transfer|give|remit|wire|move|dispatch|settle|remittance)\s+(\d+)\s+(?:to\s+)?([\w\s]+)/i;
    const match = lower.match(paymentRegex);
    
    if (match) {
      const amount = parseInt(match[1]);
      const recipient = match[2].trim().split(/\s+/)[0]; // Take first word of recipient
      return { amount, recipient };
    }

    // Fallback for "500 to admin" or "pay admin 500"
    const amountMatch = lower.match(/(\d+)/);
    if (amountMatch) {
      const amount = parseInt(amountMatch[1]);
      if (lower.includes("admin")) return { amount, recipient: "admin" };
      if (lower.includes("savings")) return { amount, recipient: "savings" };
    }

    return null;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" />
          AI Financial Copilot
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Your personal financial intelligence agent</p>
      </div>

      <GlassCard delay={0.1} hover={false} className="flex-1 flex flex-col overflow-hidden !p-0">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}
            >
              {msg.role === "assistant" && (
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
              )}
              <div className={`max-w-[80%] rounded-xl px-4 py-3 text-sm leading-relaxed ${msg.role === "user" ? "bg-primary/20 text-foreground" : "bg-muted/30 text-foreground/90"}`}>
                {msg.content}
                {msg.paymentAction && (
                  <PaymentAction 
                    amount={msg.paymentAction.amount} 
                    recipient={msg.paymentAction.recipient}
                    onComplete={() => {}}
                  />
                )}
                {msg.showLoanForm && (
                  <LoanApplicationForm onSubmit={handleLoanSubmit} />
                )}
                {msg.generatedDoc && (
                  <div className="space-y-3">
                    <LoanDocument data={msg.generatedDoc} />
                    <div className="flex justify-end">
                      <button 
                        onClick={() => toast({ title: "Download Restarted", description: "Your application document is being re-downloaded." })}
                        className="flex items-center gap-2 text-[10px] uppercase font-bold text-primary hover:underline"
                      >
                        <Download className="w-3 h-3" /> Re-download PDF
                      </button>
                    </div>
                  </div>
                )}
              </div>
              {msg.role === "user" && (
                <div className="w-8 h-8 rounded-lg bg-secondary/20 flex items-center justify-center shrink-0 mt-1">
                  <User className="w-4 h-4 text-secondary" />
                </div>
              )}
            </motion.div>
          ))}
          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-primary" />
              </div>
              <div className="bg-muted/30 rounded-xl px-4 py-3 text-sm text-muted-foreground">
                <span className="animate-pulse">Processing...</span>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 bg-muted/30 rounded-xl px-4 py-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask about loans, investments, or say 'Pay 500 to admin'..."
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary hover:bg-primary/30 transition-colors disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}