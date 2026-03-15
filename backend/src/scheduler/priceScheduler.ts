import cron from 'node-cron';
import { PriceUpdateService } from '../services/PriceUpdateService';
import { AlertService } from '../services/AlertService';

const priceUpdateService = new PriceUpdateService();
const alertService = new AlertService();

export function startPriceScheduler(): void {
  // Run price updates every 5 minutes
  cron.schedule('*/5 * * * *', async () => {
    try {
      await priceUpdateService.updateAllPrices();
      await alertService.checkAlerts();
    } catch (error) {
      console.error('Scheduled price update failed:', error);
    }
  });

  console.log('Price scheduler started (every 5 minutes)');
}
