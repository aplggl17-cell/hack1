'use client'

import { useState, useEffect } from 'react'
import { useAegisStore } from '@/lib/store/useAegisStore'
import { createBrowserSupabaseClient } from '@/lib/supabase/clients'
import { VanguardAlertBanner } from '@/components/vanguard/VanguardAlertBanner'

export default function FanPage() {
  const [isHydrated, setIsHydrated] = useState(false)
  const [consentInput, setConsentInput] = useState('')
  const [sosLoading, setSosLoading] = useState(false)
  const { has_consented, ticket, setConsented, setTicket, enqueueSOS, updatePoints } = useAegisStore()
  const supabase = createBrowserSupabaseClient()

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    if (isHydrated && has_consented) {
      const fetchUserData = async () => {
        try {
          const { data: user } = await supabase
            .from('users')
            .select('*')
            .eq('email', 'demo@fan.aegis')
            .single()
          
          if (user) {
            setTicket({
              assigned_gate: user.assigned_gate,
              points: user.vanguard_points
            })
          }
        } catch (err) {
          console.error(err)
        }
      }
      fetchUserData()
    }
  }, [isHydrated, has_consented])

  if (!isHydrated) return <div className="h-[100dvh] bg-slate-950" />

  if (!has_consented) {
    return (
      <div className="flex flex-col items-center justify-center h-[100dvh] bg-slate-950 text-slate-100 p-6 pb-[env(safe-area-inset-bottom)]">
        <div className="w-full max-w-md space-y-8 text-center">
          <div className="text-emerald-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Temporary Event Access. Zero Data Retention.</h1>
          <p className="text-sm text-slate-400">
            Your location data is anonymized and used exclusively for algorithmic crowd safety. All PII and spatial telemetry will be cryptographically shredded 2 hours post-event.
          </p>
          <div className="space-y-4 pt-4 flex flex-col items-center">
            <input 
              type="text"
              placeholder='Type "I AGREE"' 
              value={consentInput}
              onChange={(e) => setConsentInput(e.target.value)}
              className="text-center bg-slate-900 border border-slate-800 rounded-full px-4 py-2 w-full focus:outline-none focus:border-emerald-500"
            />
            <button 
              className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-800 disabled:text-slate-500 text-white font-semibold py-2 rounded-full transition-colors"
              disabled={consentInput !== 'I AGREE'}
              onClick={() => setConsented(true)}
            >
              Enter Stadium View
            </button>
          </div>
        </div>
      </div>
    )
  }

  const handleSOS = async () => {
    setSosLoading(true)
    try {
      if (!navigator.onLine) {
        enqueueSOS({ timestamp: Date.now() })
        alert('Network unreachable. Offline Mode Active. Encrypted SOS queued for background sync.')
      } else {
        await supabase.from('event_logs').insert({
          event_type: 'RED_ZONE_SOS',
          timestamp: new Date().toISOString()
        })
        alert('Connection restored. Priority SOS delivered.')
      }
    } catch (err) {
      console.error(err)
    } finally {
      setSosLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-[100dvh] w-full bg-slate-950 text-slate-100 overflow-hidden pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)] relative">
      <VanguardAlertBanner />
      
      <header className="flex-none p-4 bg-slate-900 border-b border-slate-800 shadow-sm">
        <h1 className="text-lg font-bold tracking-tight">Digital Pass Dashboard</h1>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">Your Pass</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-slate-400">Assigned Gate</p>
              <p className="text-2xl font-bold tracking-tight">{ticket?.assigned_gate || 'Loading...'}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Vanguard Points</p>
              <p className="text-2xl font-bold text-emerald-500 tracking-tight">{ticket?.points || 0}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-none p-4 bg-slate-900 border-t border-slate-800">
        <button 
          className="w-full h-12 text-lg font-bold bg-destructive hover:bg-destructive/90 text-white rounded-xl transition-colors disabled:opacity-50"
          onClick={handleSOS}
          disabled={sosLoading}
        >
          {sosLoading ? 'Processing...' : 'SOS Request'}
        </button>
      </div>
    </div>
  )
}
