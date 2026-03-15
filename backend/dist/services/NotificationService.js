"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const NotificationRepository_1 = require("../repositories/NotificationRepository");
const notificationRepository = new NotificationRepository_1.NotificationRepository();
class NotificationService {
    async getUserNotifications(userId) {
        return notificationRepository.getUserNotifications(userId);
    }
    async markRead(id) {
        return notificationRepository.markRead(id);
    }
}
exports.NotificationService = NotificationService;
//# sourceMappingURL=NotificationService.js.map