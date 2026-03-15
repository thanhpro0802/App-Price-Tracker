import { Notification } from '../models';
export declare class NotificationService {
    getUserNotifications(userId: number): Promise<Notification[]>;
    markRead(id: number): Promise<Notification | null>;
}
//# sourceMappingURL=NotificationService.d.ts.map