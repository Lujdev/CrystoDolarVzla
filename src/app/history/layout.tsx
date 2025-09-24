import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Historial de Cotizaciones',
  description: 'Consulta el historial completo de cotizaciones USDT/Bs, USD/Bs y EUR/Bs. Gráficos interactivos con datos de BCV, Binance P2P e ITALCAMBIOS.',
  keywords: [
    'historial cotizaciones',
    'gráficos USDT',
    'histórico BCV',
    'tendencias dólar',
    'análisis precios',
    'Venezuela',
    'bolívares histórico'
  ],
  openGraph: {
    title: 'Historial de Cotizaciones | CrystoDolar',
    description: 'Analiza las tendencias históricas de las cotizaciones USDT/Bs con gráficos interactivos.',
    url: 'https://crystodolar.com/history',
  },
}

export default function HistoryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
