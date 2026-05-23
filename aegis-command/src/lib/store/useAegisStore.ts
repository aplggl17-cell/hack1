import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { idbStorage } from './idbStorage';
import { User } from '@/types';

interface AegisState {
  user: User | null;
  activeGate: string | null;
  offlineQueue: any[];
  setUser: (user: User | null) => void;
  setGate: (gate: string | null) => void;
  queueOfflineAction: (action: any) => void;
  clearStore: () => void;
}

export const useAegisStore = create<AegisState>()(
  persist(
    (set) => ({
      user: null,
      activeGate: null,
      offlineQueue: [],

      setUser: (user) => set({ user }),
      
      setGate: (activeGate) => set({ activeGate }),

      queueOfflineAction: (action) =>
        set((state) => ({
          offlineQueue: [...state.offlineQueue, action],
        })),

      clearStore: () =>
        set({
          user: null,
          activeGate: null,
          offlineQueue: [],
        }),
    }),
    {
      name: 'aegis-offline-store',
      storage: createJSONStorage(() => idbStorage),
    }
  )
);
