import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Zap, ShieldCheck, Info } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Admin Credentials Check
    if (email === "admin@finverse.io" && password === "admin") {
      login("admin-jwt-token", { name: "Treasury Admin", email, role: 'admin' });
      toast({ title: "Admin Access Granted", description: "Opening Treasury Operations..." });
      navigate("/admin");
      return;
    }

    // Regular User Simulated Auth
    if (email && password) {
      const name = email.split('@')[0];
      login("user-jwt-token", { name: name.charAt(0).toUpperCase() + name.slice(1), email, role: 'user' });
      toast({ title: "Welcome back!", description: "Accessing Finverse OS..." });
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-blob" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] animate-blob" style={{ animationDelay: '2s' }} />
      </div>

      <GlassCard className="w-full max-w-md p-8 relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4">
            <Zap className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">FINVERSE OS</h1>
          <p className="text-sm text-muted-foreground">Enter your credentials to sync</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="name@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-muted/30 border-border/50"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-muted/30 border-border/50"
              required
            />
          </div>
          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
            INITIALIZE SESSION
          </Button>
        </form>

        <div className="mt-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 flex gap-3">
          <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
          <div className="text-[10px] text-blue-300/70 leading-relaxed">
            <p className="font-bold uppercase mb-1">Admin Access:</p>
            <p>Email: admin@finverse.io</p>
            <p>Password: admin</p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary hover:underline">Register Node</Link>
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-border/50 flex items-center justify-center gap-2 text-[10px] text-muted-foreground uppercase tracking-widest">
          <ShieldCheck className="w-3 h-3" />
          End-to-End Encrypted
        </div>
      </GlassCard>
    </div>
  );
}