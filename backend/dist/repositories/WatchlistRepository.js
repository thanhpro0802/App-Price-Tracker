"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WatchlistRepository = void 0;
const database_1 = require("../config/database");
const inMemoryStore_1 = require("../config/inMemoryStore");
class WatchlistRepository {
    async getUserWatchlist(userId) {
        if (!(0, database_1.isDatabaseAvailable)()) {
            return inMemoryStore_1.store.watchlist.filter(w => w.user_id === userId);
        }
        const result = await (0, database_1.query)('SELECT * FROM watchlist WHERE user_id = $1 ORDER BY pinned DESC, created_at DESC', [userId]);
        return result.rows;
    }
    async addItem(userId, assetId) {
        if (!(0, database_1.isDatabaseAvailable)()) {
            const existing = inMemoryStore_1.store.watchlist.find(w => w.user_id === userId && w.asset_id === assetId);
            if (existing)
                return existing;
            const item = {
                id: inMemoryStore_1.store.getNextId('watchlist'),
                user_id: userId,
                asset_id: assetId,
                pinned: false,
                created_at: new Date(),
            };
            inMemoryStore_1.store.watchlist.push(item);
            return item;
        }
        const result = await (0, database_1.query)('INSERT INTO watchlist (user_id, asset_id) VALUES ($1, $2) ON CONFLICT (user_id, asset_id) DO NOTHING RETURNING *', [userId, assetId]);
        if (result.rows.length === 0) {
            const existing = await (0, database_1.query)('SELECT * FROM watchlist WHERE user_id = $1 AND asset_id = $2', [userId, assetId]);
            return existing.rows[0];
        }
        return result.rows[0];
    }
    async removeItem(userId, assetId) {
        if (!(0, database_1.isDatabaseAvailable)()) {
            inMemoryStore_1.store.watchlist = inMemoryStore_1.store.watchlist.filter(w => !(w.user_id === userId && w.asset_id === assetId));
            return;
        }
        await (0, database_1.query)('DELETE FROM watchlist WHERE user_id = $1 AND asset_id = $2', [userId, assetId]);
    }
    async togglePin(userId, assetId) {
        if (!(0, database_1.isDatabaseAvailable)()) {
            const item = inMemoryStore_1.store.watchlist.find(w => w.user_id === userId && w.asset_id === assetId);
            if (!item)
                return null;
            item.pinned = !item.pinned;
            return item;
        }
        const result = await (0, database_1.query)('UPDATE watchlist SET pinned = NOT pinned WHERE user_id = $1 AND asset_id = $2 RETURNING *', [userId, assetId]);
        return result.rows[0] ?? null;
    }
}
exports.WatchlistRepository = WatchlistRepository;
//# sourceMappingURL=WatchlistRepository.js.map