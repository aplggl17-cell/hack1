import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-slate-950 text-slate-100 p-6">
      <div className="w-full max-w-3xl space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-4 rounded-full bg-slate-900 border border-slate-800 mb-4 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">Project Aegis</h1>
          <p className="text-lg text-slate-400 max-w-xl mx-auto">
            Zero-trust, multi-agent spatial operating system designed for algorithmic crowd safety.
          </p>
        </div>

        {/* Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Fan Link */}
          <Link href="/fan" className="group flex flex-col p-6 bg-slate-900 border border-slate-800 rounded-2xl hover:border-emerald-500/50 hover:bg-slate-800/50 transition-all cursor-pointer">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Fan Portal</h2>
            <p className="text-sm text-slate-400">Access your digital pass and participate in Vanguard gamification.</p>
          </Link>

          {/* Volunteer Link */}
          <Link href="/volunteer" className="group flex flex-col p-6 bg-slate-900 border border-slate-800 rounded-2xl hover:border-amber-500/50 hover:bg-slate-800/50 transition-all cursor-pointer">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Action Node</h2>
            <p className="text-sm text-slate-400">Hardware-bound Push-to-Talk emergency routing for volunteers.</p>
          </Link>

          {/* Admin Link */}
          <Link href="/admin" className="group flex flex-col p-6 bg-slate-900 border border-slate-800 rounded-2xl hover:border-blue-500/50 hover:bg-slate-800/50 transition-all cursor-pointer">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Command Center</h2>
            <p className="text-sm text-slate-400">Live SVG stadium telemetry and Antigravity AI Maker-Checker terminal.</p>
          </Link>

        </div>
        
      </div>
    </div>
  )
}
