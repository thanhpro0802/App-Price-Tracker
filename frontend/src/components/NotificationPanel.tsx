import { useNavigate } from 'react-router-dom';
import { Bell, Check } from 'lucide-react';
import type { Notification } from '../types';

interface NotificationPanelProps {
  notifications: Notification[];
  onMarkRead: (id: number) => void;
  onClose: () => void;
}

export default function NotificationPanel({ notifications, onMarkRead, onClose }: NotificationPanelProps) {
  const navigate = useNavigate();

  return (
    <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50 animate-fade-in">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-sm text-gray-900 dark:text-white">Notifications</h3>
        <button
          onClick={() => {
            onClose();
            navigate('/notifications');
          }}
          className="text-xs text-primary-600 dark:text-primary-400 hover:underline"
        >
          View all
        </button>
      </div>

      <div className="max-h-80 overflow-auto">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-sm text-gray-400">
            <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
            No notifications
          </div>
        ) : (
          notifications.slice(0, 5).map(notif => (
            <div
              key={notif.id}
              className={`flex items-start gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-700/50 last:border-0 ${
                !notif.read ? 'bg-primary-50/50 dark:bg-primary-900/10' : ''
              }`}
            >
              <div className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${
                notif.read ? 'bg-gray-300 dark:bg-gray-600' : 'bg-primary-500'
              }`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700 dark:text-gray-300">{notif.message}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                  {new Date(notif.created_at).toLocaleString()}
                </p>
              </div>
              {!notif.read && (
                <button
                  onClick={() => onMarkRead(notif.id)}
                  className="p-1 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  title="Mark as read"
                >
                  <Check className="w-4 h-4" />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
