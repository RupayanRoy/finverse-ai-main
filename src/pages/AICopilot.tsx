import { useState, useRef, useEffect } from "react";
import { GlassCard } from "@/components/GlassCard";
import { motion } from "framer-motion";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { PaymentAction } from "@/components/PaymentAction";
import { LoanDocument } from "@/components/LoanDocument";
import { LoanApplicationForm } from "@/components/LoanApplicationForm";

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
    
    // Detect Loan Intent
    if (/(need|want|get|apply|borrow)\s+(money|loan|funds|grant|scholarship)/.test(lower)) {
      setMessages((prev) => [...prev, { 
        role: "assistant", 
        content: "I can certainly help you with that. Please fill out the application details in the box below to get started.",
        showLoanForm: true
      }]);
      setIsTyping(false);
      return;
    }

    // Handle Payment Intent
    const paymentIntent = parsePaymentIntent(currentInput);
    if (paymentIntent) {
      setMessages((prev) => [...prev, { 
        role: "assistant", 
        content: `I've detected a request to transfer ₹${paymentIntent.amount} to ${paymentIntent.recipient}. Please authorize the transaction below using your secure code.`,
        paymentAction: paymentIntent
      }]);
      setIsTyping(false);
      return;
    }

    // Default Responses
    setMessages((prev) => [...prev, { role: "assistant", content: "I'm here to help! You can ask me about loans, investments, or even ask me to pay someone." }]);
    setIsTyping(false);
  };

  const handleLoanSubmit = (data: any) => {
    setMessages((prev) => [...prev, { 
      role: "assistant", 
      content: "Thank you. Your application has been generated. Here is your formal document for review:",
      generatedDoc: data
    }]);
  };

  function parsePaymentIntent(input: string) {
    const lower = input.toLowerCase();
    const amountMatch = lower.match(/(\d+)/);
    if (!amountMatch) return null;
    const amount = parseInt(amountMatch[1]);
    const hasAction = /(pay|send|transfer|give|remit|wire|move|dispatch)/.test(lower);
    if (!hasAction) return null;
    let recipientMatch = lower.match(/(?:pay|send|transfer|give|remit|move|wire)\s+\d+\s+(?:to\s+)?([\w\s]+)/);
    if (recipientMatch) {
      const recipient = recipientMatch[1].trim().split(/\s+/)[0];
      if (recipient) return { amount, recipient };
    }
    if (lower.includes("admin")) return { amount, recipient: "admin" };
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
                  <LoanDocument data={msg.generatedDoc} />
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