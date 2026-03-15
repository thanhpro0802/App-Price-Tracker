import { AlertRepository } from '../repositories/AlertRepository';
import { NotificationRepository } from '../repositories/NotificationRepository';
import { PriceRepository } from '../repositories/PriceRepository';
import { AssetRepository } from '../repositories/AssetRepository';
import { Alert } from '../models';

const alertRepository = new AlertRepository();
const notificationRepository = new NotificationRepository();
const priceRepository = new PriceRepository();
const assetRepository = new AssetRepository();

export class AlertService {
  async getUserAlerts(userId: number): Promise<Alert[]> {
    return alertRepository.getUserAlerts(userId);
  }

  async createAlert(data: {
    user_id: number;
    asset_id: number;
    condition: 'above' | 'below';
    target_price: number;
  }): Promise<Alert> {
    return alertRepository.createAlert(data);
  }

  async deleteAlert(id: number): Promise<void> {
    return alertRepository.deleteAlert(id);
  }

  async checkAlerts(): Promise<void> {
    const activeAlerts = await alertRepository.getActiveAlerts();

    for (const alert of activeAlerts) {
      const latestPrice = await priceRepository.getLatestPrice(alert.asset_id);
      if (!latestPrice) continue;

      const currentPrice = Number(latestPrice.price);
      const targetPrice = Number(alert.target_price);
      let triggered = false;

      if (alert.condition === 'above' && currentPrice >= targetPrice) {
        triggered = true;
      } else if (alert.condition === 'below' && currentPrice <= targetPrice) {
        triggered = true;
      }

      if (triggered) {
        await alertRepository.markTriggered(alert.id);

        const asset = await assetRepository.findById(alert.asset_id);
        const assetName = asset?.name ?? `Asset #${alert.asset_id}`;
        const message = `${assetName} price is now ${currentPrice}, which is ${alert.condition} your target of ${targetPrice}`;

        await notificationRepository.create({
          user_id: alert.user_id,
          alert_id: alert.id,
          message,
        });
      }
    }
  }
}
