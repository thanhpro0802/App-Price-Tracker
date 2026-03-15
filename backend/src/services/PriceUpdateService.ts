import { AssetRepository } from '../repositories/AssetRepository';
import { PriceRepository } from '../repositories/PriceRepository';
import { isDatabaseAvailable, query as dbQuery } from '../config/database';
import { store } from '../config/inMemoryStore';

const assetRepository = new AssetRepository();
const priceRepository = new PriceRepository();

// Base prices used when real APIs are unavailable
const BASE_PRICES: Record<string, number> = {
  BTC: 67500,
  ETH: 3450,
  SOL: 145,
  'USD/VND': 25400,
  'JPY/VND': 168,
  'EUR/VND': 27500,
  XAU: 2350,
  XAG: 28.5,
  IPHONE: 29990000,
  MACBOOK: 37990000,
  GAMING_LAPTOP: 32990000,
};

// Volatility factor per asset (percentage)
const VOLATILITY: Record<string, number> = {
  BTC: 2.5,
  ETH: 3.0,
  SOL: 5.0,
  'USD/VND': 0.1,
  'JPY/VND': 0.15,
  'EUR/VND': 0.2,
  XAU: 0.8,
  XAG: 1.5,
  IPHONE: 0.01,
  MACBOOK: 0.01,
  GAMING_LAPTOP: 0.02,
};

// Track last generated price for smooth random walk
const lastPrices: Record<string, number> = {};

function generatePrice(symbol: string): number {
  const base = BASE_PRICES[symbol] ?? 100;
  const volatility = (VOLATILITY[symbol] ?? 1) / 100;

  const lastPrice = lastPrices[symbol] ?? base;
  // Random walk: change between -volatility% and +volatility%
  const changePercent = (Math.random() - 0.5) * 2 * volatility;
  const newPrice = lastPrice * (1 + changePercent);

  lastPrices[symbol] = newPrice;
  return Number(newPrice.toFixed(8));
}

export class PriceUpdateService {
  async updateAllPrices(): Promise<void> {
    const assets = await assetRepository.findAll();

    for (const asset of assets) {
      try {
        const price = generatePrice(asset.symbol);
        await priceRepository.insertPrice(asset.id, price);
      } catch (error) {
        console.error(`Failed to update price for ${asset.symbol}:`, error);
      }
    }

    console.log(`[${new Date().toISOString()}] Prices updated for ${assets.length} assets`);
  }

  async seedHistoricalPrices(): Promise<void> {
    const assets = await assetRepository.findAll();
    const now = Date.now();
    // Seed 48 hours of data, one entry every 5 minutes
    const intervals = (48 * 60) / 5;

    for (const asset of assets) {
      const base = BASE_PRICES[asset.symbol] ?? 100;
      const volatility = (VOLATILITY[asset.symbol] ?? 1) / 100;
      let price = base;

      for (let i = intervals; i >= 0; i--) {
        const changePercent = (Math.random() - 0.5) * 2 * volatility;
        price = price * (1 + changePercent);

        const timestamp = new Date(now - i * 5 * 60 * 1000);
        const priceRecord = {
          id: 0,
          asset_id: asset.id,
          price: Number(price.toFixed(8)),
          timestamp,
        };
        if (!isDatabaseAvailable()) {
          priceRecord.id = store.getNextId('prices');
          store.prices.push(priceRecord);
        } else {
          await dbQuery(
            'INSERT INTO prices (asset_id, price, timestamp) VALUES ($1, $2, $3)',
            [asset.id, priceRecord.price, timestamp]
          );
        }
      }
      lastPrices[asset.symbol] = price;
    }
    console.log('Historical price data seeded');
  }
}
