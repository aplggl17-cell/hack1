'use client';

import { useState } from 'react';
import { VanguardAlertBanner } from '@/components/vanguard/VanguardAlertBanner';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { AlertOctagon, ShieldAlert } from 'lucide-react';

export default function FanPage() {
  const [sosStatus, setSosStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const handleSOS = async () => {
    setSosStatus('sending');
    try {
      // Simulate sending high-priority SOS with User ID and Gate info
      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentGate: 'GATE_7', density: 100, voiceCommand: 'COMMAND CODE ALPHA: Fan initiated SOS from Gate 7.' }),
      });

      if (response.ok) {
        setSosStatus('sent');
      } else {
        setSosStatus('idle');
      }
    } catch (error) {
      console.error(error);
      setSosStatus('idle');
    }
  };

  return (
    <div className="flex flex-col h-[100dvh] w-full bg-slate-950 text-slate-100 overflow-hidden pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)] relative">
      <VanguardAlertBanner />
      
      {/* Background elements for premium aesthetic */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-slate-950 to-emerald-900/10 pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none z-0" />

      <header className="flex-none p-6 pb-2 relative z-10 flex justify-between items-end border-b border-white/5">
        <div>
          <h1 className="text-sm font-mono tracking-widest text-slate-400 uppercase">MatchHub</h1>
          <h2 className="text-2xl font-bold tracking-tight text-white mt-1">Digital Pass</h2>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-mono tracking-widest uppercase text-slate-400">Offline Ready</span>
          <span className="text-xs font-bold text-emerald-400 flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Cached</span>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col gap-6 relative z-10">
        
        {/* Ticket Card */}
        <Card className="glass-panel p-6 border-slate-700/50 rounded-3xl shadow-2xl flex flex-col items-center">
          <div className="w-full flex justify-between items-center mb-6">
            <div className="flex flex-col">
              <span className="text-xs text-slate-400 uppercase tracking-widest">Section</span>
              <span className="text-2xl font-bold font-mono text-white">104</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest bg-slate-900/50 px-2 py-1 rounded-full border border-slate-800">
                Rahul Sharma
              </span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-xs text-slate-400 uppercase tracking-widest">Row / Seat</span>
              <span className="text-2xl font-bold font-mono text-white">F / 22</span>
            </div>
          </div>

          <Separator className="bg-slate-700/50 mb-6" />

          {/* Placeholder QR */}
          <div className="bg-white p-4 rounded-xl w-48 h-48 flex items-center justify-center shadow-inner mb-6 relative">
            {/* Fake QR pattern */}
            <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900 relative z-10">
              <rect x="10" y="10" width="20" height="20" fill="currentColor" />
              <rect x="70" y="10" width="20" height="20" fill="currentColor" />
              <rect x="10" y="70" width="20" height="20" fill="currentColor" />
              <rect x="15" y="15" width="10" height="10" fill="white" />
              <rect x="75" y="15" width="10" height="10" fill="white" />
              <rect x="15" y="75" width="10" height="10" fill="white" />
              <path d="M40 10h20v10H40zM40 30h10v20H40zM70 40h20v10H70zM10 40h20v10H10zM40 70h30v10H40zM80 70h10v20H80z" fill="currentColor" />
            </svg>
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 to-transparent animate-pulse rounded-xl pointer-events-none" />
          </div>

          <div className="flex flex-col items-center w-full bg-slate-950/40 py-3 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">Assigned Entry Gate</span>
            <span className="text-4xl font-black tracking-tighter text-emerald-400 mt-1">GATE 7</span>
          </div>
        </Card>

        {/* Match Info */}
        <div className="glass-panel p-5 rounded-2xl border-slate-800 flex flex-col gap-1 items-center text-center">
          <span className="text-xs text-slate-400 uppercase tracking-widest">Live Event</span>
          <span className="text-lg font-bold text-white tracking-tight">IND vs AUS 2026</span>
          <span className="text-sm text-slate-400 font-mono">Aegis Stadium • 18:30 IST</span>
        </div>

        {/* High Priority SOS Button */}
        <Button
          onClick={handleSOS}
          disabled={sosStatus !== 'idle'}
          className={`mt-2 w-full h-20 rounded-2xl font-bold tracking-widest uppercase transition-all duration-500 border flex items-center justify-center gap-3 ${
            sosStatus === 'idle'
              ? 'bg-destructive/20 hover:bg-destructive/30 text-destructive border-destructive/30 shadow-[0_0_20px_rgba(239,68,68,0.15)] hover:shadow-[0_0_30px_rgba(239,68,68,0.25)]'
              : sosStatus === 'sending'
              ? 'bg-amber-500/20 text-amber-500 border-amber-500/30'
              : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
          }`}
        >
          {sosStatus === 'idle' && (
            <>
              <AlertOctagon className="w-6 h-6 animate-pulse" />
              SOS / Request Assistance
            </>
          )}
          {sosStatus === 'sending' && (
            <>
              <ShieldAlert className="w-6 h-6 animate-bounce" />
              Transmitting to Command...
            </>
          )}
          {sosStatus === 'sent' && (
            <>
              <ShieldAlert className="w-6 h-6" />
              Help is on the way
            </>
          )}
        </Button>

      </main>
    </div>
  );
}
