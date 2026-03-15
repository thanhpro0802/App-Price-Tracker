"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PriceRepository = void 0;
const database_1 = require("../config/database");
const inMemoryStore_1 = require("../config/inMemoryStore");
class PriceRepository {
    async getLatestPrice(assetId) {
        if (!(0, database_1.isDatabaseAvailable)()) {
            const prices = inMemoryStore_1.store.prices
                .filter(p => p.asset_id === assetId)
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
            return prices[0] ?? null;
        }
        const result = await (0, database_1.query)('SELECT * FROM prices WHERE asset_id = $1 ORDER BY timestamp DESC LIMIT 1', [assetId]);
        return result.rows[0] ?? null;
    }
    async getPriceHistory(assetId, period) {
        const interval = this.periodToInterval(period);
        if (!(0, database_1.isDatabaseAvailable)()) {
            const cutoff = new Date(Date.now() - interval);
            return inMemoryStore_1.store.prices
                .filter(p => p.asset_id === assetId && new Date(p.timestamp) >= cutoff)
                .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        }
        const result = await (0, database_1.query)(`SELECT * FROM prices WHERE asset_id = $1 AND timestamp >= NOW() - INTERVAL '${this.periodToSqlInterval(period)}' ORDER BY timestamp ASC`, [assetId]);
        return result.rows;
    }
    async insertPrice(assetId, price) {
        if (!(0, database_1.isDatabaseAvailable)()) {
            const newPrice = {
                id: inMemoryStore_1.store.getNextId('prices'),
                asset_id: assetId,
                price,
                timestamp: new Date(),
            };
            inMemoryStore_1.store.prices.push(newPrice);
            return newPrice;
        }
        const result = await (0, database_1.query)('INSERT INTO prices (asset_id, price) VALUES ($1, $2) RETURNING *', [assetId, price]);
        return result.rows[0];
    }
    async getLatestPrices() {
        if (!(0, database_1.isDatabaseAvailable)()) {
            const latestMap = new Map();
            for (const p of inMemoryStore_1.store.prices) {
                const existing = latestMap.get(p.asset_id);
                if (!existing || new Date(p.timestamp).getTime() > new Date(existing.timestamp).getTime()) {
                    latestMap.set(p.asset_id, p);
                }
            }
            return Array.from(latestMap.values());
        }
        const result = await (0, database_1.query)(`SELECT DISTINCT ON (asset_id) * FROM prices ORDER BY asset_id, timestamp DESC`);
        return result.rows;
    }
    async getPreviousPrices(hoursAgo) {
        if (!(0, database_1.isDatabaseAvailable)()) {
            const cutoff = new Date(Date.now() - hoursAgo * 60 * 60 * 1000);
            const targetMap = new Map();
            for (const p of inMemoryStore_1.store.prices) {
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
        const result = await (0, database_1.query)(`SELECT DISTINCT ON (asset_id) * FROM prices
       WHERE timestamp <= NOW() - INTERVAL '${hoursAgo} hours'
       ORDER BY asset_id, timestamp DESC`);
        return result.rows;
    }
    periodToInterval(period) {
        switch (period) {
            case '24h': return 24 * 60 * 60 * 1000;
            case '7d': return 7 * 24 * 60 * 60 * 1000;
            case '30d': return 30 * 24 * 60 * 60 * 1000;
            case '1y': return 365 * 24 * 60 * 60 * 1000;
            default: return 24 * 60 * 60 * 1000;
        }
    }
    periodToSqlInterval(period) {
        switch (period) {
            case '24h': return '24 hours';
            case '7d': return '7 days';
            case '30d': return '30 days';
            case '1y': return '1 year';
            default: return '24 hours';
        }
    }
}
exports.PriceRepository = PriceRepository;
//# sourceMappingURL=PriceRepository.js.map