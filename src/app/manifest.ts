import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'APL Agentic Match Hub',
    short_name: 'MatchHub',
    description: 'Autonomous AI Co-pilot for Live Cricket.',
    start_url: '/',
    display: 'standalone', // Removes the browser URL bar
    background_color: '#020617', // tailwind slate-950
    theme_color: '#0f172a', // tailwind slate-900
    icons: [
      {
        src: '/icon-192x192.png', // Add a simple logo to your /public folder
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
