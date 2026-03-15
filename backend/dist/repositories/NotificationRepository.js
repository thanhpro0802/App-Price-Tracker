"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationRepository = void 0;
const database_1 = require("../config/database");
const inMemoryStore_1 = require("../config/inMemoryStore");
class NotificationRepository {
    async getUserNotifications(userId) {
        if (!(0, database_1.isDatabaseAvailable)()) {
            return inMemoryStore_1.store.notifications
                .filter(n => n.user_id === userId)
                .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        }
        const result = await (0, database_1.query)('SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
        return result.rows;
    }
    async markRead(id) {
        if (!(0, database_1.isDatabaseAvailable)()) {
            const notif = inMemoryStore_1.store.notifications.find(n => n.id === id);
            if (!notif)
                return null;
            notif.read = true;
            return notif;
        }
        const result = await (0, database_1.query)('UPDATE notifications SET read = TRUE WHERE id = $1 RETURNING *', [id]);
        return result.rows[0] ?? null;
    }
    async create(data) {
        if (!(0, database_1.isDatabaseAvailable)()) {
            const notif = {
                id: inMemoryStore_1.store.getNextId('notifications'),
                user_id: data.user_id,
                alert_id: data.alert_id,
                message: data.message,
                read: false,
                created_at: new Date(),
            };
            inMemoryStore_1.store.notifications.push(notif);
            return notif;
        }
        const result = await (0, database_1.query)('INSERT INTO notifications (user_id, alert_id, message) VALUES ($1, $2, $3) RETURNING *', [data.user_id, data.alert_id, data.message]);
        return result.rows[0];
    }
}
exports.NotificationRepository = NotificationRepository;
//# sourceMappingURL=NotificationRepository.js.map