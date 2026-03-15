import { query, isDatabaseAvailable } from '../config/database';
import { store } from '../config/inMemoryStore';
import { WatchlistItem } from '../models';

export class WatchlistRepository {
  async getUserWatchlist(userId: number): Promise<WatchlistItem[]> {
    if (!isDatabaseAvailable()) {
      return store.watchlist.filter(w => w.user_id === userId);
    }
    const result = await query(
      'SELECT * FROM watchlist WHERE user_id = $1 ORDER BY pinned DESC, created_at DESC',
      [userId]
    );
    return result.rows;
  }

  async addItem(userId: number, assetId: number): Promise<WatchlistItem> {
    if (!isDatabaseAvailable()) {
      const existing = store.watchlist.find(w => w.user_id === userId && w.asset_id === assetId);
      if (existing) return existing;
      const item: WatchlistItem = {
        id: store.getNextId('watchlist'),
        user_id: userId,
        asset_id: assetId,
        pinned: false,
        created_at: new Date(),
      };
      store.watchlist.push(item);
      return item;
    }
    const result = await query(
      'INSERT INTO watchlist (user_id, asset_id) VALUES ($1, $2) ON CONFLICT (user_id, asset_id) DO NOTHING RETURNING *',
      [userId, assetId]
    );
    if (result.rows.length === 0) {
      const existing = await query(
        'SELECT * FROM watchlist WHERE user_id = $1 AND asset_id = $2',
        [userId, assetId]
      );
      return existing.rows[0];
    }
    return result.rows[0];
  }

  async removeItem(userId: number, assetId: number): Promise<void> {
    if (!isDatabaseAvailable()) {
      store.watchlist = store.watchlist.filter(
        w => !(w.user_id === userId && w.asset_id === assetId)
      );
      return;
    }
    await query('DELETE FROM watchlist WHERE user_id = $1 AND asset_id = $2', [userId, assetId]);
  }

  async togglePin(userId: number, assetId: number): Promise<WatchlistItem | null> {
    if (!isDatabaseAvailable()) {
      const item = store.watchlist.find(w => w.user_id === userId && w.asset_id === assetId);
      if (!item) return null;
      item.pinned = !item.pinned;
      return item;
    }
    const result = await query(
      'UPDATE watchlist SET pinned = NOT pinned WHERE user_id = $1 AND asset_id = $2 RETURNING *',
      [userId, assetId]
    );
    return result.rows[0] ?? null;
  }
}
