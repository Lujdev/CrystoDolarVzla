'use client'

import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react'
import { CurrencyContextState, CurrencyContextActions, CryptoRate, ApiResponse, ApiRateData } from '@/types/currency'
import { toast } from 'sonner'

/**
 * CryptoContext - Sistema de contexto para CrystoDolar
 * Implementa patrón Context + Reducer para gestión centralizada del estado crypto USDT/Bs
 * Ubicado en lib/ para mejor organización y reutilización
 * Siguiendo principios SOLID y arquitectura limpia
 */

// Tipos para las acciones del reducer
type CurrencyAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_RATES'; payload: CryptoRate[] }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'UPDATE_RATE'; payload: { id: string; data: Partial<CryptoRate> } }
  | { type: 'SET_LAST_UPDATE'; payload: Date }
  | { type: 'SET_ONLINE_STATUS'; payload: boolean }
  | { type: 'SET_ACTIVE_TAB'; payload: 'dolar' | 'euro' | 'cripto' | 'all' }
  | { type: 'SET_INITIAL_LOAD_ATTEMPT'; payload: boolean }
  | { type: 'SET_LAST_MANUAL_UPDATE'; payload: Date | null }

// Estado inicial del contexto
const initialState: CurrencyContextState = {
  rates: [],
  isLoading: false,
  error: null,
  lastUpdate: null,
  isOnline: true,
  activeTab: 'all',
  hasInitialLoadAttempt: false,
  lastManualUpdate: null
}

/**
 * Reducer para manejar las acciones del estado de cotizaciones crypto
 * Implementa patrón Reducer para actualizaciones inmutables del estado
 */
function cryptoReducer(state: CurrencyContextState, action: CurrencyAction): CurrencyContextState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    
    case 'SET_RATES':
      return { 
        ...state, 
        rates: action.payload, 
        isLoading: false, 
        error: null,
        lastUpdate: new Date()
      }
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false }
    
    case 'UPDATE_RATE':
      return {
        ...state,
        rates: state.rates.map(rate =>
          rate.id === action.payload.id
            ? { ...rate, ...action.payload.data, lastUpdate: new Date() }
            : rate
        )
      }
    
    case 'SET_LAST_UPDATE':
      return { ...state, lastUpdate: action.payload }
    
    case 'SET_ONLINE_STATUS':
      return { ...state, isOnline: action.payload }
    
    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.payload }
    
    case 'SET_INITIAL_LOAD_ATTEMPT':
      return { ...state, hasInitialLoadAttempt: action.payload }
    
    case 'SET_LAST_MANUAL_UPDATE':
      return { ...state, lastManualUpdate: action.payload }
    
    default:
      return state
  }
}

// Contexto combinado para estado y acciones
type CryptoContextType = CurrencyContextState & CurrencyContextActions

// Crear el contexto
const CryptoContext = createContext<CryptoContextType | undefined>(undefined)

/**
 * Proveedor del CryptoContext para CrystoDolar
 * Envuelve la aplicación y proporciona el estado global de cotizaciones USDT/Bs
 */
