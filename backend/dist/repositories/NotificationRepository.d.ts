import { Notification } from '../models';
export declare class NotificationRepository {
    getUserNotifications(userId: number): Promise<Notification[]>;
    markRead(id: number): Promise<Notification | null>;
    create(data: {
        user_id: number;
        alert_id: number;
        message: string;
    }): Promise<Notification>;
}
//# sourceMappingURL=NotificationRepository.d.ts.map