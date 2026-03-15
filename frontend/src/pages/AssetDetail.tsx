import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { TrendingUp, TrendingDown, Bell } from 'lucide-react';
import { api } from '../services/api';
import { usePriceHistory } from '../hooks/usePriceHistory';
import { useWatchlist } from '../hooks/useWatchlist';
import { useAssets } from '../hooks/useAssets';
import PriceChart from '../components/PriceChart';
import WatchlistButton from '../components/WatchlistButton';
import AlertForm from '../components/AlertForm';
import { formatPrice, formatPercent } from '../utils';
import type { Asset, TimePeriod } from '../types';

export default function AssetDetail() {
  const { id } = useParams<{ id: string }>();
  const assetId = id ? Number(id) : undefined;
  const [asset, setAsset] = useState<Asset | null>(null);
  const [period, setPeriod] = useState<TimePeriod>('7d');
  const [showAlertForm, setShowAlertForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const { prices, loading: pricesLoading } = usePriceHistory(assetId, period);
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const { assets } = useAssets();

  const fetchAsset = useCallback(async () => {
    if (!assetId) return;
    try {
      setLoading(true);
      const data = await api.getAsset(assetId);
      setAsset(data);
    } catch {
      setAsset(null);
    } finally {
      setLoading(false);
    }
  }, [assetId]);

  useEffect(() => {
    fetchAsset();
  }, [fetchAsset]);

  const handleAlertSubmit = async (data: {
    asset_id: number;
    condition: 'above' | 'below';
    target_price: number;
  }) => {
    await api.createAlert(data);
    setShowAlertForm(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-400 text-lg">Asset not found</p>
      </div>
    );
  }

  const isPositive = (asset.price_change_percent ?? 0) >= 0;
  const isWatched = assetId ? isInWatchlist(assetId) : false;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="card p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-lg font-bold text-primary-700 dark:text-primary-300">
              {asset.symbol.slice(0, 3)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{asset.name}</h1>
                <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                  {asset.symbol}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  {formatPrice(asset.current_price ?? 0)}
                </span>
                <span
                  className={`flex items-center gap-1 text-lg font-semibold ${
                    isPositive
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {isPositive ? (
                    <TrendingUp className="w-5 h-5" />
                  ) : (
                    <TrendingDown className="w-5 h-5" />
                  )}
                  {formatPercent(asset.price_change_percent ?? 0)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <WatchlistButton
              isWatched={isWatched}
              onToggle={() =>
                assetId && (isWatched ? removeFromWatchlist(assetId) : addToWatchlist(assetId))
              }
            />
            <button
              onClick={() => setShowAlertForm(!showAlertForm)}
              className={`p-2 rounded-lg transition-colors ${
                showAlertForm
                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              title="Set price alert"
            >
              <Bell className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PriceChart
            prices={prices}
            period={period}
            onPeriodChange={setPeriod}
            loading={pricesLoading}
          />
        </div>

        <div className="space-y-6">
          {/* Asset Info */}
          <div className="card p-4 lg:p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Asset Info</h3>
            <dl className="space-y-3">
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500 dark:text-gray-400">Category</dt>
                <dd className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                  {asset.category.replace('_', ' ')}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500 dark:text-gray-400">Symbol</dt>
                <dd className="text-sm font-medium text-gray-900 dark:text-white">{asset.symbol}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500 dark:text-gray-400">Last Updated</dt>
                <dd className="text-sm font-medium text-gray-900 dark:text-white">
                  {asset.last_updated
                    ? new Date(asset.last_updated).toLocaleString()
                    : 'N/A'}
                </dd>
              </div>
              {prices.length > 0 && (
                <>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500 dark:text-gray-400">Period High</dt>
                    <dd className="text-sm font-medium text-green-600 dark:text-green-400">
                      {formatPrice(Math.max(...prices.map(p => p.price)))}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500 dark:text-gray-400">Period Low</dt>
                    <dd className="text-sm font-medium text-red-600 dark:text-red-400">
                      {formatPrice(Math.min(...prices.map(p => p.price)))}
                    </dd>
                  </div>
                </>
              )}
            </dl>
          </div>

          {/* Alert Form */}
          {showAlertForm && (
            <AlertForm
              assets={assets}
              defaultAssetId={assetId}
              onSubmit={handleAlertSubmit}
            />
          )}
        </div>
      </div>
    </div>
  );
}
