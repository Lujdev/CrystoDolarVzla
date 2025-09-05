import { CryptoRate } from '@/types/currency'

/**
 * Datos mock para cotizaciones USDT/Bs en Venezuela
 * En producción, estos datos vendrían de APIs del BCV y Binance P2P
 * Solo dos fuentes: oficial (fiat) y crypto
 */
export const mockCryptoRates: CryptoRate[] = [
  {
    id: 'usd-bcv',
    name: 'BCV USD',
    category: 'dolar',
    buy: 152.8216,
    sell: 152.8216,
    avg: 152.8216,
    lastUpdate: new Date(),
    type: 'fiat',
    color: 'bg-blue-600',
    description: 'bcv_web_scraping - USD/VES',
    baseCurrency: 'USD',
    quoteCurrency: 'VES',
    tradeType: 'official',
    exchangeCode: 'BCV'
  },
  {
    id: 'usdt-binance_p2p',
    name: 'Binance USDT',
    category: 'cripto',
    buy: 285.0,
    sell: 194.0,
    avg: 239.5,
    lastUpdate: new Date(),
    type: 'crypto',
    color: 'bg-yellow-600',
    description: 'binance_p2p_api - USDT/VES',
    baseCurrency: 'USDT',
    quoteCurrency: 'VES',
    tradeType: 'p2p',
    exchangeCode: 'BINANCE_P2P',
    volume24h: 235289.68
  },
  {
    id: 'usd-italcambios',
    name: 'Italcambios USD',
    category: 'dolar',
    buy: 151.7627,
    sell: 153.2803,
    avg: 152.5215,
    lastUpdate: new Date(),
    type: 'fiat',
    color: 'bg-blue-600',
    description: 'italcambios_web_scraping - USD/VES',
    baseCurrency: 'USD',
    quoteCurrency: 'VES',
    tradeType: 'p2p',
    exchangeCode: 'ITALCAMBIOS'
  }
]

/**
 * Función para formatear valores en Bolívares Soberanos
 * @param value - Valor numérico a formatear
 * @returns String formateado con símbolo Bs.
 */
export function formatBolivares(value: number): string {
  return new Intl.NumberFormat('es-VE', {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4
  }).format(value) + ' Bs'
}


/**
 * Configuración escalable para diferentes tipos de monedas
 * Fácil de extender para nuevas monedas y exchanges
 */
export const CURRENCY_CONFIG = {
  'USD': {
    category: 'dolar' as const,
    type: 'fiat' as const,
    color: 'bg-blue-600',
    icon: 'DollarSign'
  },
  'EUR': {
    category: 'euro' as const,
    type: 'fiat' as const,
    color: 'bg-indigo-600',
    icon: 'Euro'
  },
  'USDT': {
    category: 'cripto' as const,
    type: 'crypto' as const,
    color: 'bg-yellow-600',
    icon: 'Wallet'
  },
  'BTC': {
    category: 'cripto' as const,
    type: 'crypto' as const,
    color: 'bg-orange-600',
    icon: 'Wallet'
  },
  'ETH': {
    category: 'cripto' as const,
    type: 'crypto' as const,
    color: 'bg-purple-600',
    icon: 'Wallet'
  }
}

/**
 * Configuración escalable para diferentes exchanges
 * Fácil de extender para nuevos exchanges
 */
export const EXCHANGE_CONFIG = {
  'BCV': {
    name: 'BCV',
    tradeType: 'official' as const,
    url: 'https://www.bcv.org.ve',
    description: 'Banco Central de Venezuela',
    schedule: 'Actualizado de lunes a viernes de 9:00h a 16:00h.'
  },
  'BINANCE_P2P': {
    name: 'Binance',
    tradeType: 'p2p' as const,
    url: 'https://p2p.binance.com',
    description: 'Binance P2P Venezuela',
    schedule: 'Opera las 24 horas, los 7 días de la semana.'
  },
  'ITALCAMBIOS': {
    name: 'Italcambios',
    tradeType: 'p2p' as const,
    url: 'https://italcambios.com',
    description: 'Italcambios',
    schedule: 'Horario comercial de lunes a viernes.'
  }
}

/**
 * Función para obtener configuración de moneda de forma escalable
 * @param baseCurrency - Código de la moneda base
 * @returns Configuración de la moneda o configuración por defecto
 */
export function getCurrencyConfig(baseCurrency: string) {
  return CURRENCY_CONFIG[baseCurrency as keyof typeof CURRENCY_CONFIG] || {
    category: 'cripto' as const,
    type: 'crypto' as const,
    color: 'bg-gray-600',
    icon: 'Wallet'
  }
}

/**
 * Función para obtener configuración de exchange de forma escalable
 * @param exchangeCode - Código del exchange
 * @returns Configuración del exchange o configuración por defecto
 */
export function getExchangeConfig(exchangeCode: string) {
  return EXCHANGE_CONFIG[exchangeCode as keyof typeof EXCHANGE_CONFIG] || {
    name: exchangeCode,
    tradeType: 'p2p' as const,
    url: '#',
    description: exchangeCode,
    schedule: 'Actualización continua.'
  }
}

/**
 * Función para calcular la brecha entre tasa fiat y crypto
 * @param fiatRate - Tasa oficial fiat (BCV)
 * @param cryptoRate - Tasa crypto (Binance P2P)
 * @returns Porcentaje de brecha fiat vs crypto
 */
export function calculateCryptoGap(fiatRate: number, cryptoRate: number): number {
  return ((cryptoRate - fiatRate) / fiatRate) * 100
}
