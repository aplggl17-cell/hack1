'use client';

import { useAgentStream } from '@/hooks/useAgentStream';
import { StadiumMap } from '@/components/StadiumMap';
import { AgentTelemetry } from '@/components/AgentTelemetry';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { useState, useCallback, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import type { User } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Map,
  CalendarDays,
  Users,
  Radio,
  MessageSquare,
  Bell,
  Wifi,
  ShieldCheck,
  AlertTriangle,
  Send,
  UserPlus,
  Volume2,
  Megaphone,
  Lock,
  CheckCircle2,
  Clock,
} from 'lucide-react';

// ─── Glassmorphism panel class ────────────────────────────────────────────────
const glass = 'relative bg-background/60 backdrop-blur-md border border-border/50 rounded-xl overflow-hidden';
// Note: noise texture is applied via a separate div with inline style to avoid CSS-loader URL parsing issues
const GlassNoise = () => (
  <div
    className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none z-0"
    style={{ backgroundImage: "url('/noise.svg')" }}
  />
);

// ─── Volunteer fallback data (used when Supabase fetch fails) ─────────────────
type VolunteerRow = { id: string; name: string; gate: string; status: string; phone: string };
const FALLBACK_VOLUNTEERS: VolunteerRow[] = [
  { id: 'VLT-001', name: 'Rahul Sharma',  gate: 'GATE_1', status: 'active',  phone: '+91 98765 43210' },
  { id: 'VLT-002', name: 'Priya Nair',    gate: 'GATE_3', status: 'active',  phone: '+91 87654 32109' },
  { id: 'VLT-003', name: 'Arjun Mehta',   gate: 'GATE_5', status: 'standby', phone: '+91 76543 21098' },
  { id: 'VLT-004', name: 'Divya Reddy',   gate: 'GATE_7', status: 'active',  phone: '+91 65432 10987' },
  { id: 'VLT-005', name: 'Kiran Patel',   gate: 'GATE_2', status: 'offline', phone: '+91 54321 09876' },
  { id: 'VLT-006', name: 'Sneha Verma',   gate: 'GATE_4', status: 'active',  phone: '+91 43210 98765' },
  { id: 'VLT-007', name: 'Vikram Singh',  gate: 'GATE_6', status: 'standby', phone: '+91 32109 87654' },
  { id: 'VLT-008', name: 'Ananya Iyer',   gate: 'GATE_8', status: 'active',  phone: '+91 21098 76543' },
];

const statusColors: Record<string, string> = {
  active:  'bg-[oklch(0.65_0.15_150)]/20 text-[oklch(0.65_0.15_150)] border-[oklch(0.65_0.15_150)]/30',
  standby: 'bg-[oklch(0.75_0.18_85)]/20 text-[oklch(0.75_0.18_85)] border-[oklch(0.75_0.18_85)]/30',
  offline: 'bg-muted text-muted-foreground border-border',
  VOLUNTEER: 'bg-[oklch(0.65_0.15_150)]/20 text-[oklch(0.65_0.15_150)] border-[oklch(0.65_0.15_150)]/30',
};

// ─── Mock comms messages ──────────────────────────────────────────────────────
type Message = { from: string; text: string; time: string; outgoing: boolean };
const seedVolMsg: Message[] = [
  { from: 'VLT-004 (Divya)', text: 'Gate 7 crowd building fast. Requesting backup.', time: '13:42', outgoing: false },
  { from: 'Admin', text: 'Acknowledged. Hold position. AI routing fans to Gate 4.', time: '13:43', outgoing: true },
  { from: 'VLT-001 (Rahul)', text: 'Gate 1 clear. Can support Gate 7 if needed.', time: '13:44', outgoing: false },
];
const seedFanMsg: Message[] = [
  { from: 'Fan #8821', text: 'Is Gate 7 closed? I can see heavy crowd.', time: '13:41', outgoing: false },
  { from: 'Admin', text: 'Gate 7 is open. Please proceed to Gate 4 for faster entry — 500 Vanguard points await!', time: '13:42', outgoing: true },
];

// ─── Sub-components ────────────────────────────────────────────────────────────

