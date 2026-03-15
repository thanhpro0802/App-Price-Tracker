import { query, isDatabaseAvailable } from '../config/database';
import { store } from '../config/inMemoryStore';
import { Price } from '../models';

export class PriceRepository {
  async getLatestPrice(assetId: number): Promise<Price | null> {
    if (!isDatabaseAvailable()) {
      const prices = store.prices
        .filter(p => p.asset_id === assetId)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      return prices[0] ?? null;
    }
    const result = await query(
      'SELECT * FROM prices WHERE asset_id = $1 ORDER BY timestamp DESC LIMIT 1',
      [assetId]
    );
    return result.rows[0] ?? null;
  }

  async getPriceHistory(assetId: number, period: string): Promise<Price[]> {
    const interval = this.periodToInterval(period);

    if (!isDatabaseAvailable()) {
      const cutoff = new Date(Date.now() - interval);
      return store.prices
        .filter(p => p.asset_id === assetId && new Date(p.timestamp) >= cutoff)
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    }

    const result = await query(
      `SELECT * FROM prices WHERE asset_id = $1 AND timestamp >= NOW() - INTERVAL '${this.periodToSqlInterval(period)}' ORDER BY timestamp ASC`,
      [assetId]
    );
    return result.rows;
  }

  async insertPrice(assetId: number, price: number): Promise<Price> {
    if (!isDatabaseAvailable()) {
      const newPrice: Price = {
        id: store.getNextId('prices'),
        asset_id: assetId,
        price,
        timestamp: new Date(),
      };
      store.prices.push(newPrice);
      return newPrice;
    }
    const result = await query(
      'INSERT INTO prices (asset_id, price) VALUES ($1, $2) RETURNING *',
      [assetId, price]
    );
    return result.rows[0];
  }

  async getLatestPrices(): Promise<Price[]> {
    if (!isDatabaseAvailable()) {
      const latestMap = new Map<number, Price>();
      for (const p of store.prices) {
        const existing = latestMap.get(p.asset_id);
        if (!existing || new Date(p.timestamp).getTime() > new Date(existing.timestamp).getTime()) {
          latestMap.set(p.asset_id, p);
        }
      }
      return Array.from(latestMap.values());
    }
    const result = await query(
      `SELECT DISTINCT ON (asset_id) * FROM prices ORDER BY asset_id, timestamp DESC`
    );
    return result.rows;
  }

  async getPreviousPrices(hoursAgo: number): Promise<Price[]> {
    if (!isDatabaseAvailable()) {
      const cutoff = new Date(Date.now() - hoursAgo * 60 * 60 * 1000);
      const targetMap = new Map<number, Price>();
      for (const p of store.prices) {
        const ts = new Date(p.timestamp).getTime();
        if (ts <= cutoff.getTime()) {
          const existing = targetMap.get(p.asset_id);
          if (!existing || Math.abs(ts - cutoff.getTime()) < Math.abs(new Date(existing.timestamp).getTime() - cutoff.getTime())) {
            targetMap.set(p.asset_id, p);
          }
        }
      }
      return Array.from(targetMap.values());
    }
    const result = await query(
      `SELECT DISTINCT ON (asset_id) * FROM prices
       WHERE timestamp <= NOW() - INTERVAL '${hoursAgo} hours'
       ORDER BY asset_id, timestamp DESC`
    );
    return result.rows;
  }

  private periodToInterval(period: string): number {
    switch (period) {
      case '24h': return 24 * 60 * 60 * 1000;
      case '7d': return 7 * 24 * 60 * 60 * 1000;
      case '30d': return 30 * 24 * 60 * 60 * 1000;
      case '1y': return 365 * 24 * 60 * 60 * 1000;
      default: return 24 * 60 * 60 * 1000;
    }
  }

  private periodToSqlInterval(period: string): string {
    switch (period) {
      case '24h': return '24 hours';
      case '7d': return '7 days';
      case '30d': return '30 days';
      case '1y': return '1 year';
      default: return '24 hours';
    }
  }
}
