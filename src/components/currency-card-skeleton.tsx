'use client'

import { Card } from '@/components/ui/card'

/**
 * Componente skeleton para mostrar mientras cargan las currency cards
 * Simula la estructura visual de las cards reales
 */
export function CurrencyCardSkeleton() {
  return (
    <Card className="bg-gray-900 border-green-500 border-2 rounded-lg w-full h-auto min-h-[200px] flex flex-col animate-pulse">
      {/* Contenido principal skeleton */}
      <div className="p-3 flex-1 flex flex-col justify-between">
        {/* Título y estado skeleton */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-600 rounded"></div>
            <div className="w-20 h-3 bg-gray-600 rounded"></div>
            <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
          </div>
        </div>

        {/* Precio promedio skeleton */}
        <div className="text-center mb-4">
          <div className="w-20 h-3 bg-gray-600 rounded mb-2 mx-auto"></div>
          <div className="w-16 h-3 bg-gray-600 rounded mb-1 mx-auto"></div>
          <div className="w-24 h-6 bg-gray-600 rounded mx-auto"></div>
        </div>

        {/* Precios de compra y venta skeleton */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {/* Precio de venta skeleton */}
          <div className="text-center bg-gray-800 rounded p-2 border border-gray-700">
            <div className="w-12 h-3 bg-gray-600 rounded mb-1 mx-auto"></div>
            <div className="w-16 h-4 bg-gray-600 rounded mx-auto"></div>
          </div>

          {/* Precio de compra skeleton */}
          <div className="text-center bg-gray-800 rounded p-2 border border-gray-700">
            <div className="w-12 h-3 bg-gray-600 rounded mb-1 mx-auto"></div>
            <div className="w-16 h-4 bg-gray-600 rounded mx-auto"></div>
          </div>
        </div>

        {/* Acciones skeleton */}
        <div className="flex items-center justify-center space-x-6 pt-3 border-t border-gray-700">
          <div className="w-5 h-5 bg-gray-600 rounded"></div>
          <div className="w-5 h-5 bg-gray-600 rounded"></div>
          <div className="w-5 h-5 bg-gray-600 rounded"></div>
        </div>
      </div>
    </Card>
  )
}
