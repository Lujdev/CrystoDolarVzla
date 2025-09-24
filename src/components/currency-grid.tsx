'use client'

import { CurrencyCard } from '@/components/currency-card'
import { LoadingSpinner } from '@/components/loading-spinner'
import { CurrencyCardSkeleton } from '@/components/currency-card-skeleton'
import { useCryptoContext } from '@/lib/crypto-context'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CryptoRate } from '@/types/currency'

/**
 * Componente principal que renderiza la grilla de cotizaciones USDT/Bs
 * Integrado con CryptoContext para manejo de estado global
 * Maneja estados de carga, error y datos usando el sistema de contexto
 */
export function CurrencyGrid() {
  const { rates, isLoading, error, refreshRates, clearError, activeTab } = useCryptoContext()

  // Estado de carga inicial o sin tasas - mostrar skeletons
  if (isLoading || rates.length === 0) {
    return (
      <div className="space-y-6">
        {/* Grilla de skeletons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {Array.from({ length: 4 }).map((_, index) => (
            <CurrencyCardSkeleton key={index} />
          ))}
        </div>
        
        {/* Información adicional skeleton */}
        <div className="mt-8 p-4 bg-gray-800 rounded-lg border border-gray-700 mx-4 sm:mx-6 lg:mx-8">
          <div className="flex items-start space-x-3">
            <div className="text-2xl">💎</div>
            <div className="flex-1">
              <div className="w-48 h-5 bg-gray-600 rounded mb-2"></div>
              <div className="space-y-1">
                <div className="w-full h-3 bg-gray-600 rounded"></div>
                <div className="w-3/4 h-3 bg-gray-600 rounded"></div>
                <div className="w-2/3 h-3 bg-gray-600 rounded"></div>
                <div className="w-4/5 h-3 bg-gray-600 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Estado de error
  if (error) {
    return (
      <div className="text-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-red-900/20 border border-red-700 rounded-lg p-6 max-w-md mx-auto">
          <div className="flex items-center justify-center mb-4">
            <AlertCircle className="h-8 w-8 text-red-400" />
          </div>
          <h3 className="text-lg font-semibold text-red-200 mb-2">
            Error al cargar cotizaciones
          </h3>
          <p className="text-red-300 font-medium mb-4">{error}</p>
          <div className="flex space-x-2 justify-center">
            <Button 
              onClick={clearError}
              variant="outline"
              size="sm"
            >
              Cerrar
            </Button>
            <Button 
              onClick={() => refreshRates(true)}
              size="sm"
            >
              Reintentar
            </Button>
          </div>
        </div>
      </div>
    )
  }



  // Filtrar por pestaña activa y ordenar por menor monto de venta
  const visibleRatesBase = activeTab === 'all' ? rates : rates.filter((r) => r.category === activeTab)
  
  // Ordenar por precio de venta (sell) de menor a mayor
  const sortedRates = visibleRatesBase.sort((a, b) => a.sell - b.sell)
  
  // Mostrar como máximo 5 únicos
  const visibleRates = sortedRates.slice(0, 5)
  return (
    <div className="space-y-6">
      {/* Indicador de carga durante actualización */}
      {isLoading && rates.length > 0 && (
        <div className="flex justify-center px-4 sm:px-6 lg:px-8">
          <div className="bg-blue-900/20 border border-blue-700 rounded-lg px-4 py-2 flex items-center space-x-2">
            <LoadingSpinner size="sm" />
            <span className="text-sm text-blue-300">Actualizando cotizaciones...</span>
          </div>
        </div>
      )}

      {/* Grilla principal de cotizaciones */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {visibleRates.map((rate: CryptoRate) => (
          <CurrencyCard key={rate.id} rate={rate} />
        ))}
      </div>
      
      {/* Información adicional específica para CrystoDolar */}
      <div className="mt-8 p-4 bg-gray-800 rounded-lg border border-gray-700 mx-4 sm:mx-6 lg:mx-8">
          <div className="flex items-start space-x-3">
          <div className="text-2xl">💎</div>
          <div>
            <h4 className="font-semibold text-white mb-2">
              Información importante sobre las cotizaciones
            </h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Las cotizaciones se actualizan periódicamente</li>
              <li>• Los valores son referenciales y pueden variar según la fuente</li>
              <li>• BCV proporciona tasas oficiales para USD/EUR</li>
              <li>• Binance P2P refleja el mercado crypto peer-to-peer</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
