import { useState, useRef, useEffect } from "react";
import { GlassCard } from "@/components/GlassCard";
import { motion } from "framer-motion";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { PaymentAction } from "@/components/PaymentAction";

interface Message {
  role: "user" | "assistant";
  content: string;
  paymentAction?: {
    amount: number;
    recipient: string;
  };
}

const INITIAL_MESSAGES: Message[] = [
  {
    role: "assistant",
    content: "Hello! I'm your FINVERSE AI Copilot 🤖. I can help you with financial planning, debt analysis, investment strategies, and tax optimization. What would you like to know?",
  },
];

const SAMPLE_RESPONSES: Record<string, string> = {
  loan: "Based on your current profile (₹50,000 income, ₹5L loan at 9%), your EMI of ₹10,379 consumes 20.8% of income. This is within the safe 30% threshold.\n\n📊 **Recommendation:** Consider prepaying ₹2,000/month extra — this would save ₹42,000 in interest and close the loan 8 months early.",
  invest: "With ₹5,000 monthly SIP at 12% CAGR over 10 years:\n\n• **Invested:** ₹6,00,000\n• **Projected Value:** ₹11,61,695\n• **Wealth Gain:** ₹5,61,695\n\n🎯 For your age group, I recommend a **60:25:10:5** split across Equity, Debt, Gold & Crypto.",
  tax: "For a ₹6L salary with ₹1.5L in 80C deductions:\n\n• **Old Regime:** ₹23,400 tax\n• **New Regime:** ₹15,600 tax\n\n✅ **New Regime saves you ₹7,800/year.** Since your deductions are moderate, the new regime's lower slabs work in your favor.",
  credit: "Your alternative credit score is **738/900** (Good). Here's what's working:\n\n✅ EMI history: 80% — Strong\n✅ Savings consistency: 72% — Good\n⚠️ Expense stability: 58% — Needs work\n\n💡 Tip: Reducing month-to-month expense variance by 15% could boost your score to 780+.",
  default: "That's a great question! Based on your financial profile, here are some key insights:\n\n1. Your savings rate of 44% is excellent\n2. Debt-to-income ratio is manageable\n3. Consider diversifying investments\n\nWould you like me to dive deeper into any specific area — debt, investments, tax, or credit?",
};

function parsePaymentIntent(input: string) {
  const lower = input.toLowerCase();
  
  // Extract amount
  const amountMatch = lower.match(/(\d+)/);
  if (!amountMatch) return null;
  const amount = parseInt(amountMatch[1]);

  // Check for action verbs
  const hasAction = /(pay|send|transfer|give|remit|wire|move|dispatch)/.test(lower);
  if (!hasAction) return null;

  // Try to find recipient
  // Pattern 1: "pay [amount] to [recipient]" or "send [amount] to [recipient]"
  let recipientMatch = lower.match(/(?:pay|send|transfer|give|remit|move|wire)\s+\d+\s+(?:to\s+)?([\w\s]+)/);
  if (recipientMatch) {
    const recipient = recipientMatch[1].trim().split(/\s+/)[0]; // Take first word of recipient
    if (recipient) return { amount, recipient };
  }

  // Pattern 2: "pay [recipient] [amount]"
  recipientMatch = lower.match(/(?:pay|send|transfer|give|remit|move|wire)\s+([\w\s]+)\s+\d+/);
  if (recipientMatch) {
    const recipient = recipientMatch[1].trim().replace(/\s+to$/, "").split(/\s+/).pop(); // Take last word before amount
    if (recipient) return { amount, recipient };
  }

  // Fallback: if "admin" is mentioned anywhere with an amount and action
  if (lower.includes("admin")) return { amount, recipient: "admin" };

  return null;
}

function getResponse(input: string): string {
  const lower = input.toLowerCase();
  
  // Check for payment intent first to give it priority
  const payment = parsePaymentIntent(input);
  if (payment) {
    return `I've detected a request to transfer ₹${payment.amount} to ${payment.recipient}. Please authorize the transaction below using your secure code.`;
  }

  if (lower.includes("loan") || lower.includes("debt") || lower.includes("emi")) return SAMPLE_RESPONSES.loan;
  if (lower.includes("invest") || lower.includes("sip") || lower.includes("mutual")) return SAMPLE_RESPONSES.invest;
  if (lower.includes("tax") || lower.includes("regime") || lower.includes("80c")) return SAMPLE_RESPONSES.tax;
  if (lower.includes("credit") || lower.includes("score")) return SAMPLE_RESPONSES.credit;
  
  return SAMPLE_RESPONSES.default;
}

export default function AICopilot() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
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
    setInput("");
    setIsTyping(true);

    // Simulate typing delay
    await new Promise((r) => setTimeout(r, 1000 + Math.random() * 1000));
    
    const paymentIntent = parsePaymentIntent(userMsg.content);
    const response = getResponse(userMsg.content);
    
    setMessages((prev) => [...prev, { 
      role: "assistant", 
      content: response,
      paymentAction: paymentIntent || undefined
    }]);
    setIsTyping(false);
  };

  const quickPrompts = [
    "Pay 500 to admin",
    "Send 1000 to John",
    "How should I invest ₹5,000/month?",
    "Which tax regime is better for me?",
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" />
          AI Financial Copilot
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Your personal financial intelligence agent</p>
      </div>

      {/* Chat area */}
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
              <div
                className={`max-w-[80%] rounded-xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-primary/20 text-foreground"
                    : "bg-muted/30 text-foreground/90"
                }`}
              >
                {msg.content}
                {msg.paymentAction && (
                  <PaymentAction 
                    amount={msg.paymentAction.amount} 
                    recipient={msg.paymentAction.recipient}
                    onComplete={() => {
                      // Optional: Add a follow-up message
                    }}
                  />
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
                <span className="animate-pulse">Analyzing your request...</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick prompts */}
        {messages.length <= 1 && (
          <div className="px-6 pb-3 flex flex-wrap gap-2">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => { setInput(prompt); }}
                className="text-xs px-3 py-1.5 rounded-full bg-muted/30 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors border border-border/50"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
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