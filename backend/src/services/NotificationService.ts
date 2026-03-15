import { NotificationRepository } from '../repositories/NotificationRepository';
import { Notification } from '../models';

const notificationRepository = new NotificationRepository();

export class NotificationService {
  async getUserNotifications(userId: number): Promise<Notification[]> {
    return notificationRepository.getUserNotifications(userId);
  }

  async markRead(id: number): Promise<Notification | null> {
    return notificationRepository.markRead(id);
  }
}
