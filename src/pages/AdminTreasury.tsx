import React, { useEffect, useState } from 'react';
import { GlassCard } from '@/components/GlassCard'; 
import { Cpu, Activity, ShieldCheck } from "lucide-react";

export default function AdminTreasury() {
  const [ledger, setLedger] = useState<any[]>([]);

  // Function to fetch the live ledger from the Treasury Node on Port 8001
  const refreshLedger = async () => {
    try {
      const res = await fetch("http://localhost:8001/api/treasury/ledger");
      if (res.ok) {
        const data = await res.json();
        setLedger(data);
      }
    } catch (err) {
      console.log("Searching for Treasury Node on Port 8001...");
    }
  };

  // Poll the server every 2 seconds for real-time updates
  useEffect(() => {
    refreshLedger();
    const interval = setInterval(refreshLedger, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-8 bg-[#02040a] min-h-screen text-slate-200 font-sans">
      {/* Header Section */}
      <div className="flex justify-between items-end mb-12 border-b border-white/5 pb-8">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic text-white">Treasury Ops</h1>
          <p className="text-blue-500 font-mono text-[10px] tracking-[0.3em] mt-2">PORT_8001_ACTIVE_RELAY</p>
        </div>
        <div className="text-right font-mono text-[10px] text-slate-500">
          NODE_STATUS: <span className="text-emerald-400 font-bold text-xs uppercase tracking-widest">Online</span>
        </div>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <GlassCard className="p-6 border-t-2 border-blue-500/50 text-center">
          <Cpu className="w-5 h-5 text-blue-500 mb-4 mx-auto" />
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Energy Audit Avg</p>
          <h2 className="text-3xl font-bold font-mono text-white">0.0024 J</h2>
        </GlassCard>
        
        <GlassCard className="p-6 border-t-2 border-emerald-500/50 text-center">
          <Activity className="w-5 h-5 text-emerald-500 mb-4 mx-auto" />
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Total Volume Relay</p>
          <h2 className="text-3xl font-bold font-mono text-white">
            ₹{(ledger || []).reduce((a, b) => a + (Number(b.amount) || 0), 0).toLocaleString()}
          </h2>
        </GlassCard>
      </div>

      {/* Live Transaction Table */}
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
              ledger.map((tx: any) => (
                <tr key={tx.trace_id} className="hover:bg-blue-500/5 transition-colors group border-b border-white/5">
                  <td className="p-4 font-mono text-blue-400 text-xs">
                    {tx.trace_id}
                  </td>
                  
                  {/* Styled Account Type Badge */}
                  <td className="p-4">
                    <span className="px-2 py-1 rounded bg-blue-500/10 border border-blue-500/20 text-[10px] font-black tracking-widest uppercase text-blue-300">
                      {tx.destination.replace("_", " ")}
                    </span>
                  </td>
                  
                  <td className="p-4 text-right text-emerald-400 font-mono text-xs font-bold">
                    ₹{tx.amount.toLocaleString()}
                  </td>
                  
                  <td className="p-4 text-right text-[10px] text-gray-500 font-mono italic">
                    <ShieldCheck className="w-3 h-3 inline mr-1 text-emerald-500/50" />
                    {tx.energy_audit || "0.0024 J"} Verified
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-12 text-center text-slate-600 font-mono text-xs uppercase tracking-[0.3em]">
                  Waiting for incoming signals on Port 8001...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </GlassCard>
    </div>
  );
}