'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle2, BrainCircuit } from 'lucide-react';
import { AgentState } from '@/hooks/useAgentStream';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TelemetryProps {
  state: AgentState;
  activeTool: { tool: string; status: 'executing' | 'done' } | null;
  thoughts: string[];
}

export function AgentTelemetry({ state, activeTool, thoughts }: TelemetryProps) {
  if (state === 'idle' || state === 'complete') {
    return (
      <div className="w-full h-full glass-panel rounded-xl p-6 flex flex-col items-center justify-center text-slate-500 font-mono text-sm border-border/50">
        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none z-0"></div>
        <BrainCircuit className="w-8 h-8 mb-4 opacity-50" />
        <p>Awaiting events...</p>
      </div>
    );
  }

  const isCrisis = false; // Based on data-ai-state, but for now we'll handle standard thinking

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
      className={`w-full h-full glass-panel rounded-xl p-6 font-mono text-sm overflow-hidden relative shadow-[inset_0_0_20px_var(--color-terminal-glow)] ${isCrisis ? 'border-destructive text-destructive' : 'border-primary/50 text-[oklch(0.85_0.10_160)] bg-[oklch(0.10_0.01_285)]'}`}
    >
      <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none z-0"></div>
      
      {/* SCANLINE EFFECT */}
      <div className="absolute inset-0 pointer-events-none z-10 opacity-50 overflow-hidden">
        <div className="w-full h-12 bg-gradient-to-b from-transparent via-[oklch(0.85_0.10_160/0.15)] to-transparent animate-[scanline_4s_linear_infinite]" />
      </div>

      <div className="relative z-20 flex flex-col h-full">
        <div className="flex items-center gap-3 mb-4 border-b border-slate-800/50 pb-3">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/80 animate-pulse" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80 animate-pulse delay-75" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/80 animate-pulse delay-150" />
          </div>
          <span className="font-semibold tracking-widest text-xs uppercase opacity-80">
            ORCHESTRATOR TELEMETRY
          </span>
        </div>

        <ScrollArea className="flex-1 -mr-4 pr-4">
          <div className="space-y-4 pb-4">
            {/* THOUGHT LOGS */}
            <AnimatePresence mode="popLayout">
              {thoughts.map((thought, i) => (
                <motion.div
                  key={thought + i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-start gap-3 opacity-90"
                >
                  <BrainCircuit className="w-4 h-4 mt-0.5 shrink-0" />
                  <span className="leading-relaxed text-xs">{thought}</span>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* ACTIVE TOOL CALLING */}
            <AnimatePresence>
              {activeTool && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex items-center gap-3 bg-[oklch(0.85_0.10_160/0.1)] p-3 rounded-lg border border-[oklch(0.85_0.10_160/0.2)] mt-4"
                >
                  {activeTool.status === 'executing' ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5" />
                  )}
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">
                      DELEGATING TO SUB-AGENT
                    </span>
                    <span className="font-semibold">{activeTool.tool}()</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(1000%); }
        }
      `}} />
    </motion.div>
  );
}
