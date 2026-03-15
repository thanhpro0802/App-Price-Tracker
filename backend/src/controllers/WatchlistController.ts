import { Request, Response } from 'express';
import { WatchlistService } from '../services/WatchlistService';

const watchlistService = new WatchlistService();
const DEMO_USER_ID = 1;

export class WatchlistController {
  async getWatchlist(req: Request, res: Response): Promise<void> {
    try {
      const userId = DEMO_USER_ID;
      const watchlist = await watchlistService.getUserWatchlist(userId);
      res.json(watchlist);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch watchlist' });
    }
  }

  async addItem(req: Request, res: Response): Promise<void> {
    try {
      const userId = DEMO_USER_ID;
      const { asset_id } = req.body;
      if (!asset_id) {
        res.status(400).json({ error: 'asset_id is required' });
        return;
      }
      const item = await watchlistService.addToWatchlist(userId, asset_id);
      res.status(201).json(item);
    } catch (error) {
      res.status(500).json({ error: 'Failed to add to watchlist' });
    }
  }

  async removeItem(req: Request, res: Response): Promise<void> {
    try {
      const userId = DEMO_USER_ID;
      const assetId = parseInt(String(req.params.assetId), 10);
      await watchlistService.removeFromWatchlist(userId, assetId);
      res.json({ message: 'Removed from watchlist' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to remove from watchlist' });
    }
  }

  async togglePin(req: Request, res: Response): Promise<void> {
    try {
      const userId = DEMO_USER_ID;
      const assetId = parseInt(String(req.params.assetId), 10);
      const item = await watchlistService.togglePin(userId, assetId);
      if (!item) {
        res.status(404).json({ error: 'Watchlist item not found' });
        return;
      }
      res.json(item);
    } catch (error) {
      res.status(500).json({ error: 'Failed to toggle pin' });
    }
  }
}
