import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'CrystoDolar - Cotizaciones USDT/Bs',
    short_name: 'CrystoDolar',
    description: 'Consulta las mejores cotizaciones de USDT a Bolívares venezolanos en tiempo real',
    start_url: '/',
    display: 'standalone',
    background_color: '#111827',
    theme_color: '#10B981',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    categories: ['finance', 'business'],
    lang: 'es-VE',
  }
}
