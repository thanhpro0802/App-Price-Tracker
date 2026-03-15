import { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  type TooltipItem,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import type { Price, TimePeriod } from '../types';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend);

interface PriceChartProps {
  prices: Price[];
  period: TimePeriod;
  onPeriodChange: (period: TimePeriod) => void;
  loading?: boolean;
}

const periods: { value: TimePeriod; label: string }[] = [
  { value: '24h', label: '24H' },
  { value: '7d', label: '7D' },
  { value: '30d', label: '30D' },
  { value: '1y', label: '1Y' },
];

function formatDate(ts: string, period: TimePeriod): string {
  const d = new Date(ts);
  if (period === '24h') return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  if (period === '7d') return d.toLocaleDateString([], { weekday: 'short', hour: '2-digit' });
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

export default function PriceChart({ prices, period, onPeriodChange, loading }: PriceChartProps) {
  const isPositive = prices.length >= 2 && prices[prices.length - 1].price >= prices[0].price;

  const chartData = useMemo(() => {
    const labels = prices.map(p => formatDate(p.timestamp, period));
    const data = prices.map(p => p.price);
    const color = isPositive ? '34, 197, 94' : '239, 68, 68';

    return {
      labels,
      datasets: [
        {
          label: 'Price',
          data,
          borderColor: `rgb(${color})`,
          backgroundColor: (context: { chart: ChartJS }) => {
            const chart = context.chart;
            const { ctx, chartArea } = chart;
            if (!chartArea) return `rgba(${color}, 0.1)`;
            const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
            gradient.addColorStop(0, `rgba(${color}, 0.3)`);
            gradient.addColorStop(1, `rgba(${color}, 0.0)`);
            return gradient;
          },
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: `rgb(${color})`,
          pointHoverBorderColor: '#fff',
          pointHoverBorderWidth: 2,
          borderWidth: 2,
        },
      ],
    };
  }, [prices, period, isPositive]);

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: { intersect: false, mode: 'index' as const },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(0,0,0,0.8)',
          titleFont: { size: 12 },
          bodyFont: { size: 14, weight: 'bold' as const },
          padding: 12,
          cornerRadius: 8,
          callbacks: {
            label: (ctx: TooltipItem<'line'>) => {
              const val = ctx.parsed.y ?? 0;
              return `$${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            },
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            maxTicksLimit: 8,
            color: '#9ca3af',
            font: { size: 11 },
          },
          border: { display: false },
        },
        y: {
          grid: { color: 'rgba(156, 163, 175, 0.1)' },
          ticks: {
            color: '#9ca3af',
            font: { size: 11 },
            callback: (value: string | number) =>
              `$${Number(value).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`,
          },
          border: { display: false },
        },
      },
    }),
    []
  );

  return (
    <div className="card p-4 lg:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 dark:text-white">Price History</h3>
        <div className="flex gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          {periods.map(p => (
            <button
              key={p.value}
              onClick={() => onPeriodChange(p.value)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                period === p.value
                  ? 'bg-white dark:bg-gray-600 text-primary-600 dark:text-primary-400 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="relative h-64 lg:h-80">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
          </div>
        ) : prices.length > 0 ? (
          <Line data={chartData} options={options} />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            No price data available
          </div>
        )}
      </div>
    </div>
  );
}
