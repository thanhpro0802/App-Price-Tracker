import { PriceRepository } from '../repositories/PriceRepository';
import { AssetRepository } from '../repositories/AssetRepository';
import { Price, Asset } from '../models';

const priceRepository = new PriceRepository();
const assetRepository = new AssetRepository();

export interface PriceWithChange {
  asset: Asset;
  currentPrice: number;
  previousPrice: number | null;
  change: number | null;
  changePercent: number | null;
}

export class PriceService {
  async getLatestPrice(assetId: number): Promise<Price | null> {
    return priceRepository.getLatestPrice(assetId);
  }

  async getPriceHistory(assetId: number, period: string): Promise<Price[]> {
    return priceRepository.getPriceHistory(assetId, period);
  }

  async insertPrice(assetId: number, price: number): Promise<Price> {
    return priceRepository.insertPrice(assetId, price);
  }

  async getAllPricesWithChange(): Promise<PriceWithChange[]> {
    const assets = await assetRepository.findAll();
    const latestPrices = await priceRepository.getLatestPrices();
    const previousPrices = await priceRepository.getPreviousPrices(24);

    const latestMap = new Map<number, number>();
    for (const p of latestPrices) {
      latestMap.set(p.asset_id, Number(p.price));
    }

    const prevMap = new Map<number, number>();
    for (const p of previousPrices) {
      prevMap.set(p.asset_id, Number(p.price));
    }

    return assets.map(asset => {
      const currentPrice = latestMap.get(asset.id) ?? 0;
      const previousPrice = prevMap.get(asset.id) ?? null;
      let change: number | null = null;
      let changePercent: number | null = null;

      if (previousPrice !== null && previousPrice !== 0) {
        change = currentPrice - previousPrice;
        changePercent = (change / previousPrice) * 100;
      }

      return { asset, currentPrice, previousPrice, change, changePercent };
    });
  }
}