export function CryptoContextProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cryptoReducer, initialState)

  /**
   * Función para mapear datos de la API al formato interno
   */
  const mapApiDataToRate = (apiData: ApiRateData): CryptoRate => {
    const variation = parseFloat(apiData.variation_percentage.replace('%', '').replace('+', ''))
    
    // Determinar categoría basada en base_currency
    let category: 'dolar' | 'euro' | 'cripto'
    let type: 'fiat' | 'crypto'
    let color: string
    
    if (apiData.base_currency === 'USD') {
      category = 'dolar'
      type = 'fiat'
      color = 'bg-blue-600'
    } else if (apiData.base_currency === 'EUR') {
      category = 'euro'
      type = 'fiat'
      color = 'bg-indigo-600'
    } else {
      category = 'cripto'
      type = 'crypto'
      color = 'bg-yellow-600'
    }
    
    // Generar nombre según exchange_code y base_currency
    // Mostrar solo 'Binance' cuando exchange_code sea 'BINANCE_P2P'
    const exchangeName = apiData.exchange_code === 'BINANCE_P2P' ? 'Binance' : apiData.exchange_code
    const name = `${exchangeName} ${apiData.base_currency}`
    
    return {
      id: `${apiData.base_currency.toLowerCase()}-${apiData.exchange_code}`,
      name,
      category,
      buy: apiData.buy_price,
      sell: apiData.sell_price,
      variation,
      lastUpdate: new Date(apiData.timestamp),
      type,
      color,
      description: `${apiData.source} - ${apiData.currency_pair}`,
      baseCurrency: apiData.base_currency,
      quoteCurrency: apiData.quote_currency,
      tradeType: apiData.trade_type
    }
  }

  /**
   * Función principal para actualizar cotizaciones desde la API
   * Usa el nuevo endpoint /api/v1/rates/current
   * Incluye rate limiting de 2 minutos para actualizaciones manuales
   */
  const refreshRates = useCallback(async (showToast: boolean = false, isManualUpdate: boolean = false) => {
    try {
      // Rate limiting para actualizaciones manuales
      if (isManualUpdate && state.lastManualUpdate) {
        const timeSinceLastUpdate = Date.now() - state.lastManualUpdate.getTime()
        const minInterval = 2 * 60 * 1000 // 2 minutos en milisegundos
        
        if (timeSinceLastUpdate < minInterval) {
          toast.error('Actualización no disponible', {
            description: 'Por favor, espera un momento antes de intentar actualizar nuevamente.',
            duration: 4000,
          })
          return
        }
      }

      dispatch({ type: 'SET_LOADING', payload: true })
      dispatch({ type: 'SET_ERROR', payload: null })
      dispatch({ type: 'SET_INITIAL_LOAD_ATTEMPT', payload: true })
      
      // Si es una actualización manual, registrar el timestamp
      if (isManualUpdate) {
        dispatch({ type: 'SET_LAST_MANUAL_UPDATE', payload: new Date() })
      }
      
      const apiBaseRaw = process.env.NEXT_PUBLIC_API_BASE_URL || ''
      const apiBase = apiBaseRaw.replace(/\/+$/, '')
      
      const response = await fetch(`${apiBase}/api/v1/rates/current`, { cache: 'no-store' })
      if (!response.ok) throw new Error('Error al obtener cotizaciones actuales')
      
      const apiResponse: ApiResponse = await response.json()
      
      if (apiResponse.status !== 'success' || !apiResponse.data) {
        throw new Error('Respuesta inválida de la API')
      }
      
      // Mapear datos de la API al formato interno
      const updatedRates: CryptoRate[] = apiResponse.data.map(mapApiDataToRate)
      
      dispatch({ type: 'SET_RATES', payload: updatedRates })
      
      if (showToast && updatedRates.length > 0) {
        toast.success('Tasas actualizadas correctamente', {
          description: `Se actualizaron ${updatedRates.length} cotizaciones`,
          duration: 3000,
        })
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Error al actualizar las cotizaciones' })
      console.error('Error refreshing crypto rates:', error)
      
      // Mostrar toast de error solo cuando se solicite explícitamente
      if (showToast) {
        toast.error('Error al actualizar las tasas', {
          description: 'No se pudieron cargar las cotizaciones',
          duration: 4000,
        })
      }
    }
  }, [state.lastManualUpdate])

  /**
   * Función para actualizar una cotización específica
   */
  const updateRate = useCallback((rateId: string, newData: Partial<CryptoRate>) => {
    dispatch({ type: 'UPDATE_RATE', payload: { id: rateId, data: newData } })
  }, [])

  /**
   * Función para limpiar errores
   */
  const clearError = useCallback(() => {
    dispatch({ type: 'SET_ERROR', payload: null })
  }, [])

  /**
   * Función para establecer estado de carga
   */
  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading })
  }, [])

  /**
   * Establecer pestaña activa (Dólar, Euro, Cripto)
   */
  const setActiveTab = useCallback((tab: 'dolar' | 'euro' | 'cripto' | 'all') => {
    dispatch({ type: 'SET_ACTIVE_TAB', payload: tab })
  }, [])

  // Cargar datos iniciales al montar el componente (sin toast)
  useEffect(() => {
    // Solo cargar si no hay tasas y no se ha intentado cargar antes
    if (state.rates.length === 0 && !state.hasInitialLoadAttempt) {
      refreshRates(false, false)
    }
  }, [refreshRates, state.rates.length, state.hasInitialLoadAttempt])

  // Detectar estado de conexión
  useEffect(() => {
    const handleOnline = () => dispatch({ type: 'SET_ONLINE_STATUS', payload: true })
    const handleOffline = () => dispatch({ type: 'SET_ONLINE_STATUS', payload: false })

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Valor del contexto que incluye estado y acciones
  const contextValue: CryptoContextType = {
    ...state,
    refreshRates,
    updateRate,
    clearError,
    setLoading,
    setActiveTab
  }

  return (
    <CryptoContext.Provider value={contextValue}>
      {children}
    </CryptoContext.Provider>
  )
}

/**
 * Hook principal para usar CryptoContext en CrystoDolar
 * Proporciona acceso completo al estado y acciones de cotizaciones
 * Incluye validación para uso dentro del proveedor
 */
export function useCryptoContext() {
  const context = useContext(CryptoContext)
  
  if (context === undefined) {
    throw new Error('useCryptoContext debe ser usado dentro de CryptoContextProvider')
  }
  
  return context
}

/**
 * Hook para obtener solo el estado (sin acciones)
 * Útil para componentes que solo necesitan leer datos
 * Optimizado para re-renders mínimos
 */
export function useCryptoState(): CurrencyContextState {
  const context = useCryptoContext()
  return {
    rates: context.rates,
    isLoading: context.isLoading,
    error: context.error,
    lastUpdate: context.lastUpdate,
    isOnline: context.isOnline,
    activeTab: context.activeTab,
    hasInitialLoadAttempt: context.hasInitialLoadAttempt,
    lastManualUpdate: context.lastManualUpdate
  }
}

/**
 * Hook para obtener solo las acciones
 * Útil para componentes que solo necesitan disparar acciones
 * Optimizado para re-renders mínimos
 */
export function useCryptoActions(): CurrencyContextActions {
  const context = useCryptoContext()
  return {
    refreshRates: context.refreshRates,
    updateRate: context.updateRate,
    clearError: context.clearError,
    setLoading: context.setLoading,
    setActiveTab: context.setActiveTab
  }
}