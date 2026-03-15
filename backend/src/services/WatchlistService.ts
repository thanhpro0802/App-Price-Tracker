import { WatchlistRepository } from '../repositories/WatchlistRepository';
import { WatchlistItem } from '../models';

const watchlistRepository = new WatchlistRepository();

export class WatchlistService {
  async getUserWatchlist(userId: number): Promise<WatchlistItem[]> {
    return watchlistRepository.getUserWatchlist(userId);
  }

  async addToWatchlist(userId: number, assetId: number): Promise<WatchlistItem> {
    return watchlistRepository.addItem(userId, assetId);
  }

  async removeFromWatchlist(userId: number, assetId: number): Promise<void> {
    return watchlistRepository.removeItem(userId, assetId);
  }

  async togglePin(userId: number, assetId: number): Promise<WatchlistItem | null> {
    return watchlistRepository.togglePin(userId, assetId);
  }
}
