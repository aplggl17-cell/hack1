'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { useLiveMatch } from '@/hooks/useLiveMatch';
import { useState, useMemo, useRef } from 'react';
import { cn } from '@/lib/utils';

interface SectorProps {
  index: number;
  gateId: string;
  onDensityUpdate?: (gateId: string, density: number) => void;
}

function getSectorPath(index: number) {
  const cx = 200;
  const cy = 200;
  const innerR = 60;
  const outerR = 180;
  
  const startAngle = (index * 45 - 22.5) * (Math.PI / 180);
  const endAngle = ((index + 1) * 45 - 22.5) * (Math.PI / 180);
  
  const p1x = cx + innerR * Math.cos(startAngle);
  const p1y = cy + innerR * Math.sin(startAngle);
  const p2x = cx + outerR * Math.cos(startAngle);
  const p2y = cy + outerR * Math.sin(startAngle);
  const p3x = cx + outerR * Math.cos(endAngle);
  const p3y = cy + outerR * Math.sin(endAngle);
  const p4x = cx + innerR * Math.cos(endAngle);
  const p4y = cy + innerR * Math.sin(endAngle);
  
  return `M ${p1x} ${p1y} L ${p2x} ${p2y} L ${p3x} ${p3y} L ${p4x} ${p4y} Z`;
}

// Label position for each gate (midpoint of sector, slightly outside)
function getLabelPosition(index: number) {
  const cx = 200;
  const cy = 200;
  const labelR = 133;
  const midAngle = (index * 45) * (Math.PI / 180);
  return {
    x: cx + labelR * Math.cos(midAngle),
    y: cy + labelR * Math.sin(midAngle),
  };
}

function StadiumSector({ index, gateId, onDensityUpdate }: SectorProps) {
  const [density, setDensity] = useState<number>(() => Math.floor(Math.random() * 30) + 10);
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useLiveMatch(gateId, (id, newDensity) => {
    setDensity(newDensity);
    if (onDensityUpdate) onDensityUpdate(id, newDensity);
  });

  const pathD = useMemo(() => getSectorPath(index), [index]);
  const labelPos = useMemo(() => getLabelPosition(index), [index]);

  let fillOklch = 'oklch(0.65 0.15 150)'; // Green
  let strokeWidth = 1;
  let strokeColor = 'rgba(255,255,255,0.2)';
  let opacity = 0.8;
  let extraClasses = '';

  if (density >= 95) {
    fillOklch = 'oklch(0.55 0.22 27)';
    strokeWidth = 3;
    strokeColor = 'oklch(0.55 0.22 27)';
    opacity = 1;
    extraClasses = 'drop-shadow-[0_0_15px_oklch(0.55_0.22_27)]';
  } else if (density >= 75) {
    fillOklch = 'oklch(0.65 0.20 45)';
    strokeWidth = 2;
    strokeColor = '#F97316';
    opacity = 1;
    extraClasses = 'animate-pulse';
  } else if (density >= 40) {
    fillOklch = 'oklch(0.75 0.18 85)';
    strokeWidth = 1.5;
    opacity = 0.9;
  }

  const handleMouseEnter = () => {
    if (tooltipTimer.current) clearTimeout(tooltipTimer.current);
    setShowTooltip(true);
  };
  const handleMouseLeave = () => {
    tooltipTimer.current = setTimeout(() => setShowTooltip(false), 120);
  };

  return (
    <g
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ cursor: 'pointer' }}
    >
      <motion.path
        d={pathD}
        initial={{ fill: fillOklch, opacity }}
        animate={{ fill: fillOklch, opacity, strokeWidth, stroke: strokeColor }}
        transition={{ duration: 0.5 }}
        className={cn('hover:opacity-100 transition-opacity', extraClasses)}
      />
      {/* Gate label rendered in SVG directly — no DOM nesting issue */}
      <text
        x={labelPos.x}
        y={labelPos.y}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="9"
        fill="rgba(255,255,255,0.7)"
        fontFamily="monospace"
        pointerEvents="none"
      >
        {`G${index + 1}`}
      </text>
      {/* Tooltip rendered as foreignObject to avoid asChild/nativeButton issue */}
      {showTooltip && (
        <foreignObject
          x={labelPos.x - 48}
          y={labelPos.y - 76}
          width="96"
          height="68"
          style={{ overflow: 'visible', pointerEvents: 'none' }}
        >
          <div
            className="bg-slate-950/95 backdrop-blur-md border border-slate-700 rounded-lg p-2 shadow-xl font-mono text-white"
            style={{ width: 96 }}
          >
            <div className="text-[9px] text-slate-400 uppercase tracking-widest">{gateId}</div>
            <div className="text-lg font-bold tracking-tight leading-tight">{density}%</div>
            <div className="text-[9px] text-slate-500">Live Density</div>
          </div>
        </foreignObject>
      )}
    </g>
  );
}

export function StadiumMap({ onDensityUpdate }: { onDensityUpdate?: (gateId: string, density: number) => void }) {
  const gates = Array.from({ length: 8 }).map((_, i) => `GATE_${i + 1}`);

  return (
    <Card className="glass-panel p-6 flex flex-col items-center justify-center min-h-[500px] h-full border-border/50 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none z-0" />
      
      <div className="relative z-10 w-full flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium tracking-tight">Tactical Map</h2>
        <div className="flex gap-4 text-xs font-mono tracking-widest text-slate-400 uppercase">
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[oklch(0.65_0.15_150)]" /> Safe</div>
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[oklch(0.75_0.18_85)]" /> Warn</div>
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[oklch(0.65_0.20_45)] animate-pulse" /> Alert</div>
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[oklch(0.55_0.22_27)] animate-pulse" /> Critical</div>
        </div>
      </div>

      <div className="relative w-full max-w-[500px] aspect-square mx-auto z-10 my-auto">
        <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-2xl" overflow="visible">
          {/* Outer ring */}
          <circle cx="200" cy="200" r="184" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
          {/* Pitch / Field */}
          <rect x="160" y="140" width="80" height="120" rx="40" fill="#0A0A0B" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
          {/* AEGIS centre logo text */}
          <text x="200" y="202" textAnchor="middle" dominantBaseline="middle" fontSize="8" fill="rgba(255,255,255,0.3)" fontFamily="monospace" letterSpacing="2">AEGIS</text>
          {gates.map((gateId, index) => (
            <StadiumSector key={gateId} index={index} gateId={gateId} onDensityUpdate={onDensityUpdate} />
          ))}
        </svg>
      </div>
    </Card>
  );
}
