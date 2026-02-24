import React, { useEffect, useState } from 'react';
import { GlassCard } from '@/components/GlassCard'; 
import { Cpu, Activity, ShieldCheck, Landmark, User, Check, X, Clock, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { treasuryStore, type Transaction, type LoanRequest } from "@/lib/treasuryStore";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AdminTreasury() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [ledger, setLedger] = useState<Transaction[]>([]);
  const [loans, setLoans] = useState<LoanRequest[]>([]);

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
    // Poll for changes every 2 seconds to simulate real-time updates
    const interval = setInterval(refreshData, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-8 bg-[#02040a] min-h-screen text-slate-200 font-sans">
      {/* Header Section */}
      <div className="flex justify-between items-end mb-12 border-b border-white/5 pb-8">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic text-white">Treasury Ops</h1>
          <p className="text-blue-500 font-mono text-[10px] tracking-[0.3em] mt-2">VIRTUAL_RELAY_ACTIVE</p>
        </div>
        <div className="flex flex-col items-end gap-4">
          <div className="text-right font-mono text-[10px] text-slate-500">
            NODE_STATUS: <span className="text-emerald-400 font-bold text-xs uppercase tracking-widest">Online</span>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLogout}
            className="border-rose-500/20 text-rose-500 hover:bg-rose-500/10 font-bold uppercase text-[10px] tracking-widest"
          >
            <LogOut className="w-3 h-3 mr-2" />
            Logout Session
          </Button>
        </div>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <GlassCard className="p-6 border-t-2 border-blue-500/50 text-center">
          <Cpu className="w-5 h-5 text-blue-500 mb-4 mx-auto" />
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Energy Audit Avg</p>
          <h2 className="text-3xl font-bold font-mono text-white">0.0024 J</h2>
        </GlassCard>
        
        <GlassCard className="p-6 border-t-2 border-emerald-500/50 text-center">
          <Activity className="w-5 h-5 text-emerald-500 mb-4 mx-auto" />
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Total Volume Relay</p>
          <h2 className="text-3xl font-bold font-mono text-white">
            ₹{ledger.reduce((a, b) => a + b.amount, 0).toLocaleString()}
          </h2>
        </GlassCard>

        <GlassCard className="p-6 border-t-2 border-primary/50 text-center">
          <Landmark className="w-5 h-5 text-primary mb-4 mx-auto" />
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Pending Loans</p>
          <h2 className="text-3xl font-bold font-mono text-white">
            {loans.filter(l => l.status === 'PENDING').length}
          </h2>
        </GlassCard>
      </div>

      <Tabs defaultValue="ledger" className="space-y-6">
        <TabsList className="bg-white/5 border-white/5">
          <TabsTrigger value="ledger" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">Transaction Ledger</TabsTrigger>
          <TabsTrigger value="loans" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">Loan Management</TabsTrigger>
        </TabsList>

        <TabsContent value="ledger">
          <GlassCard className="border-white/5 bg-white/[0.01] overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-white/5 text-[10px] uppercase tracking-widest text-gray-500 font-bold">
                <tr>
                  <th className="p-4">Trace ID</th>
                  <th className="p-4">Destination Node</th>
                  <th className="p-4 text-right">Volume</th>
                  <th className="p-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {ledger.length > 0 ? (
                  ledger.map((tx) => (
                    <tr key={tx.trace_id} className="hover:bg-blue-500/5 transition-colors group border-b border-white/5">
                      <td className="p-4 font-mono text-blue-400 text-xs">{tx.trace_id}</td>
                      <td className="p-4">
                        <span className="px-2 py-1 rounded bg-blue-500/10 border border-blue-500/20 text-[10px] font-black tracking-widest uppercase text-blue-300">
                          {tx.destination.replace("_", " ")}
                        </span>
                      </td>
                      <td className="p-4 text-right text-emerald-400 font-mono text-xs font-bold">₹{tx.amount.toLocaleString()}</td>
                      <td className="p-4 text-right text-[10px] text-gray-500 font-mono italic">
                        <ShieldCheck className="w-3 h-3 inline mr-1 text-emerald-500/50" />
                        {tx.energy_audit} Verified
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-12 text-center text-slate-600 font-mono text-xs uppercase tracking-[0.3em]">
                      Waiting for incoming signals...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </GlassCard>
        </TabsContent>

        <TabsContent value="loans">
          <div className="grid grid-cols-1 gap-4">
            {loans.length > 0 ? (
              loans.map((loan) => (
                <GlassCard key={loan.id} className="border-white/5 bg-white/[0.01] p-6">
                  <div className="flex flex-col md:flex-row justify-between gap-6">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <User className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-bold text-white">{loan.userName}</h3>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-gray-400 font-mono">{loan.id}</span>
                        </div>
                        <p className="text-xs text-gray-500 mb-3">{loan.userEmail}</p>
                        <div className="flex flex-wrap gap-4">
                          <div>
                            <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">Amount</p>
                            <p className="text-sm font-bold text-emerald-400 font-mono">₹{loan.amount.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">Purpose</p>
                            <p className="text-sm font-bold text-blue-400">{loan.purpose}</p>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">Income</p>
                            <p className="text-sm font-bold text-white font-mono">₹{loan.income.toLocaleString()}/mo</p>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">Tenure</p>
                            <p className="text-sm font-bold text-white">{loan.tenure} Months</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col justify-between items-end">
                      <div className="flex items-center gap-2">
                        {loan.status === 'PENDING' ? (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-amber-500 uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                            <Clock className="w-3 h-3" /> Pending Review
                          </span>
                        ) : loan.status === 'APPROVED' ? (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                            <Check className="w-3 h-3" /> Approved
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-rose-500 uppercase tracking-widest bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
                            <X className="w-3 h-3" /> Rejected
                          </span>
                        )}
                      </div>

                      {loan.status === 'PENDING' && (
                        <div className="flex gap-2 mt-4">
                          <Button 
                            size="sm" 
                            className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20 font-bold uppercase text-[10px]"
                            onClick={() => updateLoanStatus(loan.id, 'REJECTED')}
                          >
                            Reject
                          </Button>
                          <Button 
                            size="sm" 
                            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold uppercase text-[10px]"
                            onClick={() => updateLoanStatus(loan.id, 'APPROVED')}
                          >
                            Approve Loan
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </GlassCard>
              ))
            ) : (
              <div className="p-12 text-center text-slate-600 font-mono text-xs uppercase tracking-[0.3em] border border-dashed border-white/5 rounded-xl">
                No loan applications found in the system.
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}