import { useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { Asset } from '../types';
import { formatPrice, formatPercent, getCategoryColor } from '../utils';

interface AssetCardProps {
  asset: Asset;
}

export default function AssetCard({ asset }: AssetCardProps) {
  const navigate = useNavigate();
  const isPositive = (asset.price_change_percent ?? 0) >= 0;

  return (
    <div
      onClick={() => navigate(`/asset/${asset.id}`)}
      className="card-hover p-4 animate-fade-in"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-sm font-bold text-primary-700 dark:text-primary-300">
            {asset.symbol.slice(0, 2)}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{asset.name}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">{asset.symbol}</p>
          </div>
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getCategoryColor(asset.category)}`}>
          {asset.category.replace('_', ' ')}
        </span>
      </div>

      <div className="flex items-end justify-between">
        <span className="text-lg font-bold text-gray-900 dark:text-white">
          {formatPrice(asset.current_price ?? 0)}
        </span>
        <div className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
          {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          {formatPercent(asset.price_change_percent ?? 0)}
        </div>
      </div>

      {asset.last_updated && (
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
          Updated {new Date(asset.last_updated).toLocaleTimeString()}
        </p>
      )}
    </div>
  );
}
