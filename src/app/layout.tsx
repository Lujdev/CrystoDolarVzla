import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { CryptoContextProvider } from '@/lib/crypto-context'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

export const metadata: Metadata = {
  metadataBase: new URL('https://crystodolar.com'),
  title: {
    default: 'CrystoDolar - Cotizaciones USDT/Bs en Tiempo Real',
    template: '%s | CrystoDolar'
  },
  description: 'Consulta las mejores cotizaciones de USDT a Bolívares venezolanos en tiempo real. Compara precios de BCV, Binance P2P, ITALCAMBIOS y más exchanges. Calculadora de divisas incluida.',
  keywords: [
    'USDT',
    'Bolívares',
    'Venezuela',
    'cotizaciones',
    'dólar',
    'euro',
    'BCV',
    'Binance P2P',
    'ITALCAMBIOS',
    'cambio de moneda',
    'criptomonedas',
    'tasa de cambio',
    'tiempo real',
    'calculadora divisas'
  ],
  authors: [
    { name: 'CrystoDolar Team' }
  ],
  creator: 'CrystoDolar',
  publisher: 'CrystoDolar',
  category: 'Finance',
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'es_VE',
    url: 'https://crystodolar.com',
    title: 'CrystoDolar - Cotizaciones USDT/Bs en Tiempo Real',
    description: 'Las mejores cotizaciones de USDT a Bolívares venezolanos. Compara precios de múltiples exchanges en tiempo real.',
    siteName: 'CrystoDolar',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CrystoDolar - Cotizaciones USDT/Bs',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CrystoDolar - Cotizaciones USDT/Bs',
    description: 'Las mejores cotizaciones de USDT a Bolívares venezolanos en tiempo real.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://crystodolar.com',
  },
};

/**
 * Layout principal de CrystoDolar
 * Incluye el proveedor CryptoContext para estado global de cotizaciones USDT/Bs
 * Configurado para mercado fiat/crypto venezolano
 * Integrado con Vercel Speed Insights para monitoreo de rendimiento
 * Optimizado para eliminar solicitudes CSS que bloquean el renderizado
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        {/* Preload de fuentes críticas para mejorar FCP */}
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* DNS prefetch para recursos externos */}
        <link rel="dns-prefetch" href="//cdn.crystodolarvzla.site" />
        <link rel="dns-prefetch" href="//crystodolar-api-production.up.railway.app" />
        
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'CrystoDolar',
              url: 'https://crystodolar.com',
              description: 'Consulta las mejores cotizaciones de USDT a Bolívares venezolanos en tiempo real',
              applicationCategory: 'FinanceApplication',
              operatingSystem: 'Web',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
              provider: {
                '@type': 'Organization',
                name: 'CrystoDolar',
                url: 'https://crystodolar.com',
              },
              featureList: [
                'Cotizaciones en tiempo real',
                'Múltiples exchanges',
                'Calculadora de divisas',
                'Gráficos históricos',
                'Comparación de precios'
              ],
              inLanguage: 'es-VE',
            }),
          }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        <div className="min-h-screen bg-gray-900">
          <CryptoContextProvider>
            {children}
          </CryptoContextProvider>
        </div>
      </body>
    </html>
  );
}