function TacticalTab({ onDensityUpdate, agentControls }: { onDensityUpdate: (g: string, d: number) => void, agentControls: any }) {
  const { agentState, thoughts, activeTool, finalText } = useAgentStream();
  
  return (
    <div className="grid grid-cols-10 gap-6 h-full min-h-[600px]">
      <div className="col-span-10 lg:col-span-7 h-full flex flex-col gap-4">
        <StadiumMap onDensityUpdate={onDensityUpdate} />
        <div className={`${glass} p-4 flex gap-4 items-center`}>
          <GlassNoise />
          <div className="relative z-10 flex items-center gap-2 text-xs font-mono text-muted-foreground uppercase tracking-widest mr-auto">
            <AlertTriangle className="w-4 h-4 text-[oklch(0.75_0.18_85)]" /> Debug Actions
          </div>
          <Button size="sm" variant="outline" className="relative z-10 border-border/50 text-xs" onClick={() => agentControls.executeAgentQuery('WEATHER_SYSTEM', 100)}>
            Simulate Rain
          </Button>
          <Button size="sm" variant="outline" className="relative z-10 border-amber-500/30 text-amber-500 text-xs hover:bg-amber-500/10" onClick={() => agentControls.executeAgentQuery('GATE_7', 75)}>
            Simulate Orange Surge
          </Button>
          <Button size="sm" variant="outline" className="relative z-10 border-destructive/30 text-destructive text-xs hover:bg-destructive/10" onClick={() => onDensityUpdate('GATE_7', 95)}>
            Simulate Red Crush
          </Button>
        </div>
      </div>
      <div className="col-span-10 lg:col-span-3 flex flex-col gap-6 h-full">
        <div className="flex-1 min-h-[300px]">
          <AgentTelemetry state={agentState} activeTool={activeTool} thoughts={thoughts} />
        </div>
        <div className={`${glass} p-4 font-mono text-xs max-h-48 overflow-y-auto`}>
          <GlassNoise />
          <h3 className="relative z-10 text-[10px] uppercase tracking-widest text-muted-foreground mb-3 border-b border-border pb-2">
            Recent Event Logs
          </h3>
          <div className="relative z-10 space-y-2 text-muted-foreground">
            {finalText ? (
              <div className="text-[oklch(0.65_0.15_150)]">[SYSTEM] AGENT RESOLUTION:<br />{finalText}</div>
            ) : (
              <div>[SYSTEM] Awaiting density threshold alerts...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function EventDetailsTab() {
  return (
    <div className={`${glass} p-8 space-y-8`}>
      <GlassNoise />
      <div className="relative z-10">
        <h2 className="text-2xl font-semibold tracking-tight mb-1">Event Configuration</h2>
        <p className="text-sm text-muted-foreground uppercase tracking-widest font-mono">Match Details · Aegis Stadium</p>
      </div>
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="venue" className="text-xs uppercase tracking-widest text-muted-foreground">Venue</Label>
          <Input id="venue" defaultValue="Chinnaswamy Stadium, Bengaluru" className="bg-muted/30 border-border/50 focus:border-primary/50" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="match" className="text-xs uppercase tracking-widest text-muted-foreground">Match ID</Label>
          <Input id="match" defaultValue="IND_VS_AUS_2026_T20_FINAL" className="bg-muted/30 border-border/50 font-mono" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="date" className="text-xs uppercase tracking-widest text-muted-foreground">Match Date</Label>
          <Input id="date" type="date" defaultValue="2026-05-23" className="bg-muted/30 border-border/50" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="capacity" className="text-xs uppercase tracking-widest text-muted-foreground">Venue Capacity</Label>
          <Input id="capacity" defaultValue="55,000" className="bg-muted/30 border-border/50" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="teams" className="text-xs uppercase tracking-widest text-muted-foreground">Teams</Label>
          <Input id="teams" defaultValue="India vs Australia" className="bg-muted/30 border-border/50" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="kickoff" className="text-xs uppercase tracking-widest text-muted-foreground">Kickoff (IST)</Label>
          <Input id="kickoff" type="time" defaultValue="19:30" className="bg-muted/30 border-border/50" />
        </div>
        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="notes" className="text-xs uppercase tracking-widest text-muted-foreground">Operational Notes</Label>
          <Textarea
            id="notes"
            rows={4}
            defaultValue="VIP section: Block C, Rows 1-10. Emergency exits active on all 8 gates. Medical bays: Gate 2 & Gate 6 concourse."
            className="bg-muted/30 border-border/50 font-mono text-sm resize-none"
          />
        </div>
      </div>
      <div className="relative z-10 flex gap-3">
        <Button className="gap-2"><CheckCircle2 className="w-4 h-4" /> Save Configuration</Button>
        <Button variant="outline" className="gap-2 border-border/50"><Clock className="w-4 h-4" /> Schedule Brief</Button>
      </div>
    </div>
  );
}

function VolunteerManagementTab() {
  const [volunteers, setVolunteers] = useState<VolunteerRow[]>(FALLBACK_VOLUNTEERS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVolunteers() {
      try {
        const supabase = createBrowserSupabaseClient();
        const { data, error } = await supabase.from('users').select('*').eq('role', 'VOLUNTEER');
        if (!error && data && data.length > 0) {
          setVolunteers(
            (data as User[]).map((u, i) => ({
              id: `VLT-${String(i + 1).padStart(3, '0')}`,
              name: u.email.split('@')[0],
              gate: u.assigned_gate ?? `GATE_${(i % 8) + 1}`,
              status: 'active',
              phone: u.phone_number ?? 'N/A',
            }))
          );
        }
      } catch (err) {
        // On error or empty result, fallback stays in place
      } finally {
        setLoading(false);
      }
    }
    fetchVolunteers();
  }, []);

  return (
    <div className={`${glass} p-6`}>
      <GlassNoise />
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Volunteer Roster</h2>
            <p className="text-sm text-muted-foreground font-mono uppercase tracking-widest mt-1">
              {loading ? 'Loading...' : `${volunteers.filter(v => v.status === 'active').length} Active · ${volunteers.filter(v => v.status === 'standby').length} Standby`}
            </p>
          </div>
          <Button size="sm" className="gap-2"><UserPlus className="w-4 h-4" /> Assign Volunteer</Button>
        </div>
        <div className="border border-border/40 rounded-xl overflow-hidden">
          <table className="w-full text-sm font-mono">
            <thead>
              <tr className="border-b border-border/40 bg-muted/20">
                {['ID', 'Name', 'Gate', 'Status', 'Phone', 'Action'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-muted-foreground font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {volunteers.map((v, i) => (
                <tr key={v.id} className={`border-b border-border/20 transition-colors hover:bg-muted/10 ${i % 2 === 0 ? '' : 'bg-muted/5'}`}>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{v.id}</td>
                  <td className="px-4 py-3 font-medium text-foreground">{v.name}</td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className="font-mono text-[10px] border-border/50">{v.gate}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border uppercase tracking-widest font-bold ${statusColors[v.status] ?? statusColors['active']}`}>
                      {v.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{v.phone}</td>
                  <td className="px-4 py-3">
                    <Button size="sm" variant="outline" className="text-xs h-7 border-border/40 gap-1.5">
                      <Lock className="w-3 h-3" /> Gen Login
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ChatInterface({ initialMessages, placeholder, title, icon }: {
  initialMessages: Message[];
  placeholder: string;
  title: string;
  icon: React.ReactNode;
}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [draft, setDraft] = useState('');

  const handleSend = () => {
    if (!draft.trim()) return;
    const now = new Date();
    setMessages(m => [...m, {
      from: 'Admin',
      text: draft.trim(),
      time: `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`,
      outgoing: true,
    }]);
    setDraft('');
  };

  return (
    <div className={`${glass} flex flex-col h-[600px]`}>
      <GlassNoise />
      <div className="relative z-10 flex items-center gap-3 p-5 border-b border-border/40">
        {icon}
        <div>
          <h2 className="font-semibold text-base">{title}</h2>
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-mono">Live Channel · Encrypted</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[oklch(0.65_0.15_150)] animate-pulse" />
          <span className="text-xs text-muted-foreground font-mono">LIVE</span>
        </div>
      </div>
      <div className="relative z-10 flex-1 overflow-y-auto p-5 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.outgoing ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${msg.outgoing
              ? 'bg-primary text-primary-foreground rounded-tr-sm'
              : 'bg-muted/40 border border-border/40 rounded-tl-sm'
            }`}>
              {!msg.outgoing && (
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1 font-mono">{msg.from}</div>
              )}
              <p className="text-sm leading-relaxed">{msg.text}</p>
              <div className={`text-[10px] mt-1 font-mono ${msg.outgoing ? 'text-primary-foreground/60 text-right' : 'text-muted-foreground'}`}>
                {msg.time}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="relative z-10 p-4 border-t border-border/40 flex gap-3">
        <Input
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder={placeholder}
          className="flex-1 bg-muted/20 border-border/40 focus:border-primary/50"
        />
        <Button onClick={handleSend} className="gap-2 shrink-0"><Send className="w-4 h-4" /></Button>
      </div>
    </div>
  );
}

function GlobalNotificationsTab() {
  const [broadcastText, setBroadcastText] = useState('');
  const [sending, setSending] = useState(false);

  const handleBroadcast = async (label: string, text?: string) => {
    const message = text ?? broadcastText;
    if (!message.trim()) return;
    setSending(true);
    try {
      const supabase = createBrowserSupabaseClient();
      const { error } = await supabase.from('event_logs').insert([{
        event_type: 'ZONE_WARNING',
        ai_action_taken: `[ADMIN BROADCAST] ${label}: ${message}`,
      }]);
      if (error) throw error;
      toast.success('Broadcast Sent Successfully', {
        description: `"${message.slice(0, 60)}${message.length > 60 ? '...' : ''}" logged to event audit trail.`,
      });
      if (!text) setBroadcastText('');
    } catch {
      toast.error('Broadcast Failed', { description: 'Could not write to event_logs. Check DB schema.' });
    } finally {
      setSending(false);
    }
  };

  const alerts = [
    { id: 'macro-weather', label: 'Weather Advisory',    desc: 'Broadcast rain warning to all fans on the app.',     icon: <AlertTriangle className="w-5 h-5 text-[oklch(0.75_0.18_85)]" />, color: 'border-[oklch(0.75_0.18_85)]/30 bg-[oklch(0.75_0.18_85)]/5' },
    { id: 'macro-sos',     label: 'Emergency SOS',        desc: 'Full-stadium Red Alert. Triggers PA system override.', icon: <Volume2 className="w-5 h-5 text-[oklch(0.55_0.22_27)]" />,      color: 'border-[oklch(0.55_0.22_27)]/30 bg-[oklch(0.55_0.22_27)]/5' },
    { id: 'macro-gate',    label: 'Gate Status Push',     desc: 'Send gate open/close status to all fans via PWA.',    icon: <Wifi className="w-5 h-5 text-primary/60" />,                      color: 'border-border/40 bg-muted/10' },
    { id: 'macro-vanguard',label: 'Vanguard Bulk Bounty', desc: 'Issue mass rerouting bounties to overloaded gates.',  icon: <Megaphone className="w-5 h-5 text-[oklch(0.65_0.15_150)]" />,    color: 'border-[oklch(0.65_0.15_150)]/30 bg-[oklch(0.65_0.15_150)]/5' },
  ];

  return (
    <div className={`${glass} p-8`}>
      <GlassNoise />
      <div className="relative z-10">
        <h2 className="text-2xl font-semibold tracking-tight mb-1">Global Notifications</h2>
        <p className="text-sm text-muted-foreground uppercase tracking-widest font-mono mb-8">Stadium-Wide Macro Alerts · All Channels</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          {alerts.map(a => (
            <div key={a.id} className={`flex items-start gap-4 p-5 rounded-xl border ${a.color}`}>
              <div className="mt-0.5 shrink-0">{a.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm mb-0.5">{a.label}</div>
                <div className="text-xs text-muted-foreground leading-relaxed">{a.desc}</div>
              </div>
              <Button
                size="sm" variant="outline"
                className="shrink-0 text-xs border-border/40 gap-1.5 self-center"
                onClick={() => handleBroadcast(a.label, a.desc)}
                disabled={sending}
              >
                <Send className="w-3 h-3" /> Broadcast
              </Button>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <Label className="text-xs uppercase tracking-widest text-muted-foreground">Custom Broadcast Message</Label>
          <Textarea
            rows={3}
            value={broadcastText}
            onChange={e => setBroadcastText(e.target.value)}
            placeholder="Type a custom message to broadcast to all 55,000 fans via the PWA push system..."
            className="bg-muted/20 border-border/40 font-mono text-sm resize-none"
          />
          <div className="flex gap-3">
            <Button className="gap-2" onClick={() => handleBroadcast('Custom Broadcast')} disabled={sending || !broadcastText.trim()}>
              <Megaphone className="w-4 h-4" /> Send to All Fans
            </Button>
            <Button variant="outline" className="gap-2 border-border/40" onClick={() => handleBroadcast('Volunteer Alert')} disabled={sending || !broadcastText.trim()}>
              <ShieldCheck className="w-4 h-4" /> Volunteers Only
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Orchestrator ────────────────────────────────────────────────────────
export function AdminClientOrchestrator() {
  const agentControls = useAgentStream();
  const { executeAgentQuery, agentState } = agentControls;
  const lastInvocationTime = useRef<number>(0);
  const [crisisState, setCrisisState] = useState<{ active: boolean, gate: string }>({ active: false, gate: '' });

  const handleDensityUpdate = useCallback((gateId: string, density: number) => {
    if (density >= 95 && !crisisState.active) {
      setCrisisState({ active: true, gate: gateId });
      executeAgentQuery(gateId, density);
    } else if (density > 75 && density < 95) {
      const now = Date.now();
      if (now - lastInvocationTime.current > 10000 && agentState === 'idle') {
        lastInvocationTime.current = now;
        executeAgentQuery(gateId, density);
      }
    }
  }, [executeAgentQuery, agentState, crisisState.active]);

  return (
    <>
      <AnimatePresence>
        {crisisState.active && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-slate-950 border-2 border-destructive/50 rounded-3xl shadow-[0_0_100px_rgba(239,68,68,0.2)] max-w-2xl w-full p-8 flex flex-col items-center text-center relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.05] mix-blend-overlay pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-destructive/20 to-transparent pointer-events-none" />
              
              <AlertTriangle className="w-16 h-16 text-destructive animate-pulse mb-6 relative z-10" />
              
              <h2 className="text-3xl font-black uppercase tracking-tighter text-white mb-2 relative z-10">
                Critical Density Detected
              </h2>
              <div className="text-destructive font-mono font-bold tracking-widest text-sm mb-8 relative z-10 bg-destructive/10 px-4 py-1.5 rounded-full border border-destructive/20">
                {crisisState.gate} • SHOCKWAVE RISK HIGH
              </div>

              <div className="w-full bg-black/40 rounded-xl p-4 text-left border border-white/5 mb-8 relative z-10">
                <p className="text-slate-400 text-xs font-mono uppercase tracking-widest mb-3">AI Copilot Analysis</p>
                <div className="space-y-2 font-mono text-sm">
                  <p className="text-slate-300">Fetching Volunteer Lead for {crisisState.gate}...</p>
                  <p className="text-emerald-400">[Name: Rahul Sharma, Ph: +91 98765 43210]</p>
                  <p className="text-amber-400">Drafting SOS to Fans to step back...</p>
                  <p className="text-destructive font-bold animate-pulse mt-2">AWAITING HUMAN APPROVAL</p>
                </div>
              </div>

              <div className="flex gap-4 w-full relative z-10">
                <Button 
                  onClick={() => {
                    setCrisisState({ active: false, gate: '' });
                    toast.success('Crisis Protocol Deployed', { description: 'Lockdown orders dispatched to Volunteer and Fans.' });
                  }}
                  className="flex-1 h-16 text-lg font-black tracking-widest uppercase bg-destructive hover:bg-destructive/90 text-white shadow-[0_0_30px_rgba(239,68,68,0.5)]"
                >
                  Approve Crisis Protocol
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setCrisisState({ active: false, gate: '' })}
                  className="h-16 px-8 text-sm font-bold tracking-widest uppercase border-white/10 hover:bg-white/5"
                >
                  Override
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Tabs defaultValue="tactical" orientation="horizontal" className="flex-1 flex flex-col gap-4 min-h-0">
        <TabsList className="flex-shrink-0 w-full justify-start gap-1 h-auto p-1.5 bg-muted/20 border border-border/40 rounded-xl overflow-x-auto">
          {[
            { value: 'tactical',   icon: <Map className="w-4 h-4" />,          label: 'Tactical Map' },
            { value: 'event',      icon: <CalendarDays className="w-4 h-4" />, label: 'Event Details' },
            { value: 'volunteers', icon: <Users className="w-4 h-4" />,        label: 'Volunteers' },
            { value: 'vol-comms',  icon: <Radio className="w-4 h-4" />,        label: 'Vol. Comms' },
            { value: 'fan-comms',  icon: <MessageSquare className="w-4 h-4" />,label: 'Fan Comms' },
            { value: 'notify',     icon: <Bell className="w-4 h-4" />,         label: 'Notifications' },
          ].map(tab => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="gap-2 px-4 py-2 text-xs rounded-lg font-medium"
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="flex-1 min-h-0 overflow-y-auto">
          <TabsContent value="tactical" keepMounted>
            <TacticalTab onDensityUpdate={handleDensityUpdate} agentControls={agentControls} />
          </TabsContent>

          <TabsContent value="event">
            <EventDetailsTab />
          </TabsContent>

          <TabsContent value="volunteers">
            <VolunteerManagementTab />
          </TabsContent>

          <TabsContent value="vol-comms">
            <ChatInterface
              initialMessages={seedVolMsg}
              placeholder="Dispatch order to volunteers..."
              title="Volunteer Dispatch Channel"
              icon={<Radio className="w-5 h-5 text-[oklch(0.75_0.18_85)]" />}
            />
          </TabsContent>

          <TabsContent value="fan-comms">
            <ChatInterface
              initialMessages={seedFanMsg}
              placeholder="Send Vanguard rerouting prompt to fans..."
              title="Fan Rerouting Channel"
              icon={<MessageSquare className="w-5 h-5 text-[oklch(0.65_0.15_150)]" />}
            />
          </TabsContent>

          <TabsContent value="notify">
            <GlobalNotificationsTab />
          </TabsContent>
        </div>
      </Tabs>
    </>
  );
}
