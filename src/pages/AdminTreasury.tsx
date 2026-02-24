import React, { useEffect, useState } from 'react';
import { GlassCard } from '@/components/GlassCard'; 
import { 
  Cpu, Activity, ShieldCheck, Landmark, User, Check, X, 
  Clock, LogOut, Zap, Terminal, Database, Globe, Server
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { treasuryStore, type Transaction, type LoanRequest } from "@/lib/treasuryStore";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminTreasury() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [ledger, setLedger] = useState<Transaction[]>([]);
  const [loans, setLoans] = useState<LoanRequest[]>([]);
  const [systemTime, setSystemTime] = useState(new Date().toLocaleTimeString());

  const refreshData = () => {
    setLedger(treasuryStore.getLedger());
    setLoans(treasuryStore.getLoans());
  };

  const handleLogout = () => {
    logout();
    toast({ title: "Session Terminated", description: "Admin node disconnected." });
    navigate("/login");
  };

  const updateLoanStatus = (id: string, status: 'APPROVED' | 'REJECTED') => {
    treasuryStore.updateLoanStatus(id, status);
    toast({ title: `Loan ${status}`, description: `Request ${id} has been processed.` });
    refreshData();
  };

  useEffect(() => {
    refreshData();
    const interval = setInterval(() => {
      refreshData();
      setSystemTime(new Date().toLocaleTimeString());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const totalVolume = ledger.reduce((a, b) => a + (b.amount || 0), 0);

  return (
    <div className="min-h-screen bg-[#02040a] text-slate-200 font-mono selection:bg-primary/30">
      {/* Top Navigation Bar */}
      <header className="h-16 border-b border-white/5 bg-black/40 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30 shadow-[0_0_15px_rgba(0,180,216,0.2)]">
            <Zap className="w-6 h-6 text-primary animate-pulse" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-black tracking-tighter uppercase italic text-white leading-none">FINVERSE OS</h1>
            <span className="text-[9px] text-primary font-bold tracking-[0.4em] uppercase">Treasury Command</span>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="hidden md:flex items-center gap-6 text-[10px] tracking-widest text-slate-500 uppercase font-bold">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              SYSTEM_STABLE
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-3 h-3" />
              RELAY_ACTIVE
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-3 h-3" />
              {systemTime}
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLogout}
            className="border-rose-500/20 text-rose-500 hover:bg-rose-500/10 font-bold uppercase text-[10px] tracking-widest h-8"
          >
            <LogOut className="w-3 h-3 mr-2" />
            Terminate
          </Button>
        </div>
      </header>

      <main className="p-8 max-w-[1600px] mx-auto space-y-8">
        {/* System Overview Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <GlassCard className="!p-5 border-l-4 border-l-primary bg-primary/5">
            <div className="flex justify-between items-start mb-4">
              <Database className="w-5 h-5 text-primary" />
              <span className="text-[9px] font-bold text-primary/60 uppercase tracking-widest">Ledger Volume</span>
            </div>
            <h2 className="text-2xl font-black text-white">₹{(totalVolume || 0).toLocaleString()}</h2>
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }} 
                  animate={{ width: '65%' }} 
                  className="h-full bg-primary" 
                />
              </div>
              <span className="text-[9px] text-slate-500">65% CAP</span>
            </div>
          </GlassCard>

          <GlassCard className="!p-5 border-l-4 border-l-emerald-500 bg-emerald-500/5">
            <div className="flex justify-between items-start mb-4">
              <Activity className="w-5 h-5 text-emerald-500" />
              <span className="text-[9px] font-bold text-emerald-500/60 uppercase tracking-widest">Relay Status</span>
            </div>
            <h2 className="text-2xl font-black text-white">ACTIVE</h2>
            <p className="text-[10px] text-emerald-500/70 mt-1 font-bold">LATENCY: 14ms</p>
          </GlassCard>

          <GlassCard className="!p-5 border-l-4 border-l-amber-500 bg-amber-500/5">
            <div className="flex justify-between items-start mb-4">
              <Landmark className="w-5 h-5 text-amber-500" />
              <span className="text-[9px] font-bold text-amber-500/60 uppercase tracking-widest">Pending Requests</span>
            </div>
            <h2 className="text-2xl font-black text-white">{loans.filter(l => l.status === 'PENDING').length}</h2>
            <p className="text-[10px] text-amber-500/70 mt-1 font-bold">PRIORITY: HIGH</p>
          </GlassCard>

          <GlassCard className="!p-5 border-l-4 border-l-rose-500 bg-rose-500/5">
            <div className="flex justify-between items-start mb-4">
              <Server className="w-5 h-5 text-rose-500" />
              <span className="text-[9px] font-bold text-rose-500/60 uppercase tracking-widest">Node Load</span>
            </div>
            <h2 className="text-2xl font-black text-white">12.4%</h2>
            <p className="text-[10px] text-rose-500/70 mt-1 font-bold">TEMP: 42°C</p>
          </GlassCard>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="loans" className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <TabsList className="bg-white/5 border-white/5 p-1 h-10">
              <TabsTrigger value="loans" className="data-[state=active]:bg-primary data-[state=active]:text-white text-[10px] font-bold uppercase tracking-widest px-6">
                <Landmark className="w-3 h-3 mr-2" />
                Loan Queue
              </TabsTrigger>
              <TabsTrigger value="ledger" className="data-[state=active]:bg-primary data-[state=active]:text-white text-[10px] font-bold uppercase tracking-widest px-6">
                <Terminal className="w-3 h-3 mr-2" />
                System Logs
              </TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="SEARCH_NODE_ID..." 
                  className="bg-white/5 border border-white/10 rounded-lg px-4 py-1.5 text-[10px] w-64 focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>
              <Button variant="outline" size="sm" onClick={refreshData} className="h-8 border-white/10 text-slate-400 hover:text-white">
                REFRESH_SYNC
              </Button>
            </div>
          </div>

          <TabsContent value="loans" className="mt-0">
            <div className="grid grid-cols-1 gap-4">
              <AnimatePresence mode="popLayout">
                {loans.length > 0 ? (
                  loans.map((loan) => (
                    <motion.div
                      key={loan.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      layout
                    >
                      <GlassCard className="border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all group !p-0 overflow-hidden">
                        <div className="flex flex-col lg:flex-row">
                          {/* Left Profile Section */}
                          <div className="lg:w-72 p-6 border-b lg:border-b-0 lg:border-r border-white/5 bg-white/[0.02]">
                            <div className="flex items-center gap-4 mb-4">
                              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:scale-110 transition-transform">
                                <User className="w-6 h-6 text-primary" />
                              </div>
                              <div>
                                <h3 className="text-sm font-black text-white uppercase truncate w-40">{loan.userName || 'ANONYMOUS'}</h3>
                                <p className="text-[9px] text-slate-500 font-bold tracking-tighter truncate w-40">{loan.userEmail}</p>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest">
                                <span className="text-slate-500">Node ID</span>
                                <span className="text-primary">{loan.id}</span>
                              </div>
                              <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest">
                                <span className="text-slate-500">Timestamp</span>
                                <span className="text-slate-300">{loan.timestamp}</span>
                              </div>
                            </div>
                          </div>

                          {/* Middle Data Section */}
                          <div className="flex-1 p-6 grid grid-cols-2 sm:grid-cols-4 gap-6">
                            <div>
                              <p className="text-[9px] uppercase tracking-widest text-slate-500 font-bold mb-2">Principal</p>
                              <p className="text-lg font-black text-emerald-400 italic">₹{(loan.amount || 0).toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-[9px] uppercase tracking-widest text-slate-500 font-bold mb-2">Interest</p>
                              <p className="text-lg font-black text-amber-400 italic">{loan.interestRate || 0}%</p>
                            </div>
                            <div>
                              <p className="text-[9px] uppercase tracking-widest text-slate-500 font-bold mb-2">Monthly EMI</p>
                              <p className="text-lg font-black text-primary italic">₹{(loan.emi || 0).toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-[9px] uppercase tracking-widest text-slate-500 font-bold mb-2">Tenure</p>
                              <p className="text-lg font-black text-white italic">{loan.tenure || 0} MO</p>
                            </div>
                          </div>

                          {/* Right Action Section */}
                          <div className="lg:w-64 p-6 flex flex-col justify-center items-center lg:items-end gap-4 bg-white/[0.01]">
                            <div className="flex items-center gap-2">
                              {loan.status === 'PENDING' ? (
                                <span className="flex items-center gap-1.5 text-[9px] font-black text-amber-500 uppercase tracking-widest bg-amber-500/10 px-4 py-1.5 rounded-full border border-amber-500/20">
                                  <Clock className="w-3 h-3" /> Pending_Review
                                </span>
                              ) : loan.status === 'APPROVED' ? (
                                <span className="flex items-center gap-1.5 text-[9px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/20">
                                  <Check className="w-3 h-3" /> Approved_Node
                                </span>
                              ) : (
                                <span className="flex items-center gap-1.5 text-[9px] font-black text-rose-500 uppercase tracking-widest bg-rose-500/10 px-4 py-1.5 rounded-full border border-rose-500/20">
                                  <X className="w-3 h-3" /> Rejected_Node
                                </span>
                              )}
                            </div>

                            {loan.status === 'PENDING' && (
                              <div className="flex gap-2 w-full">
                                <Button 
                                  size="sm" 
                                  className="flex-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20 font-black uppercase text-[10px] h-9"
                                  onClick={() => updateLoanStatus(loan.id, 'REJECTED')}
                                >
                                  Reject
                                </Button>
                                <Button 
                                  size="sm" 
                                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase text-[10px] h-9 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                                  onClick={() => updateLoanStatus(loan.id, 'APPROVED')}
                                >
                                  Approve
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </GlassCard>
                    </motion.div>
                  ))
                ) : (
                  <div className="p-20 text-center border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
                    <Database className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                    <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.4em]">No incoming loan signals detected</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </TabsContent>

          <TabsContent value="ledger" className="mt-0">
            <GlassCard className="border-white/5 bg-white/[0.01] !p-0 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-white/5 text-[9px] uppercase tracking-[0.2em] text-slate-500 font-black">
                    <tr>
                      <th className="p-5 border-b border-white/5">Trace_ID</th>
                      <th className="p-5 border-b border-white/5">Destination_Node</th>
                      <th className="p-5 border-b border-white/5 text-right">Volume_Relay</th>
                      <th className="p-5 border-b border-white/5 text-right">Energy_Audit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {ledger.length > 0 ? (
                      ledger.map((tx) => (
                        <tr key={tx.trace_id} className="hover:bg-primary/5 transition-colors group">
                          <td className="p-5 font-bold text-primary text-[11px] tracking-tighter">{tx.trace_id}</td>
                          <td className="p-5">
                            <span className="px-3 py-1 rounded-md bg-white/5 border border-white/10 text-[9px] font-black tracking-widest uppercase text-slate-300 group-hover:border-primary/30 transition-colors">
                              {tx.destination?.replace("_", " ") || 'UNKNOWN_NODE'}
                            </span>
                          </td>
                          <td className="p-5 text-right text-emerald-400 font-black text-xs italic">₹{(tx.amount || 0).toLocaleString()}</td>
                          <td className="p-5 text-right text-[10px] text-slate-500 font-bold italic">
                            <ShieldCheck className="w-3 h-3 inline mr-2 text-emerald-500/50" />
                            {tx.energy_audit || '0.00000 J'} VERIFIED
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="p-20 text-center text-slate-600 font-bold text-[10px] uppercase tracking-[0.5em]">
                          Waiting for network handshake...
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer Status Bar */}
      <footer className="h-8 border-t border-white/5 bg-black/60 backdrop-blur-md fixed bottom-0 w-full flex items-center justify-between px-8 text-[8px] font-bold text-slate-600 uppercase tracking-widest">
        <div className="flex gap-6">
          <span>CPU_LOAD: 12%</span>
          <span>MEM_USAGE: 442MB</span>
          <span>NET_IO: 1.2GB/S</span>
        </div>
        <div className="flex gap-6">
          <span className="text-primary">FINVERSE_OS_V2.4.0_STABLE</span>
          <span>© 2024 TREASURY_COMMAND</span>
        </div>
      </footer>
    </div>
  );
}