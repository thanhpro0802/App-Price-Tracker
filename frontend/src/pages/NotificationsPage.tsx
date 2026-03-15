import { Bell, Check, CheckCheck } from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications';
import { timeAgo } from '../utils';

export default function NotificationsPage() {
  const { notifications, loading, markAsRead } = useNotifications();

  const unread = notifications.filter(n => !n.read);
  const read = notifications.filter(n => n.read);

  const markAllRead = () => {
    unread.forEach(n => markAsRead(n.id));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {unread.length} unread notification{unread.length !== 1 ? 's' : ''}
          </p>
        </div>
        {unread.length > 0 && (
          <button
            onClick={markAllRead}
            className="btn-secondary text-sm flex items-center gap-2"
          >
            <CheckCheck className="w-4 h-4" />
            Mark all read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="card p-12 text-center">
          <Bell className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            All caught up!
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            You have no notifications at the moment
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Unread */}
          {unread.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Unread
              </h2>
              <div className="space-y-2">
                {unread.map(notif => (
                  <div
                    key={notif.id}
                    className="card p-4 flex items-start gap-4 bg-primary-50/30 dark:bg-primary-900/10 border-primary-200 dark:border-primary-800"
                  >
                    <div className="mt-0.5 w-3 h-3 rounded-full bg-primary-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-800 dark:text-gray-200">{notif.message}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        {timeAgo(notif.created_at)}
                      </p>
                    </div>
                    <button
                      onClick={() => markAsRead(notif.id)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors flex-shrink-0"
                      title="Mark as read"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Read */}
          {read.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Read
              </h2>
              <div className="space-y-2">
                {read.map(notif => (
                  <div
                    key={notif.id}
                    className="card p-4 flex items-start gap-4 opacity-60"
                  >
                    <div className="mt-0.5 w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-700 dark:text-gray-300">{notif.message}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        {timeAgo(notif.created_at)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
