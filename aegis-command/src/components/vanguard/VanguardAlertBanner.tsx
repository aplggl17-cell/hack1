'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useAegisStore } from '@/lib/store/useAegisStore';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

export function VanguardAlertBanner() {
  const activeGate = useAegisStore((state) => state.activeGate);
  const setGate = useAegisStore((state) => state.setGate);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (activeGate) {
      setShow(true);
    }
  }, [activeGate]);

  const handleDismiss = () => {
    setShow(false);
    // Optionally reset the gate in the store, but for the hackathon we can just hide the banner
  };

  const handleAccept = () => {
    setShow(false);
    // In a real flow, this would call /api/vanguard/claim
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="fixed top-4 left-4 right-4 z-50 glass-panel rounded-xl p-4 border border-emerald-500/50 shadow-2xl bg-slate-950/90"
        >
          <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none z-0 rounded-xl"></div>
          <div className="relative z-10 flex flex-col gap-3">
            <div>
              <h3 className="text-emerald-400 font-bold tracking-tight">Vanguard Routing Active</h3>
              <p className="text-slate-300 text-sm mt-1">
                Your current gate is congested. Reroute to {activeGate} to claim 500 Gamification Points.
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={handleAccept} 
                className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-white animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.5)]"
              >
                Accept Points
              </Button>
              <Button 
                onClick={handleDismiss} 
                variant="outline" 
                className="flex-1 border-slate-700 text-slate-300 bg-slate-900/50 hover:bg-slate-800"
              >
                Dismiss
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
