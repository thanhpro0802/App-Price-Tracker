import { Request, Response } from 'express';
import { PriceService } from '../services/PriceService';
import { WatchlistService } from '../services/WatchlistService';
import { DashboardStats } from '../models';

const priceService = new PriceService();
const watchlistService = new WatchlistService();
const DEMO_USER_ID = 1;

export class DashboardController {
  async getDashboard(_req: Request, res: Response): Promise<void> {
    try {
      const watchlist = await watchlistService.getUserWatchlist(DEMO_USER_ID);
      const pricesWithChange = await priceService.getAllPricesWithChange();

      // Filter to only tracked (watchlisted) assets if any, otherwise show all
      const tracked =
        watchlist.length > 0
          ? pricesWithChange.filter(p => watchlist.some(w => w.asset_id === p.asset.id))
          : pricesWithChange;

      let biggestIncrease: DashboardStats['biggestIncrease'] = null;
      let biggestDrop: DashboardStats['biggestDrop'] = null;

      for (const item of tracked) {
        if (item.changePercent === null) continue;

        if (!biggestIncrease || item.changePercent > (biggestIncrease.changePercent ?? -Infinity)) {
          biggestIncrease = { asset: item.asset, changePercent: item.changePercent };
        }
        if (!biggestDrop || item.changePercent < (biggestDrop.changePercent ?? Infinity)) {
          biggestDrop = { asset: item.asset, changePercent: item.changePercent };
        }
      }

      const stats: DashboardStats = {
        totalTracked: watchlist.length,
        biggestIncrease,
        biggestDrop,
      };

      res.json({
        stats,
        prices: tracked,
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
  }
}
