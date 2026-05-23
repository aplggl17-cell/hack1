'use client';

import { useEffect, useState, useRef } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase/browser';
import { StadiumBlock } from '@/types';

export function useLiveMatch(blockId: string, onDensityChange: (currentGate: string, density: number) => void) {
  const [latestBlock, setLatestBlock] = useState<StadiumBlock | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'live' | 'disconnected'>('connecting');
  
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastFiredTimeRef = useRef<number>(0);
  const lastFiredDensityRef = useRef<number | null>(null);

  // Stable reference for the callback
  const callbackRef = useRef(onDensityChange);
  useEffect(() => {
    callbackRef.current = onDensityChange;
  }, [onDensityChange]);

  const supabase = createBrowserSupabaseClient();

  useEffect(() => {
    const channel = supabase
      .channel(`live-stadium-block-${blockId}`)
      .on(
        'postgres_changes',
        {
          event: '*', // Listen for INSERT and UPDATE
          schema: 'public',
          table: 'stadium_blocks',
          filter: `block_id=eq.${blockId}`
        },
        (payload) => {
          const newBlock = payload.new as StadiumBlock;
          if (!newBlock || newBlock.current_density_pct === undefined) return;
          
          setLatestBlock(newBlock);

          const now = Date.now();
          const density = newBlock.current_density_pct;
          const timeSinceLastFire = now - lastFiredTimeRef.current;
          
          // "Significant change" = 10% difference
          const isSignificantChange = lastFiredDensityRef.current === null || Math.abs(density - lastFiredDensityRef.current) >= 10;
          const isQuietPeriodElapsed = timeSinceLastFire >= 15000;

          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }

          const triggerCallback = () => {
            callbackRef.current(blockId, density);
            lastFiredTimeRef.current = Date.now();
            lastFiredDensityRef.current = density;
            timeoutRef.current = null;
          };

          if (isQuietPeriodElapsed || isSignificantChange) {
             triggerCallback();
          } else {
             timeoutRef.current = setTimeout(triggerCallback, 15000 - timeSinceLastFire);
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') setConnectionStatus('live');
        if (status === 'CLOSED' || status === 'CHANNEL_ERROR') setConnectionStatus('disconnected');
      });

    return () => {
      supabase.removeChannel(channel);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [blockId, supabase]);

  return { latestBlock, connectionStatus };
}
