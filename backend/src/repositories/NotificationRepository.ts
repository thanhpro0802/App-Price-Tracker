import { query, isDatabaseAvailable } from '../config/database';
import { store } from '../config/inMemoryStore';
import { Notification } from '../models';

export class NotificationRepository {
  async getUserNotifications(userId: number): Promise<Notification[]> {
    if (!isDatabaseAvailable()) {
      return store.notifications
        .filter(n => n.user_id === userId)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
    const result = await query(
      'SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    return result.rows;
  }

  async markRead(id: number): Promise<Notification | null> {
    if (!isDatabaseAvailable()) {
      const notif = store.notifications.find(n => n.id === id);
      if (!notif) return null;
      notif.read = true;
      return notif;
    }
    const result = await query(
      'UPDATE notifications SET read = TRUE WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0] ?? null;
  }

  async create(data: {
    user_id: number;
    alert_id: number;
    message: string;
  }): Promise<Notification> {
    if (!isDatabaseAvailable()) {
      const notif: Notification = {
        id: store.getNextId('notifications'),
        user_id: data.user_id,
        alert_id: data.alert_id,
        message: data.message,
        read: false,
        created_at: new Date(),
      };
      store.notifications.push(notif);
      return notif;
    }
    const result = await query(
      'INSERT INTO notifications (user_id, alert_id, message) VALUES ($1, $2, $3) RETURNING *',
      [data.user_id, data.alert_id, data.message]
    );
    return result.rows[0];
  }
}
