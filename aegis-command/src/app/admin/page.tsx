import { AdminClientOrchestrator } from '@/components/AdminClientOrchestrator';

export default function AdminPage() {
  return (
    <div className="flex flex-col h-[100dvh] overflow-hidden bg-background">
      {/* Top bar */}
      <header className="flex-shrink-0 border-b border-border/40 bg-background/80 backdrop-blur-md px-6 py-4 flex items-center justify-between z-10">
        <div>
          <h1 className="text-xl font-mono tracking-tight text-foreground uppercase font-semibold leading-none">
            Aegis Command Center
          </h1>
          <p className="text-muted-foreground mt-1 font-mono text-[10px] tracking-widest uppercase">
            Live Threat &amp; Telemetry Feed · Zero-Trust Mode
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-[oklch(0.65_0.15_150)]">
            <div className="w-2 h-2 rounded-full bg-[oklch(0.65_0.15_150)] animate-pulse" />
            Realtime Active
          </div>
        </div>
      </header>

      {/* Main content fills remaining height */}
      <main className="flex-1 min-h-0 overflow-hidden px-4 sm:px-6 lg:px-8 py-6 flex flex-col">
        <AdminClientOrchestrator />
      </main>
    </div>
  );
}
