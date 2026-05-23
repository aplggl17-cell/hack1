'use client';

import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

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
      // Trigger the SSE Agent Route for Crisis Escalation
      // Since it's SSE, we just need to hit it to trigger the supervisor logic
      // In a real scenario we'd use the useAgentStream hook, but for the node,
      // we just simulate sending the SOS to the backend.
      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentGate: 'GATE_SOS', density: 100, voiceCommand: finalTranscript }),
      });

      if (response.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error(error);
      setStatus('error');
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

      <header className="flex-none p-6 pb-2 relative z-10">
        <h1 className="text-sm font-mono tracking-widest text-slate-400 uppercase">Aegis Operations</h1>
        <h2 className="text-2xl font-bold tracking-tight text-white mt-1">Volunteer Node</h2>
      </header>

      <main className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 relative z-10 justify-center">
        
        <Card className={`glass-panel p-6 border-slate-700/50 rounded-2xl shadow-2xl flex flex-col items-center transition-colors duration-500 ${isListening ? 'border-indigo-500/50 shadow-[0_0_30px_rgba(99,102,241,0.2)]' : ''} ${status === 'success' ? 'border-emerald-500/50' : ''} ${status === 'error' ? 'border-destructive' : ''}`}>
          
          <div className="w-full mb-8 text-center space-y-2">
            <AlertTriangle className="w-8 h-8 mx-auto text-amber-500 mb-2" />
            <h3 className="text-lg font-bold">Priority Comms</h3>
            <p className="text-xs text-slate-400 font-mono tracking-widest uppercase">
              Wake Word: "Command Code Alpha:"
            </p>
          </div>

          <Button
            size="lg"
            variant="default"
            onPointerDown={startListening}
            onPointerUp={stopListening}
            onPointerLeave={stopListening}
            className={`w-full h-32 rounded-3xl font-black text-2xl tracking-tight transition-all duration-300 ${
              isListening 
                ? 'bg-indigo-600 hover:bg-indigo-500 scale-95 shadow-[inset_0_5px_15px_rgba(0,0,0,0.3)]' 
                : 'bg-indigo-500 hover:bg-indigo-400 shadow-[0_10px_25px_rgba(99,102,241,0.3)]'
            }`}
          >
            <div className="flex flex-col items-center gap-2">
              {isListening ? <Mic className="w-8 h-8 animate-pulse" /> : <MicOff className="w-8 h-8 opacity-50" />}
              {isListening ? "LISTENING..." : "HOLD TO TALK"}
            </div>
          </Button>

          <div className="w-full mt-8 p-4 bg-slate-950/50 rounded-xl min-h-[100px] border border-slate-800 flex flex-col">
            <span className="text-[10px] uppercase tracking-widest text-slate-500 mb-2 font-mono">Live Transcript</span>
            <p 
              className="font-mono text-sm text-slate-300 flex-1"
              aria-live="polite"
            >
              {transcript || <span className="opacity-30">Awaiting voice input...</span>}
            </p>
          </div>

          {status === 'success' && (
            <div className="mt-4 w-full p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 text-xs font-mono text-center">
              [SYSTEM] CRISIS ESCALATION DEPLOYED
            </div>
          )}
          {status === 'error' && (
            <div className="mt-4 w-full p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-xs font-mono text-center">
              [SYSTEM] TRANSMISSION FAILED
            </div>
          )}

        </Card>

      </main>
    </div>
  );
}
