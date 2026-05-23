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

        {/* Research Context & Stats */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full max-w-5xl mb-16">
          {/* Tragedy Context */}
          <div className="bg-destructive/5 border border-destructive/20 rounded-2xl p-8 relative overflow-hidden backdrop-blur-[64px]">
            <div className="flex items-center gap-3 mb-6 text-destructive">
              <ShieldAlert className="w-6 h-6" />
              <h2 className="text-xl font-bold tracking-tight uppercase">Solving the Manual Gap</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              On June 4, 2025, the spontaneous influx of fans during the RCB victory parade exposed profound vulnerabilities in manual crowd control paradigms at M. Chinnaswamy Stadium.
            </p>
            <div className="flex gap-6 mt-6 pt-6 border-t border-destructive/10">
              <div>
                <div className="text-3xl font-mono text-destructive font-bold">11</div>
                <div className="text-xs uppercase tracking-widest text-destructive/70 mt-1">Fatalities</div>
              </div>
              <div>
                <div className="text-3xl font-mono text-destructive font-bold">56</div>
                <div className="text-xs uppercase tracking-widest text-destructive/70 mt-1">Injuries</div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <StatCard icon={<Activity className="w-5 h-5" />} label="Density Accuracy" value="95%" />
            <StatCard icon={<Zap className="w-5 h-5" />} label="AI Response Time" value="< 15s" />
            <StatCard icon={<ShieldCheck className="w-5 h-5" />} label="Verified" value="Zero-Trust" />
            <StatCard icon={<Users className="w-5 h-5" />} label="Scalability" value="60k+ Nodes" />
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
