import { useNavigate } from 'react-router-dom';
import type { Asset } from '../types';

interface PriceHeatmapProps {
  assets: Asset[];
}

function getHeatColor(change: number): string {
  const intensity = Math.min(Math.abs(change) / 5, 1);
  if (change >= 0) {
    const g = Math.round(130 + intensity * 125);
    return `rgba(34, ${g}, 94, ${0.15 + intensity * 0.6})`;
  } else {
    const r = Math.round(180 + intensity * 75);
    return `rgba(${r}, 68, 68, ${0.15 + intensity * 0.6})`;
  }
}

function getTextColor(change: number): string {
  const intensity = Math.min(Math.abs(change) / 5, 1);
  if (intensity > 0.5) return 'text-white';
  if (change >= 0) return 'text-green-800 dark:text-green-200';
  return 'text-red-800 dark:text-red-200';
}

export default function PriceHeatmap({ assets }: PriceHeatmapProps) {
  const navigate = useNavigate();

  if (assets.length === 0) {
    return (
      <div className="card p-6 text-center text-gray-400">
        No asset data available
      </div>
    );
  }

  return (
    <div className="card p-4 lg:p-6">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Price Heatmap</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {assets.map(asset => {
          const change = asset.price_change_percent ?? 0;
          return (
            <button
              key={asset.id}
              onClick={() => navigate(`/asset/${asset.id}`)}
              className="rounded-lg p-3 text-left transition-transform hover:scale-[1.02] active:scale-[0.98]"
              style={{ backgroundColor: getHeatColor(change) }}
            >
              <p className={`text-xs font-bold truncate ${getTextColor(change)}`}>
                {asset.symbol}
              </p>
              <p className={`text-sm font-semibold mt-1 ${getTextColor(change)}`}>
                {change >= 0 ? '+' : ''}{change.toFixed(2)}%
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
