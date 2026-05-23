'use client';

import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, AlertTriangle, ShieldAlert, Inbox } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';

export default function VolunteerPage() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [status, setStatus] = useState<'idle' | 'listening' | 'processing' | 'error' | 'success'>('idle');
  
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Initialize Web Speech API
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);

        // Strict Wake Word Logic
        if (currentTranscript.toLowerCase().includes('command code alpha:')) {
          handleCrisisEscalation(currentTranscript);
          recognition.stop();
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setStatus('error');
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        if (status === 'listening') setStatus('idle');
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [status]);

  const handleCrisisEscalation = async (finalTranscript: string) => {
    setStatus('processing');
    try {
      // 1. Log to Enterprise Audit Trail (Supabase)
      const supabase = createBrowserSupabaseClient();
      await supabase.from('event_logs').insert([{
        event_type: 'RED_ZONE_SOS',
        ai_action_taken: `[VOLUNTEER SOS] Priority Transmission: ${finalTranscript}`,
        target_block_id: 'GATE_7'
      }]);

      // 2. Trigger the SSE Agent Route
      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentGate: 'GATE_7', density: 100, voiceCommand: finalTranscript }),
      });

      if (response.ok) {
        setStatus('success');
        toast.success('Command Center Notified', { description: `"${finalTranscript}" logged to secure audit trail.` });
      } else {
        setStatus('error');
        toast.error('Transmission Failed', { description: 'Could not reach Command Center.' });
      }
    } catch (error) {
      console.error(error);
      setStatus('error');
      toast.error('Network Error', { description: 'Check your connection.' });
    }
  };

  const startListening = () => {
    if (recognitionRef.current) {
      setTranscript('');
      setStatus('listening');
      setIsListening(true);
      recognitionRef.current.start();
    } else {
      alert('Speech Recognition API not supported in this browser.');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  return (
    <div className="flex flex-col h-[100dvh] w-full bg-slate-950 text-slate-100 overflow-hidden pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)] relative">
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900 to-indigo-950/30 pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none z-0" />

      <header className="flex-none p-6 pb-2 relative z-10 flex justify-between items-end border-b border-white/5">
        <div>
          <h1 className="text-sm font-mono tracking-widest text-slate-400 uppercase">Aegis Operations</h1>
          <h2 className="text-2xl font-bold tracking-tight text-white mt-1">Volunteer Node</h2>
        </div>
        <div className="flex items-center gap-2 bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/30">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-mono tracking-widest uppercase font-bold">Deployed: Gate 7</span>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col gap-6 relative z-10">
        
        {/* Instant Action Grid */}
        <div className="grid grid-cols-2 gap-4">
          <Button 
            onClick={() => handleCrisisEscalation('REPORT THREAT')}
            className="h-24 flex flex-col items-center justify-center gap-2 bg-destructive/20 hover:bg-destructive/30 text-destructive border border-destructive/30 rounded-2xl transition-all"
          >
            <AlertTriangle className="w-6 h-6" />
            <span className="font-bold text-xs tracking-widest uppercase">Report Threat</span>
          </Button>
          <Button 
            onClick={() => handleCrisisEscalation('REQUEST TRIAGE/AMBULANCE')}
            className="h-24 flex flex-col items-center justify-center gap-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-500 border border-amber-500/30 rounded-2xl transition-all"
          >
            <ShieldAlert className="w-6 h-6" />
            <span className="font-bold text-xs tracking-widest uppercase text-center leading-tight">Request<br/>Triage</span>
          </Button>
        </div>

        {/* Priority Comms (Hold to Talk) */}
        <Card className={`glass-panel p-6 border-slate-700/50 rounded-3xl shadow-2xl flex flex-col items-center transition-colors duration-500 ${isListening ? 'border-indigo-500/50 shadow-[0_0_30px_rgba(99,102,241,0.2)]' : ''} ${status === 'success' ? 'border-emerald-500/50' : ''} ${status === 'error' ? 'border-destructive' : ''}`}>
          
          <div className="w-full mb-6 text-center space-y-1">
            <Mic className="w-6 h-6 mx-auto text-indigo-400 mb-2" />
            <h3 className="text-md font-bold uppercase tracking-tight text-slate-200">Priority Comms</h3>
            <p className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">
              Wake Word: "Command Code Alpha:"
            </p>
          </div>

          <Button
            size="lg"
            variant="default"
            onPointerDown={startListening}
            onPointerUp={stopListening}
            onPointerLeave={stopListening}
            className={`w-full h-32 rounded-2xl font-black text-2xl tracking-tight transition-all duration-300 ${
              isListening 
                ? 'bg-indigo-600 hover:bg-indigo-500 scale-[0.98] shadow-[inset_0_5px_15px_rgba(0,0,0,0.3)]' 
                : 'bg-indigo-500 hover:bg-indigo-400 shadow-[0_10px_25px_rgba(99,102,241,0.3)]'
            }`}
          >
            <div className="flex flex-col items-center gap-2">
              {isListening ? <Mic className="w-8 h-8 animate-pulse" /> : <MicOff className="w-8 h-8 opacity-50" />}
              {isListening ? "LISTENING..." : "HOLD TO TALK"}
            </div>
          </Button>

          <div className="w-full mt-6 p-4 bg-slate-950/60 rounded-xl min-h-[80px] border border-slate-800 flex flex-col">
            <span className="text-[10px] uppercase tracking-widest text-slate-500 mb-2 font-mono">Live Transcript</span>
            <p 
              className="font-mono text-sm text-slate-300 flex-1"
              aria-live="polite"
            >
              {transcript || <span className="opacity-30">Awaiting voice input...</span>}
            </p>
          </div>

          {status === 'success' && (
            <div className="mt-4 w-full p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 text-[10px] uppercase tracking-widest font-mono text-center animate-in fade-in zoom-in duration-300">
              [SYSTEM] Transmission Confirmed
            </div>
          )}
          {status === 'error' && (
            <div className="mt-4 w-full p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-[10px] uppercase tracking-widest font-mono text-center animate-in fade-in zoom-in duration-300">
              [SYSTEM] Transmission Failed
            </div>
          )}

        </Card>

        {/* Command Inbox */}
        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 px-2 flex items-center gap-2">
            <Inbox className="w-4 h-4" /> Command Inbox
          </h3>
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3">
            <div className="flex items-start gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
              <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
              <div>
                <p className="text-xs font-mono text-slate-400 mb-1">14:02 PM • COMMAND CENTER</p>
                <p className="text-sm font-semibold text-slate-200">Maintain current position. Flow rate stable.</p>
              </div>
            </div>
            {/* Example of a high priority order */}
            <div className="flex items-start gap-3 p-3 bg-destructive/10 rounded-xl border border-destructive/30">
              <div className="w-2 h-2 rounded-full bg-destructive mt-1.5 shrink-0 animate-pulse" />
              <div>
                <p className="text-xs font-mono text-destructive mb-1">14:15 PM • AEGIS SUPERVISOR AI</p>
                <p className="text-sm font-bold text-destructive">LOCK GATE 7 NOW. PREPARE FOR REDIRECT.</p>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
