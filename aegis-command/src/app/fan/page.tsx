import { VanguardAlertBanner } from '@/components/vanguard/VanguardAlertBanner';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function FanPage() {
  return (
    <div className="flex flex-col h-[100dvh] w-full bg-slate-950 text-slate-100 overflow-hidden pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)] relative">
      <VanguardAlertBanner />
      
      {/* Background elements for premium aesthetic */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-slate-950 to-emerald-900/10 pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none z-0" />

      <header className="flex-none p-6 pb-2 relative z-10">
        <h1 className="text-sm font-mono tracking-widest text-slate-400 uppercase">MatchHub</h1>
        <h2 className="text-2xl font-bold tracking-tight text-white mt-1">Digital Pass</h2>
      </header>

      <main className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 relative z-10">
        
        {/* Ticket Card */}
        <Card className="glass-panel p-6 border-slate-700/50 rounded-2xl shadow-2xl flex flex-col items-center">
          <div className="w-full flex justify-between items-center mb-6">
            <div className="flex flex-col">
              <span className="text-xs text-slate-400 uppercase tracking-widest">Section</span>
              <span className="text-2xl font-bold font-mono text-white">104</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-xs text-slate-400 uppercase tracking-widest">Row / Seat</span>
              <span className="text-2xl font-bold font-mono text-white">F / 22</span>
            </div>
          </div>

          <Separator className="bg-slate-700/50 mb-6" />

          {/* Placeholder QR */}
          <div className="bg-white p-4 rounded-xl w-48 h-48 flex items-center justify-center shadow-inner mb-6">
            <svg viewBox="0 0 100 100" className="w-full h-full text-black">
              {/* Fake QR pattern */}
              <rect x="10" y="10" width="20" height="20" fill="currentColor" />
              <rect x="70" y="10" width="20" height="20" fill="currentColor" />
              <rect x="10" y="70" width="20" height="20" fill="currentColor" />
              <rect x="15" y="15" width="10" height="10" fill="white" />
              <rect x="75" y="15" width="10" height="10" fill="white" />
              <rect x="15" y="75" width="10" height="10" fill="white" />
              <path d="M40 10h20v10H40zM40 30h10v20H40zM70 40h20v10H70zM10 40h20v10H10zM40 70h30v10H40zM80 70h10v20H80z" fill="currentColor" />
            </svg>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-xs text-slate-400 uppercase tracking-widest">Assigned Entry Gate</span>
            <span className="text-4xl font-black tracking-tighter text-emerald-400 mt-1">GATE 7</span>
          </div>
        </Card>

        {/* Match Info */}
        <div className="glass-panel p-5 rounded-2xl border-slate-800 flex flex-col gap-1">
          <span className="text-xs text-slate-400 uppercase tracking-widest">Live Event</span>
          <span className="text-lg font-bold text-white tracking-tight">IND vs AUS 2026</span>
          <span className="text-sm text-slate-300">Aegis Stadium • 18:30 IST</span>
        </div>

      </main>
    </div>
  );
}
