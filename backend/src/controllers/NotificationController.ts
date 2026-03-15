import { Request, Response } from 'express';
import { NotificationService } from '../services/NotificationService';

const notificationService = new NotificationService();
const DEMO_USER_ID = 1;

export class NotificationController {
  async getNotifications(req: Request, res: Response): Promise<void> {
    try {
      const userId = DEMO_USER_ID;
      const notifications = await notificationService.getUserNotifications(userId);
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch notifications' });
    }
  }

  async markRead(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(String(req.params.id), 10);
      const notification = await notificationService.markRead(id);
      if (!notification) {
        res.status(404).json({ error: 'Notification not found' });
        return;
      }
      res.json(notification);
    } catch (error) {
      res.status(500).json({ error: 'Failed to mark notification as read' });
    }
  }
}
