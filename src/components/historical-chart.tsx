'use client';

import { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

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
}

export function HistoricalChart({ data, startDate, endDate }: HistoricalChartProps) {
  const chartRef = useRef<ChartJS<'line', { x: string; y: number; }[], unknown> | null>(null);

  // Group data by exchange and currency pair
  const groupedData = data.reduce((acc, rate) => {
    const key = `${rate.exchange_code}-${rate.currency_pair}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(rate);
    return acc;
  }, {} as Record<string, HistoricalRate[]>);

  // Sort each group by timestamp
  Object.keys(groupedData).forEach(key => {
    groupedData[key].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  });

  // Define colors for different data series
  const colors = {
    'BCV-USD/VES': { border: '#3b82f6', background: '#3b82f620' },
    'BCV-EUR/VES': { border: '#10b981', background: '#10b98120' },
    'BINANCE_P2P-USDT/VES': { border: '#f59e0b', background: '#f59e0b20' },
  };

  // Create datasets for the chart with smooth curved lines
  const datasets = Object.entries(groupedData).map(([key, rates]) => {
    const [exchange, pair] = key.split('-');
    const color = colors[key as keyof typeof colors] || { border: '#6b7280', background: '#6b728020' };
    
    return {
      label: `${exchange} ${pair}`,
      data: rates.map(rate => ({
        x: rate.timestamp,
        y: rate.avg_price || rate.buy_price,
      })),
      borderColor: color.border,
      backgroundColor: 'transparent',
      borderWidth: 2,
      fill: false,
      tension: 0.4, // Add curve tension for smooth lines
      cubicInterpolationMode: 'monotone' as const, // Use monotone interpolation for natural curves
      pointRadius: 3,
      pointHoverRadius: 5,
      pointBackgroundColor: color.border,
      pointBorderColor: '#ffffff',
      pointBorderWidth: 1,
    };
  });

  const chartData = {
    datasets,
  };

  // Calculate date range for chart title
  const getDateRangeText = () => {
    if (startDate && endDate) {
      const start = new Date(startDate).toLocaleDateString();
      const end = new Date(endDate).toLocaleDateString();
      return `${start} - ${end}`;
    }
    if (data.length > 0) {
      const timestamps = data.map(d => new Date(d.timestamp).getTime());
      const start = new Date(Math.min(...timestamps)).toLocaleDateString();
      const end = new Date(Math.max(...timestamps)).toLocaleDateString();
      return `${start} - ${end}`;
    }
    return '';
  };

  // Determine appropriate time unit based on date range
  const getTimeUnit = () => {
    if (!startDate || !endDate) return 'day';
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 7) return 'day';
    if (diffDays <= 30) return 'day';
    if (diffDays <= 90) return 'week';
    return 'month';
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#d1d5db',
          usePointStyle: true,
          pointStyle: 'line',
        },
      },
      title: {
        display: true,
        text: `Historico de Cotizaciones ${startDate && endDate ? ` (${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()})` : ''}`,
        color: '#f3f4f6',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: '#1f2937',
        titleColor: '#f3f4f6',
        bodyColor: '#d1d5db',
        borderColor: '#374151',
        borderWidth: 1,
        callbacks: {
          title: function(context: Array<{ parsed: { x: number } }>) {
            const date = new Date(context[0].parsed.x);
            return date.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });
          },
          label: function(context: { parsed: { y: number }; dataset: { label?: string } }) {
            const value = context.parsed.y;
            return `${context.dataset.label || 'Unknown'}: ${value.toFixed(2)} VES`;
          },
        },
      },
    },
    scales: {
      x: {
        type: 'time' as const,
        time: {
          unit: getTimeUnit() as 'day' | 'week' | 'month',
          displayFormats: {
            day: 'MMM dd',
            week: 'MMM dd',
            month: 'MMM yyyy',
          },
        },
        min: startDate ? new Date(startDate).toISOString() : undefined,
        max: endDate ? new Date(endDate + 'T23:59:59.999Z').toISOString() : undefined,
        grid: {
          color: '#374151',
          drawBorder: false,
        },
        ticks: {
          color: '#9ca3af',
          maxTicksLimit: 10,
        },
        title: {
          display: true,
          text: 'Date',
          color: '#d1d5db',
        },
      },
      y: {
        grid: {
          color: '#374151',
          drawBorder: false,
        },
        ticks: {
          color: '#9ca3af',
          callback: function(value: string | number) {
            return `${Number(value).toFixed(2)} VES`;
          },
        },
        title: {
          display: true,
          text: 'Price (VES)',
          color: '#d1d5db',
        },
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
  };

  useEffect(() => {
    const chart = chartRef.current;
    return () => {
      if (chart) {
        chart.destroy();
      }
    };
  }, []);

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
      {/* Chart */}
      <div className="h-96 w-full">
        <Line ref={chartRef} data={chartData} options={options} />
      </div>
      
      {/* Data summary */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
        <div className="bg-gray-700 rounded p-3">
          <div className="text-gray-400">Total Records</div>
          <div className="text-xl font-bold text-white">{data.length}</div>
        </div>
        <div className="bg-gray-700 rounded p-3">
          <div className="text-gray-400">Exchanges</div>
          <div className="text-xl font-bold text-white">{Object.keys(groupedData).length}</div>
        </div>
        <div className="bg-gray-700 rounded p-3">
          <div className="text-gray-400">Date Range</div>
          <div className="text-sm text-white">
            {getDateRangeText() || 'No data'}
          </div>
        </div>
        <div className="bg-gray-700 rounded p-3">
          <div className="text-gray-400">Latest Price</div>
          <div className="text-sm text-white">
            {data.length > 0 && (
              <>
                {(data[0].avg_price || data[0].buy_price).toFixed(2)} VES
                <div className="text-xs text-gray-400">
                  {data[0].exchange_code} {data[0].currency_pair}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}