'use client'

import { useState, useRef, useEffect } from 'react'
import { TrendingUp, TrendingDown, Minus, DollarSign, Building2, Calculator, Globe, InfoIcon } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { CryptoRate } from '@/types/currency'
import { formatVariation } from '@/lib/crypto-data'
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
   * Determina el ícono a mostrar según la variación
   */
  const getVariationIcon = (variation: number) => {
    if (variation > 0) return <TrendingUp className="h-3 w-3" />
    if (variation < 0) return <TrendingDown className="h-3 w-3" />
    return <Minus className="h-3 w-3" />
  }

  /**
   * Obtiene el ícono según el tipo de cotización
   */
  const getTypeIcon = (baseCurrency: string) => {
    if (baseCurrency === 'USD' || baseCurrency === 'EUR') return <Building2 className="h-4 w-4" />
    return <DollarSign className="h-4 w-4" />
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
    const url = rate.tradeType === 'official' 
      ? 'https://www.bcv.org.ve'
      : 'https://p2p.binance.com'
    window.open(url, '_blank')
  }

  /**
   * Obtiene la información específica para cada tipo de cotización
   */
  const getInfoContent = () => {
    if (rate.tradeType === 'official') {
      return {
        title: '¿Qué representa este valor?',
        description: `Se trata del ${rate.baseCurrency} oficial del Banco Central de Venezuela (BCV), utilizado para transacciones gubernamentales y comerciales autorizadas.`,
        schedule: 'Actualizado de lunes a viernes de 9:00h a 16:00h.',
        source: 'Fuente oficial: BCV'
      }
    } else {
      return {
        title: '¿Qué representa este valor?',
        description: `Se trata del ${rate.baseCurrency} negociado directamente entre privados en la plataforma Binance P2P, reflejando el mercado venezolano.`,
        schedule: 'Opera las 24 horas, los 7 días de la semana.',
        source: 'Fuente: Binance P2P Venezuela'
      }
    }
  }

  return (
    <Card className="bg-gray-900 border-red-500 border-2 rounded-lg hover:shadow-xl transition-all duration-300 group w-full h-auto min-h-[280px] flex flex-col currency-card-mobile">
      {/* Header con variación - más compacto */}
      <div className="bg-red-600 p-2 flex items-center justify-center">
        <div className={`flex items-center space-x-1 text-white font-bold`}>
          {getVariationIcon(rate.variation)}
          <span className="text-sm">{formatVariation(rate.variation)}</span>
        </div>
      </div>

      {/* Contenido principal - más compacto */}
      <div className="p-3 text-white flex-1 flex flex-col justify-between">
        {/* Título y estado */}
        <div className="flex items-center justify-between mb-2">
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
                <InfoIcon className="h-3 w-3" />
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

        {/* Precios principales - más juntos como en la imagen */}
        <div className="grid grid-cols-2 gap-1 mb-4">
          {/* Precio de venta */}
          <div className="text-center">
            <p className="text-xs text-gray-400 mb-1">Vende</p>
            <div className="text-center">
              <p className="text-sm font-bold text-white mb-1">
                1 {rate.baseCurrency} =
              </p>
              <p className="text-lg font-bold text-white">
                {rate.quoteCurrency === 'VES' ? `${rate.sell.toFixed(4)} Bs` : `${rate.sell.toFixed(4)} ${rate.quoteCurrency}`}
              </p>
            </div>
          </div>

          {/* Separador vertical */}
          <div className="text-center border-l border-gray-600">
            <p className="text-xs text-gray-400 mb-1">Compra</p>
            <div className="text-center">
              <p className="text-sm font-bold text-green-400 mb-1">
                1 {rate.baseCurrency} =
              </p>
              <p className="text-lg font-bold text-green-400">
                {rate.quoteCurrency === 'VES' ? `${rate.buy.toFixed(4)} Bs` : `${rate.buy.toFixed(4)} ${rate.quoteCurrency}`}
              </p>
            </div>
          </div>
        </div>

        {/* Acciones - 3 iconos más juntos */}
        <div className="flex items-center justify-center space-x-6 pt-2 border-t border-gray-700">
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
