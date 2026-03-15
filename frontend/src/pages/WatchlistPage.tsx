import { useNavigate } from 'react-router-dom';
import { Pin, Trash2, Star } from 'lucide-react';
import { useWatchlist } from '../hooks/useWatchlist';
import { formatPrice, formatPercent } from '../utils';

export default function WatchlistPage() {
  const { watchlist, loading, togglePin, removeFromWatchlist } = useWatchlist();
  const navigate = useNavigate();

  const sortedWatchlist = [...watchlist].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return 0;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Watchlist</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {watchlist.length} asset{watchlist.length !== 1 ? 's' : ''} tracked
        </p>
      </div>

      {watchlist.length === 0 ? (
        <div className="card p-12 text-center">
          <Star className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No assets in your watchlist
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Start exploring and add assets you want to track
          </p>
          <button onClick={() => navigate('/search')} className="btn-primary">
            Explore Assets
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {sortedWatchlist.map(item => {
            const asset = item.asset;
            if (!asset) return null;
            const isPositive = (asset.price_change_percent ?? 0) >= 0;

            return (
              <div
                key={item.id}
                className="card p-4 flex items-center gap-4 hover:shadow-md transition-shadow"
              >
                <button
                  onClick={() => navigate(`/asset/${asset.id}`)}
                  className="flex items-center gap-3 flex-1 min-w-0 text-left"
                >
                  <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-sm font-bold text-primary-700 dark:text-primary-300 flex-shrink-0">
                    {asset.symbol.slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white truncate">
                      {asset.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{asset.symbol}</p>
                  </div>
                </button>

                <div className="text-right flex-shrink-0">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {formatPrice(asset.current_price ?? 0)}
                  </p>
                  <p
                    className={`text-sm font-medium ${
                      isPositive
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {formatPercent(asset.price_change_percent ?? 0)}
                  </p>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => togglePin(asset.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      item.pinned
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                        : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-600'
                    }`}
                    title={item.pinned ? 'Unpin' : 'Pin to dashboard'}
                  >
                    <Pin className={`w-4 h-4 ${item.pinned ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={() => removeFromWatchlist(asset.id)}
                    className="p-2 rounded-lg text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-colors"
                    title="Remove from watchlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
