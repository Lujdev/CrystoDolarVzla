'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { HistoricalChart } from '@/components/simple-historical-chart';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { LoadingSpinner } from '@/components/loading-spinner';

interface HistoricalRate {
  id: number;
  exchange_code: string;
  currency_pair: string;
  buy_price: number;
  sell_price: number;
  avg_price: number;
  timestamp: string; // ISO format
  source: string;
  trade_type: string;
}

interface ApiResponse {
  status: string;
  data: HistoricalRate[];
  count: number;
  limit?: number;
  timestamp: string;
}

// Definir períodos predefinidos
const TIME_PERIODS = {
  '7d': { label: 'Últimos 7 días', days: 7 },
  '30d': { label: 'Últimos 30 días', days: 30 },
  '90d': { label: 'Últimos 3 meses', days: 90 },
} as const;

type TimePeriod = keyof typeof TIME_PERIODS;

// Función para calcular fechas basadas en el período
function calculateDateRange(period: TimePeriod) {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - TIME_PERIODS[period].days);
  
  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0]
  };
}

// Array de exchanges disponibles - fácil de extender
const AVAILABLE_EXCHANGES = [
  { value: 'all', label: 'Todos los Exchanges' },
  { value: 'BCV', label: 'BCV' },
  { value: 'ITALCAMBIOS', label: 'ITALCAMBIOS' },
  { value: 'BINANCE_P2P', label: 'Binance P2P' },
];

// Función para validar y sanitizar parámetros de consulta
function validateSearchParams(searchParams: URLSearchParams) {
  const exchange = searchParams.get('exchange') || 'all';
  const records = parseInt(searchParams.get('records') || '1000') || 1000; // Por defecto 1000 registros
  const period = (searchParams.get('period') || '7d') as TimePeriod; // Por defecto últimos 7 días

  // Validar exchange usando el array
  const validExchanges = AVAILABLE_EXCHANGES.map(ex => ex.value);
  const validatedExchange = validExchanges.includes(exchange) ? exchange : 'all';

  // Validar records
  const validRecords = [0, 50, 100, 200, 500, 1000];
  const validatedRecords = validRecords.includes(records) ? records : 1000;

  // Validar período
  const validPeriods = Object.keys(TIME_PERIODS) as TimePeriod[];
  const validatedPeriod = validPeriods.includes(period) ? period : '7d';

  return {
    exchange: validatedExchange,
    records: validatedRecords,
    period: validatedPeriod
  };
}

