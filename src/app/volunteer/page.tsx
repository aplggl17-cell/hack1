'use client'

import { useState } from 'react'
import { createBrowserSupabaseClient } from '@/lib/supabase/clients'
import { VolunteerVoiceNode } from '@/components/volunteer/VolunteerVoiceNode'
import { useAegisStore } from '@/lib/store/useAegisStore'

export default function VolunteerPage() {
  const [loading, setLoading] = useState(false)
  const enqueueSOS = useAegisStore(state => state.enqueueSOS)
  const supabase = createBrowserSupabaseClient()

  const handleReportThreat = async () => {
    setLoading(true)
    try {
      if (!navigator.onLine) {
        enqueueSOS({ timestamp: Date.now() })
        alert('Network unreachable. Offline Mode Active. Encrypted SOS queued for background sync.')
      } else {
        await supabase.from('event_logs').insert({
          event_type: 'ZONE_WARNING',
          timestamp: new Date().toISOString(),
          raw_payload: { role: 'VOLUNTEER', severity: 'HIGH' }
        })
        alert('Threat Reported Successfully.')
      }
    } catch (error) {
      console.error(error)
      alert('Error reporting threat.')
    } finally {
      setLoading(false)
    }
  }

  const handleGateToggle = async () => {
    if (!navigator.onLine) {
        alert('Cannot toggle gate while offline.')
        return
    }
    
    try {
      await supabase.from('event_logs').insert({
        event_type: 'GATE_CLOSED',
        timestamp: new Date().toISOString(),
        raw_payload: { role: 'VOLUNTEER', action: 'EMERGENCY_LOCK' }
      })
      alert('Emergency Gate Lock Initiated.')
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="flex flex-col h-[100dvh] w-full bg-slate-950 text-slate-100 overflow-hidden pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)] relative">
      <header className="flex-none p-4 bg-slate-900 border-b border-slate-800 shadow-sm flex items-center justify-between">
        <h1 className="text-lg font-bold tracking-tight">Volunteer Action Node</h1>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400 font-mono">SYS_ONLINE</span>
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" title="System Online"></div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        
        <VolunteerVoiceNode />

        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={handleGateToggle}
            className="flex flex-col items-center justify-center p-6 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 transition-colors active:scale-95 group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-500 mb-2 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span className="font-bold text-sm text-slate-300 group-hover:text-white">Lock Gate</span>
          </button>

          <button 
            className="flex flex-col items-center justify-center p-6 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 transition-colors active:scale-95 group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500 mb-2 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
            </svg>
            <span className="font-bold text-sm text-slate-300 group-hover:text-white">Broadcast</span>
          </button>
        </div>
      </div>

      <div className="flex-none p-4 bg-slate-900 border-t border-slate-800">
        <button 
          className="w-full h-16 text-lg font-bold bg-destructive hover:bg-destructive/90 text-white rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
          onClick={handleReportThreat}
          disabled={loading}
        >
          {loading ? (
            <span>Processing...</span>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>Report Threat</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
