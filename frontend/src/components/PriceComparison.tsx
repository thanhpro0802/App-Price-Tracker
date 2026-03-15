import { useState, useEffect, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { api } from '../services/api';
import type { Asset, Price, TimePeriod } from '../types';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

const COLORS = [
  { border: 'rgb(99, 102, 241)', bg: 'rgba(99, 102, 241, 0.1)' },
  { border: 'rgb(234, 179, 8)', bg: 'rgba(234, 179, 8, 0.1)' },
  { border: 'rgb(34, 197, 94)', bg: 'rgba(34, 197, 94, 0.1)' },
  { border: 'rgb(239, 68, 68)', bg: 'rgba(239, 68, 68, 0.1)' },
  { border: 'rgb(168, 85, 247)', bg: 'rgba(168, 85, 247, 0.1)' },
];

interface PriceComparisonProps {
  assets: Asset[];
}

export default function PriceComparison({ assets }: PriceComparisonProps) {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [priceData, setPriceData] = useState<Record<number, Price[]>>({});
  const [period] = useState<TimePeriod>('30d');
  const [loading, setLoading] = useState(false);

  const toggleAsset = (id: number) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 5 ? [...prev, id] : prev
    );
  };

  useEffect(() => {
    const fetchAll = async () => {
      if (selectedIds.length === 0) return;
      setLoading(true);
      const results: Record<number, Price[]> = {};
      await Promise.all(
        selectedIds.map(async id => {
          results[id] = await api.getPriceHistory(id, period);
        })
      );
      setPriceData(results);
      setLoading(false);
    };
    fetchAll();
  }, [selectedIds, period]);

  const chartData = useMemo(() => {
    if (selectedIds.length === 0) return null;
    const firstId = selectedIds[0];
    const firstPrices = priceData[firstId] ?? [];
    const labels = firstPrices.map(p =>
      new Date(p.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })
    );

    const datasets = selectedIds.map((id, i) => {
      const asset = assets.find(a => a.id === id);
      const prices = priceData[id] ?? [];
      // Normalize to percentage change from first price
      const basePrice = prices[0]?.price ?? 1;
      const color = COLORS[i % COLORS.length];

      return {
        label: asset?.name ?? `Asset ${id}`,
        data: prices.map(p => ((p.price - basePrice) / basePrice) * 100),
        borderColor: color.border,
        backgroundColor: color.bg,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 4,
        borderWidth: 2,
        fill: false,
      };
    });

    return { labels, datasets };
  }, [selectedIds, priceData, assets]);

  return (
    <div className="card p-4 lg:p-6">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Compare Assets</h3>

      <div className="flex flex-wrap gap-2 mb-4">
        {assets.slice(0, 10).map(asset => (
          <button
            key={asset.id}
            onClick={() => toggleAsset(asset.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              selectedIds.includes(asset.id)
                ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border border-primary-300 dark:border-primary-700'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border border-transparent hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            {asset.symbol}
          </button>
        ))}
      </div>

      <div className="h-64 lg:h-72">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
          </div>
        ) : chartData && chartData.datasets.length > 0 ? (
          <Line
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              interaction: { intersect: false, mode: 'index' },
              plugins: {
                legend: {
                  position: 'top',
                  labels: { boxWidth: 12, usePointStyle: true, padding: 16, font: { size: 11 } },
                },
                tooltip: {
                  callbacks: {
                    label: ctx => {
                      const y = ctx.parsed.y ?? 0;
                      return `${ctx.dataset.label}: ${y >= 0 ? '+' : ''}${y.toFixed(2)}%`;
                    },
                  },
                },
              },
              scales: {
                x: { grid: { display: false }, ticks: { maxTicksLimit: 8, font: { size: 11 } }, border: { display: false } },
                y: {
                  grid: { color: 'rgba(156, 163, 175, 0.1)' },
                  ticks: { callback: v => `${Number(v) >= 0 ? '+' : ''}${v}%`, font: { size: 11 } },
                  border: { display: false },
                },
              },
            }}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400 text-sm">
            Select assets to compare
          </div>
        )}
      </div>
    </div>
  );
}
