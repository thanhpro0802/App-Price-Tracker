"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WatchlistService = void 0;
const WatchlistRepository_1 = require("../repositories/WatchlistRepository");
const watchlistRepository = new WatchlistRepository_1.WatchlistRepository();
class WatchlistService {
    async getUserWatchlist(userId) {
        return watchlistRepository.getUserWatchlist(userId);
    }
    async addToWatchlist(userId, assetId) {
        return watchlistRepository.addItem(userId, assetId);
    }
    async removeFromWatchlist(userId, assetId) {
        return watchlistRepository.removeItem(userId, assetId);
    }
    async togglePin(userId, assetId) {
        return watchlistRepository.togglePin(userId, assetId);
    }
}
exports.WatchlistService = WatchlistService;
//# sourceMappingURL=WatchlistService.js.map