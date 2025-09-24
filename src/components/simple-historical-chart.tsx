'use client';

import * as React from 'react';
import { Line, LineChart, CartesianGrid, XAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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

interface HistoricalChartProps {
  data: HistoricalRate[];
  startDate?: string;
  endDate?: string;
  initialExchange?: string;
  initialPeriod?: TimePeriod;
}

// Array de exchanges disponibles - fácil de extender
const AVAILABLE_EXCHANGES = [
  { value: 'all', label: 'Todos los Exchanges' },
  { value: 'BCV USD', label: 'BCV USD' },
  { value: 'BCV EUR', label: 'BCV EUR' },
  { value: 'ITALCAMBIOS', label: 'ITALCAMBIOS' },
  { value: 'BINANCE_P2P', label: 'Binance P2P' },
];

// Time periods
const TIME_PERIODS = {
  '7d': { label: 'Últimos 7 días', days: 7 },
  '30d': { label: 'Últimos 30 días', days: 30 },
  '90d': { label: 'Últimos 3 meses', days: 90 },
} as const;

type TimePeriod = keyof typeof TIME_PERIODS;

// Función para mapear exchanges de URL a valores del componente
function mapExchangeFromURL(urlExchange: string): string {
  const exchangeMap: { [key: string]: string } = {
    'BCV': 'BCV USD', // Por defecto BCV USD
    'ITALCAMBIOS': 'ITALCAMBIOS',
    'BINANCE_P2P': 'BINANCE_P2P',
    'all': 'all'
  };
  return exchangeMap[urlExchange] || 'all';
}

export function HistoricalChart({ data, startDate, endDate, initialExchange = 'all', initialPeriod = '7d' }: HistoricalChartProps) {
  const [timeRange, setTimeRange] = React.useState<TimePeriod>(initialPeriod);
  const [selectedExchange, setSelectedExchange] = React.useState(mapExchangeFromURL(initialExchange));

  // Transform data for recharts format
  const transformedData = React.useMemo(() => {
    // Filter by exchange if not 'all'
    let filteredData = data;
    if (selectedExchange !== 'all') {
      if (selectedExchange === 'BCV USD') {
        filteredData = data.filter(rate => 
          rate.exchange_code === 'BCV' && rate.currency_pair === 'USD/VES'
        );
      } else if (selectedExchange === 'BCV EUR') {
        filteredData = data.filter(rate => 
          rate.exchange_code === 'BCV' && rate.currency_pair === 'EUR/VES'
        );
      } else {
        filteredData = data.filter(rate => rate.exchange_code === selectedExchange);
      }
    }

    // Filter by time range
    const referenceDate = new Date();
    let daysToSubtract = TIME_PERIODS[timeRange].days;
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);

    filteredData = filteredData.filter(rate => {
      const rateDate = new Date(rate.timestamp);
      return rateDate >= startDate;
    });

    // Group by date and create chart data
    const groupedByDate = filteredData.reduce((acc, rate) => {
      const dateKey = new Date(rate.timestamp).toISOString().split('T')[0];
      if (!acc[dateKey]) {
        acc[dateKey] = {
          date: dateKey,
          'BCV USD': 0,
          'BCV EUR': 0,
          ITALCAMBIOS: 0,
          BINANCE_P2P: 0,
        };
      }
      
      const price = rate.avg_price || rate.buy_price;
      if (rate.exchange_code === 'BCV') {
        // Separar BCV por par de monedas
        if (rate.currency_pair === 'USD/VES') {
          acc[dateKey]['BCV USD'] = price;
        } else if (rate.currency_pair === 'EUR/VES') {
          acc[dateKey]['BCV EUR'] = price;
        }
      } else if (rate.exchange_code === 'ITALCAMBIOS') {
        acc[dateKey].ITALCAMBIOS = price;
      } else if (rate.exchange_code === 'BINANCE_P2P') {
        acc[dateKey].BINANCE_P2P = price;
      }
      
      return acc;
    }, {} as Record<string, { date: string; 'BCV USD': number; 'BCV EUR': number; ITALCAMBIOS: number; BINANCE_P2P: number }>);

    // Convert to array and sort by date
    return Object.values(groupedByDate)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [data, selectedExchange, timeRange]);

  // Chart configuration con colores vibrantes y distintivos
  const chartConfig = {
    'BCV USD': {
      label: 'BCV USD',
      color: '#10B981', // Verde esmeralda vibrante
    },
    'BCV EUR': {
      label: 'BCV EUR', 
      color: '#3B82F6', // Azul brillante
    },
    ITALCAMBIOS: {
      label: 'ITALCAMBIOS',
      color: '#F59E0B', // Naranja dorado
    },
    BINANCE_P2P: {
      label: 'Binance P2P',
      color: '#EF4444', // Rojo vibrante
    },
  } satisfies ChartConfig;

  // Calculate statistics
  const stats = React.useMemo(() => {
    const totalRecords = data.length;
    const filteredRecords = transformedData.length;
    const exchanges = [...new Set(data.map(d => d.exchange_code))];
    
    let latestPrice = 0;
    let latestExchange = '';
    if (data.length > 0) {
      const latest = data.reduce((prev, current) => 
        new Date(prev.timestamp) > new Date(current.timestamp) ? prev : current
      );
      latestPrice = latest.avg_price || latest.buy_price;
      latestExchange = `${latest.exchange_code} ${latest.currency_pair}`;
    }

    return {
      totalRecords,
      filteredRecords,
      exchangeCount: exchanges.length,
      latestPrice,
      latestExchange,
    };
  }, [data, transformedData]);

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="flex items-center gap-2 space-y-0 border-b border-gray-700 py-5 sm:flex-row">
          <div className="grid flex-1 gap-1">
            <CardTitle className="text-white">Cotizaciones Históricas - Líneas</CardTitle>
            <CardDescription className="text-gray-300">
              Mostrando tasas de cambio para {TIME_PERIODS[timeRange].label.toLowerCase()}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {/* Exchange Selector */}
            <Select value={selectedExchange} onValueChange={setSelectedExchange}>
              <SelectTrigger className="w-[180px] rounded-lg bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Seleccionar Exchange" />
              </SelectTrigger>
              <SelectContent className="rounded-xl bg-gray-700 border-gray-600">
                {AVAILABLE_EXCHANGES.map((exchange) => (
                  <SelectItem key={exchange.value} value={exchange.value} className="rounded-lg text-white hover:bg-gray-600">
                    {exchange.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Time Range Selector */}
            <Select value={timeRange} onValueChange={(value: TimePeriod) => setTimeRange(value)}>
              <SelectTrigger className="w-[160px] rounded-lg bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent className="rounded-xl bg-gray-700 border-gray-600">
                {Object.entries(TIME_PERIODS).map(([key, { label }]) => (
                  <SelectItem key={key} value={key} className="rounded-lg text-white hover:bg-gray-600">
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6 bg-gray-800">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[400px] w-full"
          >
            <LineChart 
              accessibilityLayer
              data={transformedData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString('es-ES', {
                    month: 'short',
                    day: 'numeric',
                  });
                }}
              />
              <ChartTooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-gray-800 border border-gray-600 rounded-lg p-3 shadow-lg">
                        <p className="text-white font-medium mb-2">
                          {new Date(label).toLocaleDateString('es-ES', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                        {payload.map((entry: any, index: number) => (
                          <div key={index} className="flex items-center gap-2 mb-1">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: entry.color }}
                            />
                            <span className="text-gray-300 text-sm">
                              {entry.dataKey}: 
                            </span>
                            <span className="text-white font-medium">
                              {Number(entry.value).toFixed(2)} VES
                            </span>
                          </div>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              {selectedExchange === 'all' || selectedExchange === 'BCV USD' ? (
                <Line
                  dataKey="BCV USD"
                  type="monotone"
                  stroke="#10B981"
                  strokeWidth={3}
                  dot={false}
                />
              ) : null}
              {selectedExchange === 'all' || selectedExchange === 'BCV EUR' ? (
                <Line
                  dataKey="BCV EUR"
                  type="monotone"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  dot={false}
                />
              ) : null}
              {selectedExchange === 'all' || selectedExchange === 'ITALCAMBIOS' ? (
                <Line
                  dataKey="ITALCAMBIOS"
                  type="monotone"
                  stroke="#F59E0B"
                  strokeWidth={3}
                  dot={false}
                />
              ) : null}
              {selectedExchange === 'all' || selectedExchange === 'BINANCE_P2P' ? (
                <Line
                  dataKey="BINANCE_P2P"
                  type="monotone"
                  stroke="#EF4444"
                  strokeWidth={3}
                  dot={false}
                />
              ) : null}
              <ChartLegend content={<ChartLegendContent />} />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-white">{stats.totalRecords}</div>
            <p className="text-xs text-gray-400">Total de Registros</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-white">{stats.filteredRecords}</div>
            <p className="text-xs text-gray-400">Registros Filtrados</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-white">{stats.exchangeCount}</div>
            <p className="text-xs text-gray-400">Exchanges Disponibles</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-white">{stats.latestPrice.toFixed(2)} VES</div>
            <p className="text-xs text-gray-400">{stats.latestExchange}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
