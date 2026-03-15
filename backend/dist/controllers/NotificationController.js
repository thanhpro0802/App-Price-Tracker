"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationController = void 0;
const NotificationService_1 = require("../services/NotificationService");
const notificationService = new NotificationService_1.NotificationService();
const DEMO_USER_ID = 1;
class NotificationController {
    async getNotifications(req, res) {
        try {
            const userId = DEMO_USER_ID;
            const notifications = await notificationService.getUserNotifications(userId);
            res.json(notifications);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to fetch notifications' });
        }
    }
    async markRead(req, res) {
        try {
            const id = parseInt(String(req.params.id), 10);
            const notification = await notificationService.markRead(id);
            if (!notification) {
                res.status(404).json({ error: 'Notification not found' });
                return;
            }
            res.json(notification);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to mark notification as read' });
        }
    }
}
exports.NotificationController = NotificationController;
//# sourceMappingURL=NotificationController.js.map