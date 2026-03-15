import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { checkDatabaseConnection } from './config/database';
import { startPriceScheduler } from './scheduler/priceScheduler';
import { PriceUpdateService } from './services/PriceUpdateService';

const PORT = process.env.PORT || 5000;

async function main(): Promise<void> {
  // Check database availability
  await checkDatabaseConnection();

  // Seed historical data and run initial price update
  const priceUpdateService = new PriceUpdateService();
  await priceUpdateService.seedHistoricalPrices();
  await priceUpdateService.updateAllPrices();

  // Start the scheduler
  startPriceScheduler();

  // Start the server
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API available at http://localhost:${PORT}/api`);
  });
}

main().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
