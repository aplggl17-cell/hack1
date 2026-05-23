'use client';

import { motion, Variants } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ShieldAlert, Activity, ShieldCheck, Zap, Users } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function LandingPage() {
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);

  // LEM_ON Protocol: Delay Framer Motion until client hydration is complete
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handlePortalAccess = (route: string) => {
    router.push(route);
  };

  if (!isHydrated) {
    return <div className="h-[100dvh] bg-background pb-safe" />;
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <div className="h-[100dvh] flex flex-col relative overflow-hidden bg-background text-foreground overflow-y-auto" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      {/* Kinetic Background & Noise */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.05, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"
        />
        <div 
          className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
          style={{ backgroundImage: "url('/noise.svg')" }}
        />
      </div>

      <motion.main 
        className="relative z-10 flex-1 flex flex-col items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header / Hero */}
        <motion.div variants={itemVariants} className="text-center max-w-3xl mb-16 mt-8">
          <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-primary mb-6">
            Project Aegis
          </span>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight mb-6 leading-tight">
            Predictive Crowd Safety.<br/>
            <span className="text-primary/90 font-mono text-3xl md:text-5xl uppercase tracking-widest">Zero-Trust Operations.</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A military-grade, Genkit-powered orchestrator designed to eliminate manual estimation and actively prevent kinetic crowd shockwaves before they occur.
          </p>
        </motion.div>

        {/* Instant Access Portals */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mb-24">
          <PortalCard 
            title="Command Center"
            desc="Tier 1 Admin Override & Telemetry"
            icon={<ShieldCheck className="w-8 h-8" />}
            route="/admin"
            color="border-primary/30"
            onClick={() => handlePortalAccess('/admin')}
          />
          <PortalCard 
            title="Action Node"
            desc="Tier 2 Volunteer Web Speech API"
            icon={<Activity className="w-8 h-8" />}
            route="/volunteer"
            color="border-[oklch(0.75_0.18_85)]/30"
            onClick={() => handlePortalAccess('/volunteer')}
          />
          <PortalCard 
            title="Digital Ticket"
            desc="Tier 3 Fan PWA & Bounties"
            icon={<Users className="w-8 h-8" />}
            route="/fan"
            color="border-[oklch(0.65_0.15_150)]/30"
            onClick={() => handlePortalAccess('/fan')}
          />
        </motion.div>

        {/* Detailed Research & Statistics Matrix */}
        <motion.div variants={itemVariants} className="w-full max-w-7xl mb-16">
          <div className="flex items-center gap-3 mb-8">
            <ShieldAlert className="w-6 h-6 text-destructive" />
            <h2 className="text-2xl font-bold tracking-tight uppercase">The Statistics of the Manual Gap</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Column 1: Historical Ledger */}
            <div className="bg-destructive/5 border border-destructive/20 rounded-2xl p-8 relative overflow-hidden backdrop-blur-[64px] flex flex-col">
              <h3 className="text-lg font-bold tracking-tight text-destructive mb-6 uppercase">A Decade of Disasters (2016-2026)</h3>
              <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
                Empirical data proves the lethality of reactive policing and visual density estimation.
              </p>
              <div className="flex flex-col gap-4">
                <div className="border-l-2 border-destructive/50 pl-4">
                  <div className="text-xs text-destructive font-mono font-bold mb-1">June 4, 2025 • Bengaluru</div>
                  <div className="text-sm font-semibold mb-1">RCB Victory Parade</div>
                  <div className="text-xs text-muted-foreground">11 Dead, 56 Injured</div>
                </div>
                <div className="border-l-2 border-destructive/30 pl-4">
                  <div className="text-xs text-destructive/70 font-mono font-bold mb-1">Sept 22, 2022 • Hyderabad</div>
                  <div className="text-sm font-semibold mb-1">Gymkhana Ticket Surge</div>
                  <div className="text-xs text-muted-foreground">20+ Injured</div>
                </div>
                <div className="border-l-2 border-destructive/30 pl-4">
                  <div className="text-xs text-destructive/70 font-mono font-bold mb-1">March 19, 2022 • Kerala</div>
                  <div className="text-sm font-semibold mb-1">Poongod Stadium Collapse</div>
                  <div className="text-xs text-muted-foreground">200+ Injured</div>
                </div>
                <div className="border-l-2 border-destructive/30 pl-4">
                  <div className="text-xs text-destructive/70 font-mono font-bold mb-1">March 22, 2021 • Telangana</div>
                  <div className="text-sm font-semibold mb-1">Police Grounds Gallery</div>
                  <div className="text-xs text-muted-foreground">80+ Injured</div>
                </div>
              </div>
            </div>

            {/* Column 2: Physics of a Crush */}
            <div className="bg-background/40 border border-border/50 rounded-2xl p-8 relative overflow-hidden backdrop-blur-[64px] flex flex-col">
              <h3 className="text-lg font-bold tracking-tight text-foreground mb-6 uppercase">The Physics of a Crush</h3>
              <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
                Crushes are governed by exact mathematical thresholds of fluid dynamics, not random panic.
              </p>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Safe Capacity</span>
                    <span className="text-sm font-bold text-[oklch(0.65_0.15_150)]">1-2 / m²</span>
                  </div>
                  <div className="w-full bg-secondary/50 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-[oklch(0.65_0.15_150)] h-full w-[25%]"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Critical Restriction</span>
                    <span className="text-sm font-bold text-orange-500">4-5 / m²</span>
                  </div>
                  <div className="w-full bg-secondary/50 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-orange-500 h-full w-[75%]"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Lethal Fluid Mass</span>
                    <span className="text-sm font-bold text-destructive">&gt; 6 / m²</span>
                  </div>
                  <div className="w-full bg-secondary/50 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-destructive h-full w-[100%] animate-pulse"></div>
                  </div>
                </div>
              </div>

              <div className="mt-8 bg-black/20 rounded-xl p-4 border border-white/5">
                <div className="text-xs text-muted-foreground mb-2">Mechanism of Death</div>
                <div className="font-mono text-sm text-foreground">Compressive Asphyxia</div>
                <div className="text-[10px] text-muted-foreground mt-2 uppercase tracking-widest leading-relaxed">
                  Loss of physical autonomy causes kinetic shockwaves exceeding <span className="text-destructive font-bold">4,000 Newtons</span> of multi-directional force.
                </div>
              </div>
            </div>

            {/* Column 3: The Aegis Prevention */}
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8 relative overflow-hidden backdrop-blur-[64px] flex flex-col">
              <h3 className="text-lg font-bold tracking-tight text-primary mb-6 uppercase">How Aegis Prevents It</h3>
              <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
                Replacing manual estimation and VHF radio silos with zero-trust algorithmic preemption.
              </p>

              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                    <Activity className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground mb-1">Algorithmic Preemption</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      CSRNet + 3D LiDAR identifies invisible density chokepoints 5-12 minutes before they form.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                    <Users className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground mb-1">The Vanguard Protocol</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Dynamic "Trend Alerts" automatically push gamified rerouting bounties to fan devices before density hits 4.5 / m².
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                    <ShieldCheck className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground mb-1">Maker-Checker Triage</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Voice PTT triggers instant digital lock-downs and proactive alerts to medical & police teams, bypassing bureaucratic latency.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </motion.div>

      </motion.main>
    </div>
  );
}

function PortalCard({ title, desc, icon, color, onClick }: any) {
  return (
    <div 
      onClick={onClick}
      className={`group relative bg-background/60 backdrop-blur-[64px] border ${color} rounded-2xl p-8 cursor-pointer overflow-hidden transition-all duration-300 hover:bg-muted/10 hover:shadow-2xl hover:-translate-y-1`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="text-foreground/80 group-hover:text-foreground transition-all group-hover:scale-110 transform duration-300 origin-left mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-semibold tracking-tight mb-2">{title}</h3>
      <p className="text-xs text-muted-foreground font-mono uppercase tracking-widest">{desc}</p>
    </div>
  );
}

function StatCard({ icon, label, value }: any) {
  return (
    <div className="bg-background/40 backdrop-blur-[64px] border border-border/50 rounded-2xl p-6 flex flex-col justify-center">
      <div className="text-muted-foreground mb-4">{icon}</div>
      <div className="text-2xl font-mono font-bold tracking-tight mb-1">{value}</div>
      <div className="text-[10px] text-muted-foreground uppercase tracking-widest">{label}</div>
    </div>
  );
}