// Componente que maneja los search params
function HistoryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [historicalData, setHistoricalData] = useState<HistoricalRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Obtener parámetros validados de la URL
  const params = validateSearchParams(searchParams);
  const [selectedExchange, setSelectedExchange] = useState<string>(params.exchange);
  const [records, setRecords] = useState<number>(params.records);
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>(params.period);

  // Función para actualizar URL con parámetros seguros
  const updateURL = useCallback((newParams: {
    exchange?: string;
    records?: number;
    period?: TimePeriod;
  }) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    
    if (newParams.exchange !== undefined) {
      if (newParams.exchange === 'all') {
        current.delete('exchange');
      } else {
        current.set('exchange', newParams.exchange);
      }
    }
    
    if (newParams.records !== undefined) {
      if (newParams.records === 1000) {
        current.delete('records');
      } else {
        current.set('records', newParams.records.toString());
      }
    }
    
    if (newParams.period !== undefined) {
      if (newParams.period === '7d') {
        current.delete('period');
      } else {
        current.set('period', newParams.period);
      }
    }

    const search = current.toString();
    const query = search ? `?${search}` : '';
    router.push(`/history${query}`, { scroll: false });
  }, [router, searchParams]);

  const fetchHistoricalData = async (exchangeCode?: string, limitParam?: number, period?: TimePeriod) => {
    try {
      setLoading(true);
      setError(null);
      
      // Calcular rango de fechas basado en el período
      const dateRange = period ? calculateDateRange(period) : calculateDateRange('30d');
      
      // Construir URL de la API con parámetros
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
      const apiParams = new URLSearchParams();
      
      if (limitParam && limitParam > 0) {
        apiParams.append('limit', limitParam.toString());
      }
      
      let url = `${baseUrl}api/v1/rates/history`;
      if (apiParams.toString()) {
        url += `?${apiParams.toString()}`;
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Error HTTP! estado: ${response.status}`);
      }
      
      const apiResponse: ApiResponse = await response.json();
      
      if (apiResponse.status === 'success') {
        let filteredData = apiResponse.data;
        
        // Filtrar por exchange si se especifica
        if (exchangeCode && exchangeCode !== 'all') {
          filteredData = filteredData.filter(
            rate => rate.exchange_code.toLowerCase() === exchangeCode.toLowerCase()
          );
        }
        
        // Filtrar por rango de fechas calculado (lado del cliente)
        const startTime = new Date(dateRange.startDate).getTime();
        const endTime = new Date(dateRange.endDate + 'T23:59:59.999Z').getTime();
        
        filteredData = filteredData.filter(rate => {
          const rateTime = new Date(rate.timestamp).getTime();
          return rateTime >= startTime && rateTime <= endTime;
        });
        
        // Ordenar por timestamp (más reciente primero)
        filteredData.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        
        setHistoricalData(filteredData);
      } else {
        throw new Error('La API devolvió un estado de error');
      }
    } catch (err) {
      console.error('Error al obtener datos históricos:', err);
      setError('Error al cargar los datos históricos. Usando datos de respaldo.');
      
      // Datos de respaldo locales
      try {
        const fallbackResponse = await fetch('/data/historical-rates.json');
        const fallbackData = await fallbackResponse.json();
        
        // Transformar datos de respaldo para coincidir con la estructura de la API
        let transformedData: HistoricalRate[] = fallbackData.map((item: { 'bcv-usd': number; fecha: string }, index: number) => ({
          id: index + 1,
          exchange_code: 'BCV',
          currency_pair: 'USD/VES',
          buy_price: item['bcv-usd'],
          sell_price: item['bcv-usd'],
          avg_price: item['bcv-usd'],
          timestamp: new Date(item.fecha).toISOString(),
          source: 'bcv',
          trade_type: 'official'
        }));
        
        // Aplicar filtrado de fechas a los datos de respaldo
        const dateRange = period ? calculateDateRange(period) : calculateDateRange('30d');
        const startTime = new Date(dateRange.startDate).getTime();
        const endTime = new Date(dateRange.endDate + 'T23:59:59.999Z').getTime();
        
        transformedData = transformedData.filter(rate => {
          const rateTime = new Date(rate.timestamp).getTime();
          return rateTime >= startTime && rateTime <= endTime;
        });
        
        setHistoricalData(transformedData);
      } catch (fallbackErr) {
        console.error('Los datos de respaldo también fallaron:', fallbackErr);
        setError('Error al cargar cualquier dato histórico.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Efecto para cargar datos cuando cambian los parámetros de la URL
  useEffect(() => {
    const validatedParams = validateSearchParams(searchParams);
    setSelectedExchange(validatedParams.exchange);
    setRecords(validatedParams.records);
    setSelectedPeriod(validatedParams.period);
    
    fetchHistoricalData(
      validatedParams.exchange === 'all' ? undefined : validatedParams.exchange,
      validatedParams.records || undefined,
      validatedParams.period
    );
  }, [searchParams]);

  const handleExchangeChange = (exchange: string) => {
    setSelectedExchange(exchange);
    updateURL({ exchange });
  };

  const handleRecordsChange = (newRecords: number) => {
    setRecords(newRecords);
    updateURL({ records: newRecords });
  };

  const handlePeriodChange = (period: TimePeriod) => {
    setSelectedPeriod(period);
    updateURL({ period });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // Calcular rango de fechas actual para mostrar
  const currentDateRange = calculateDateRange(selectedPeriod);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Tasas de Cambio Históricas</h1>
          
          {error && (
            <div className="bg-yellow-900/50 border border-yellow-700 rounded p-4 mb-6">
              <p className="text-yellow-200">{error}</p>
            </div>
          )}
        </div>
        
        {historicalData.length > 0 ? (
          <HistoricalChart 
            data={historicalData} 
            startDate={currentDateRange.startDate} 
            endDate={currentDateRange.endDate}
            initialExchange={selectedExchange}
            initialPeriod={selectedPeriod}
          />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400">No hay datos históricos disponibles para el período seleccionado.</p>
            <p className="text-gray-500 text-sm mt-2">Intenta seleccionar un período de tiempo diferente o ajustar tus filtros.</p>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}

// Componente de fallback para Suspense
function HistoryPageFallback() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner />
        </div>
      </main>
      <Footer />
    </div>
  );
}

// Componente principal que envuelve en Suspense
export default function HistoryPage() {
  return (
    <Suspense fallback={<HistoryPageFallback />}>
      <HistoryContent />
    </Suspense>
  );
}
