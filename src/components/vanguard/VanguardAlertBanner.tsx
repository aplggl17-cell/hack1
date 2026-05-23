'use client'

import { useState, useEffect } from 'react'
import { useAegisStore } from '@/lib/store/useAegisStore'
import { createBrowserSupabaseClient } from '@/lib/supabase/clients'

export function VanguardAlertBanner() {
  const [bounty, setBounty] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const updatePoints = useAegisStore(state => state.updatePoints)
  const ticket = useAegisStore(state => state.ticket)
  const supabase = createBrowserSupabaseClient()

  useEffect(() => {
    const fetchBounty = async () => {
      try {
        const { data: user } = await supabase
          .from('users')
          .select('id')
          .eq('email', 'demo@fan.aegis')
          .single()
        
        if (!user) return

        const { data: activeBounty } = await supabase
          .from('vanguard_bounties')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'PENDING')
          .single()

        if (activeBounty) {
          setBounty(activeBounty)
        }
      } catch (error) {
        console.error('Error fetching bounty:', error)
      }
    }
    fetchBounty()
    
    const interval = setInterval(fetchBounty, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleClaim = async () => {
    if (!bounty) return
    setLoading(true)
    try {
      const { data, error } = await supabase.rpc('claim_vanguard_bounty', {
        bounty_id: bounty.id
      })
      if (!error) {
        updatePoints((ticket?.points || 0) + 500)
        setBounty(null)
      } else {
        const res = await fetch('/api/vanguard/claim', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bounty_id: bounty.id })
        })
        if (res.ok) {
           updatePoints((ticket?.points || 0) + 500)
           setBounty(null)
        }
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (!bounty) return null

  return (
    <div className="fixed top-4 left-4 right-4 z-50 animate-in slide-in-from-top-4 fade-in duration-300">
      <div className="bg-slate-900 border border-emerald-500 shadow-2xl p-4 rounded-xl">
        <h5 className="text-emerald-500 font-bold mb-2">Vanguard Reroute Request</h5>
        <div className="flex flex-col gap-3">
          <p className="text-slate-200 text-sm">
            High congestion ahead. Reroute to Gate 4 and earn 500 points!
          </p>
          <button 
            onClick={handleClaim} 
            disabled={loading}
            className="w-full animate-pulse bg-emerald-500 text-white hover:bg-emerald-600 rounded-full py-2 font-semibold"
          >
            {loading ? 'Processing...' : 'Accept Reroute'}
          </button>
        </div>
      </div>
    </div>
  )
}
