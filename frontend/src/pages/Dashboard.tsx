import { BarChart3, TrendingUp, TrendingDown, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDashboard } from '../hooks/useDashboard';
import { useWatchlist } from '../hooks/useWatchlist';
import { useAssets } from '../hooks/useAssets';
import { useNotifications } from '../hooks/useNotifications';
import StatsCard from '../components/StatsCard';
import PriceHeatmap from '../components/PriceHeatmap';
import { formatPrice, formatPercent, timeAgo } from '../utils';

export default function Dashboard() {
  const { stats, loading: statsLoading } = useDashboard();
  const { watchlist } = useWatchlist();
  const { assets } = useAssets();
  const { notifications } = useNotifications();
  const navigate = useNavigate();

  const pinnedItems = watchlist.filter(w => w.pinned);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Overview of your tracked assets
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatsCard
          icon={<BarChart3 className="w-5 h-5" />}
          title="Total Tracked"
          value={statsLoading ? '...' : String(stats?.totalTracked ?? 0)}
          subtitle="Assets being monitored"
        />
        <StatsCard
          icon={<TrendingUp className="w-5 h-5" />}
          title="Biggest Gainer"
          value={
            stats?.biggestIncrease
              ? formatPercent(stats.biggestIncrease.price_change_percent ?? 0)
              : '—'
          }
          subtitle={stats?.biggestIncrease?.name}
          trend="up"
        />
        <StatsCard
          icon={<TrendingDown className="w-5 h-5" />}
          title="Biggest Drop"
          value={
            stats?.biggestDrop
              ? formatPercent(stats.biggestDrop.price_change_percent ?? 0)
              : '—'
          }
          subtitle={stats?.biggestDrop?.name}
          trend="down"
        />
      </div>

      {/* Pinned Watchlist */}
      {pinnedItems.length > 0 && (
        <div className="card p-4 lg:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Eye className="w-5 h-5 text-primary-500" />
              Pinned Watchlist
            </h2>
            <button
              onClick={() => navigate('/watchlist')}
              className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
            >
              View all
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {pinnedItems.map(item => {
              const asset = item.asset;
              if (!asset) return null;
              const isPositive = (asset.price_change_percent ?? 0) >= 0;
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(`/asset/${asset.id}`)}
                  className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
                >
                  <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-sm font-bold text-primary-700 dark:text-primary-300">
                    {asset.symbol.slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {asset.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatPrice(asset.current_price ?? 0)}
                    </p>
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      isPositive
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {formatPercent(asset.price_change_percent ?? 0)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Price Heatmap */}
      <PriceHeatmap assets={assets} />

      {/* Recent Notifications */}
      <div className="card p-4 lg:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900 dark:text-white">Recent Notifications</h2>
          <button
            onClick={() => navigate('/notifications')}
            className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
          >
            View all
          </button>
        </div>
        {notifications.length === 0 ? (
          <p className="text-sm text-gray-400">No notifications yet</p>
        ) : (
          <div className="space-y-2">
            {notifications.slice(0, 4).map(notif => (
              <div
                key={notif.id}
                className={`flex items-start gap-3 p-3 rounded-lg ${
                  !notif.read
                    ? 'bg-primary-50/50 dark:bg-primary-900/10'
                    : 'bg-gray-50 dark:bg-gray-700/30'
                }`}
              >
                <div
                  className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${
                    notif.read ? 'bg-gray-300 dark:bg-gray-600' : 'bg-primary-500'
                  }`}
                />
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{notif.message}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{timeAgo(notif.created_at)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
