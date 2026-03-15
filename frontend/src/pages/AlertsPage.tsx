import { Trash2, AlertTriangle, CheckCircle, BellRing } from 'lucide-react';
import { useAlerts } from '../hooks/useAlerts';
import { useAssets } from '../hooks/useAssets';
import AlertForm from '../components/AlertForm';
import { formatPrice } from '../utils';

export default function AlertsPage() {
  const { alerts, loading, createAlert, deleteAlert } = useAlerts();
  const { assets } = useAssets();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }

  const activeAlerts = alerts.filter(a => !a.triggered);
  const triggeredAlerts = alerts.filter(a => a.triggered);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Price Alerts</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Get notified when prices hit your targets
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {/* Active Alerts */}
          <div>
            <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              Active Alerts ({activeAlerts.length})
            </h2>
            {activeAlerts.length === 0 ? (
              <div className="card p-8 text-center">
                <BellRing className="w-10 h-10 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                <p className="text-sm text-gray-400">No active alerts</p>
              </div>
            ) : (
              <div className="space-y-2">
                {activeAlerts.map(alert => (
                  <div key={alert.id} className="card p-4 flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${
                      alert.condition === 'above'
                        ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                        : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                    }`}>
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {alert.asset?.name ?? `Asset #${alert.asset_id}`}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Alert when price goes{' '}
                        <span className={
                          alert.condition === 'above'
                            ? 'text-green-600 dark:text-green-400 font-medium'
                            : 'text-red-600 dark:text-red-400 font-medium'
                        }>
                          {alert.condition}
                        </span>{' '}
                        {formatPrice(alert.target_price)}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteAlert(alert.id)}
                      className="p-2 rounded-lg text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-colors"
                      title="Delete alert"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Triggered Alerts */}
          {triggeredAlerts.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Triggered ({triggeredAlerts.length})
              </h2>
              <div className="space-y-2">
                {triggeredAlerts.map(alert => (
                  <div key={alert.id} className="card p-4 flex items-center gap-4 opacity-75">
                    <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {alert.asset?.name ?? `Asset #${alert.asset_id}`}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Triggered — {alert.condition} {formatPrice(alert.target_price)}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteAlert(alert.id)}
                      className="p-2 rounded-lg text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-colors"
                      title="Delete alert"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Create Alert Form */}
        <div>
          <AlertForm assets={assets} onSubmit={createAlert} />
        </div>
      </div>
    </div>
  );
}
