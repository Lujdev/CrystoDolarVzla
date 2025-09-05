/**
 * Tipos TypeScript para cotizaciones USDT/Bs en Venezuela
 * Define interfaces para el manejo de datos de criptomonedas fiat/crypto
 */

export interface ProcessedRateData {
  exchange_code: string
  currency_pair: string
  buy_price: number
  sell_price: number
  avg_price: number
  volume_24h?: number | null
  source: string
}

export interface ExchangeUpdateStatus {
  status: 'success' | 'error'
  processed_data: ProcessedRateData[]
}

export interface ApiResponse {
  status: string
  data: ProcessedRateData[]
  count: number
  source: string
  cached: boolean
  update_status: {
    [exchangeName: string]: ExchangeUpdateStatus
  }
  execution_time_seconds: number
  optimization: {
    transaction_mode: boolean
    prepared_statements: boolean
    connection_pool: {
      status: string
    }
    cache_updated: boolean
  }
  timestamp: string
}

export interface CryptoRate {
  /** Identificador único de la cotización */
  id: string
  /** Nombre del tipo de cambio */
  name: string
  /** Categoría de visualización (pestaña activa) */
  category: 'dolar' | 'euro' | 'cripto'
  /** Precio de compra en Bolívares */
  buy: number
  /** Precio de venta en Bolívares */
  sell: number
  /** Precio promedio en Bolívares */
  avg: number
  /** Timestamp de última actualización */
  lastUpdate: Date
  /** Tipo de cambio (oficial fiat o crypto) */
  type: 'fiat' | 'crypto'
  /** Color del indicador para la UI */
  color: string
  /** Descripción adicional */
  description?: string
  /** Moneda base (USD, EUR, USDT) */
  baseCurrency: string
  /** Moneda cotizada (VES) */
  quoteCurrency: string
  /** Tipo de comercio */
  tradeType: 'official' | 'p2p'
  /** Código del exchange */
  exchangeCode: string
  /** Volumen de 24h si está disponible */
  volume24h?: number | null
}

export interface CurrencyContextState {
  /** Array de cotizaciones disponibles */
  rates: CryptoRate[]
  /** Estado de carga */
  isLoading: boolean
  /** Mensajes de error */
  error: string | null
  /** Timestamp de última actualización */
  lastUpdate: Date | null
  /** Estado de conexión */
  isOnline: boolean
  /** Pestaña activa en la UI */
  activeTab: 'dolar' | 'euro' | 'cripto' | 'all'
  /** Indica si ya se intentó cargar datos inicialmente */
  hasInitialLoadAttempt: boolean
  /** Timestamp de la última actualización manual (para rate limiting) */
  lastManualUpdate: Date | null
}

export interface CurrencyContextActions {
  /** Actualizar todas las cotizaciones */
  refreshRates: (showToast?: boolean, isManualUpdate?: boolean) => Promise<void>
  /** Actualizar una cotización específica */
  updateRate: (rateId: string, newData: Partial<CryptoRate>) => void
  /** Limpiar errores */
  clearError: () => void
  /** Establecer estado de carga */
  setLoading: (loading: boolean) => void
  /** Establecer la pestaña activa */
  setActiveTab: (tab: 'dolar' | 'euro' | 'cripto' | 'all') => void
}
