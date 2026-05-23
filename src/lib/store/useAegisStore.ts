import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { idbStorage } from './idbStorage';

export interface TicketData {
  assigned_gate: string | null;
  points: number;
}

export interface OfflineSOS {
  timestamp: number;
}

interface AegisState {
  has_consented: boolean;
  ticket: TicketData | null;
  offlineQueue: OfflineSOS[];
  setConsented: (val: boolean) => void;
  setTicket: (ticket: TicketData) => void;
  updatePoints: (points: number) => void;
  enqueueSOS: (sos: OfflineSOS) => void;
  clearOfflineQueue: () => void;
}

export const useAegisStore = create<AegisState>()(
  persist(
    (set) => ({
      has_consented: false,
      ticket: null,
      offlineQueue: [],
      
      setConsented: (val) => set({ has_consented: val }),
      
      setTicket: (ticket) => set({ ticket }),
      
      updatePoints: (points) => set((state) => ({
        ticket: state.ticket ? { ...state.ticket, points } : null
      })),
      
      enqueueSOS: (sos) => set((state) => ({
        offlineQueue: [...state.offlineQueue, sos]
      })),
      
      clearOfflineQueue: () => set({ offlineQueue: [] })
    }),
    {
      name: 'aegis-fan-storage',
      storage: createJSONStorage(() => idbStorage),
      partialize: (state) => ({ has_consented: state.has_consented, ticket: state.ticket, offlineQueue: state.offlineQueue })
    }
  )
);
