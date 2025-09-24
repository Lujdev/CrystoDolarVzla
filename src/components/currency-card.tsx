'use client'

import { useState, useRef, useEffect } from 'react'
import { TrendingUp, TrendingDown, Minus, DollarSign, Building2, Calculator, Globe, InfoIcon, Euro, Wallet } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { CryptoRate } from '@/types/currency'
import { formatBolivares, getExchangeConfig } from '@/lib/crypto-data'
import { CalculatorModal } from '@/components/calculator-modal'

interface CurrencyCardProps {
  /** Datos de la cotización USDT/Bs a mostrar */
  rate: CryptoRate
}

/**
 * Componente para mostrar una cotización USDT/Bs individual
 * Diseño compacto inspirado en dolarito.ar
 * Responsabilidad única: renderizar datos de una sola cotización
 */
export function CurrencyCard({ rate }: CurrencyCardProps) {
  const [showInfo, setShowInfo] = useState(false)
  const [showCalc, setShowCalc] = useState(false)
  const infoRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (infoRef.current && !infoRef.current.contains(e.target as Node)) {
        setShowInfo(false)
      }
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowInfo(false)
    }
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  /**
   * Obtiene el ícono según el tipo de cotización
   */
  const getTypeIcon = (baseCurrency: string) => {
    const iconMap = {
      'USD': <DollarSign className="h-4 w-4" />,
      'EUR': <Euro className="h-4 w-4" />
    }
    return iconMap[baseCurrency as keyof typeof iconMap] || <Wallet className="h-4 w-4" />;
  }



  /**
   * Maneja las acciones de los botones
   */
  const handleCalculator = () => {
    setShowCalc(true)
  }

  const handleHistorical = () => {
    // Extraer exchange_code del ID del rate
    // El ID tiene formato: {base_currency.toLowerCase()}-{exchange_code}
    const exchangeCode = rate.id.split('-').slice(1).join('-')
    window.location.href = `/history?exchange=${exchangeCode}&records=200`
  }

  const handleOfficialSite = () => {
    const exchangeConfig = getExchangeConfig(rate.exchangeCode)
    if (exchangeConfig.url !== '#') {
      window.open(exchangeConfig.url, '_blank')
    }
  }

  /**
   * Obtiene la información específica para cada tipo de cotización
   * Escalable para múltiples exchanges y cryptos usando configuración centralizada
   */
  const getInfoContent = () => {
    const exchangeConfig = getExchangeConfig(rate.exchangeCode)
    
    return {
      title: '¿Qué representa este valor?',
      description: `Se trata del ${rate.baseCurrency} ofrecido por ${exchangeConfig.description}, reflejando las condiciones del mercado venezolano.`,
      schedule: exchangeConfig.schedule,
      source: `Fuente: ${exchangeConfig.description}`
    }
  }

  return (
    <Card className="bg-gray-900 border-green-500 border-2 rounded-lg hover:shadow-xl transition-all duration-300 group w-full h-auto min-h-[200px] flex flex-col currency-card-mobile">
      {/* Header con precio promedio - removido */}

      {/* Contenido principal */}
      <div className="p-3 text-white flex-1 flex flex-col justify-between">
        {/* Título y estado */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            {getTypeIcon(rate.baseCurrency)}
            <h3 className="text-sm font-bold text-white">
              {rate.name.toUpperCase()}
            </h3>
            {/* Icono informativo para todas las cotizaciones (tooltip) */}
            <div className="relative" ref={infoRef}>
              <button
                onClick={() => setShowInfo((v) => !v)}
                className="text-gray-400 hover:text-blue-400 cursor-pointer transition-colors"
                title="Información sobre esta cotización"
              >
                <InfoIcon className="h-4 w-4" />
              </button>

              {showInfo && (
                <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-sm bg-gray-800 text-gray-200 rounded-lg shadow-xl border border-gray-700 z-[9999] info-modal-mobile">
                  <div className="p-4">
                    <h4 className="text-sm font-semibold text-white mb-2">{getInfoContent().title}</h4>
                    <p className="text-xs text-gray-300 leading-relaxed mb-2">
                      {getInfoContent().description}
                    </p>
                    <p className="text-[11px] text-gray-400">{getInfoContent().schedule}</p>
                    <div className="mt-2 flex items-center space-x-2 text-[11px] text-blue-400">
                      <InfoIcon className="h-3 w-3" />
                      <span>{getInfoContent().source}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Precio promedio principal */}
        <div className="text-center mb-4">
          <p className="text-xs text-gray-400 mb-2">Precio Promedio</p>
          <div className="text-center">
            <p className="text-sm font-bold text-white mb-1">
              1 {rate.baseCurrency} =
            </p>
            <p className="text-xl font-bold text-green-400">
              {rate.quoteCurrency === 'VES' ? formatBolivares(rate.avg) : `${rate.avg.toFixed(4)} ${rate.quoteCurrency}`}
            </p>
          </div>
        </div>

        {/* Precios de compra y venta */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {/* Precio de venta */}
          <div className="text-center bg-gray-800 rounded p-2 border border-gray-700">
            <p className="text-gray-400 mb-1 text-xs">Vende</p>
            <p className="text-white font-bold text-sm">
              {rate.quoteCurrency === 'VES' ? formatBolivares(rate.sell) : `${rate.sell.toFixed(4)} ${rate.quoteCurrency}`}
            </p>
          </div>

          {/* Precio de compra */}
          <div className="text-center bg-gray-800 rounded p-2 border border-gray-700">
            <p className="text-gray-400 mb-1 text-xs">Compra</p>
            <p className="text-green-400 font-bold text-sm">
              {rate.quoteCurrency === 'VES' ? formatBolivares(rate.buy) : `${rate.buy.toFixed(4)} ${rate.quoteCurrency}`}
            </p>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex items-center justify-center space-x-6 pt-3 border-t border-gray-700">
          <button
            onClick={handleCalculator}
            className="text-gray-400 hover:text-blue-400 transition-colors cursor-pointer"
            title="Abrir Calculadora"
          >
            <Calculator className="h-5 w-5 hover:scale-110 transition-transform" />
          </button>

          <button
            onClick={handleHistorical}
            className="text-gray-400 hover:text-yellow-400 transition-colors cursor-pointer"
            title="Ver Cotización Histórica"
          >
            <TrendingUp className="h-5 w-5 hover:scale-110 transition-transform" />
          </button>

          <button
            onClick={handleOfficialSite}
            className="text-gray-400 hover:text-green-400 transition-colors cursor-pointer"
            title="Sitio Oficial"
          >
            <Globe className="h-5 w-5 hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>

      {/* Tooltip ya renderizado arriba. */}
      {showCalc && (
        <CalculatorModal isOpen={showCalc} onClose={() => setShowCalc(false)} rate={rate} />
      )}
    </Card>
  )
}
