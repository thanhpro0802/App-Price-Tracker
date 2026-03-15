"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardController = void 0;
const PriceService_1 = require("../services/PriceService");
const WatchlistService_1 = require("../services/WatchlistService");
const priceService = new PriceService_1.PriceService();
const watchlistService = new WatchlistService_1.WatchlistService();
const DEMO_USER_ID = 1;
class DashboardController {
    async getDashboard(_req, res) {
        try {
            const watchlist = await watchlistService.getUserWatchlist(DEMO_USER_ID);
            const pricesWithChange = await priceService.getAllPricesWithChange();
            // Filter to only tracked (watchlisted) assets if any, otherwise show all
            const tracked = watchlist.length > 0
                ? pricesWithChange.filter(p => watchlist.some(w => w.asset_id === p.asset.id))
                : pricesWithChange;
            let biggestIncrease = null;
            let biggestDrop = null;
            for (const item of tracked) {
                if (item.changePercent === null)
                    continue;
                if (!biggestIncrease || item.changePercent > (biggestIncrease.changePercent ?? -Infinity)) {
                    biggestIncrease = { asset: item.asset, changePercent: item.changePercent };
                }
                if (!biggestDrop || item.changePercent < (biggestDrop.changePercent ?? Infinity)) {
                    biggestDrop = { asset: item.asset, changePercent: item.changePercent };
                }
            }
            const stats = {
                totalTracked: watchlist.length,
                biggestIncrease,
                biggestDrop,
            };
            res.json({
                stats,
                prices: tracked,
            });
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to fetch dashboard data' });
        }
    }
}
exports.DashboardController = DashboardController;
//# sourceMappingURL=DashboardController.js.map