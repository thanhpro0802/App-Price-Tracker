"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PriceService = void 0;
const PriceRepository_1 = require("../repositories/PriceRepository");
const AssetRepository_1 = require("../repositories/AssetRepository");
const priceRepository = new PriceRepository_1.PriceRepository();
const assetRepository = new AssetRepository_1.AssetRepository();
class PriceService {
    async getLatestPrice(assetId) {
        return priceRepository.getLatestPrice(assetId);
    }
    async getPriceHistory(assetId, period) {
        return priceRepository.getPriceHistory(assetId, period);
    }
    async insertPrice(assetId, price) {
        return priceRepository.insertPrice(assetId, price);
    }
    async getAllPricesWithChange() {
        const assets = await assetRepository.findAll();
        const latestPrices = await priceRepository.getLatestPrices();
        const previousPrices = await priceRepository.getPreviousPrices(24);
        const latestMap = new Map();
        for (const p of latestPrices) {
            latestMap.set(p.asset_id, Number(p.price));
        }
        const prevMap = new Map();
        for (const p of previousPrices) {
            prevMap.set(p.asset_id, Number(p.price));
        }
        return assets.map(asset => {
            const currentPrice = latestMap.get(asset.id) ?? 0;
            const previousPrice = prevMap.get(asset.id) ?? null;
            let change = null;
            let changePercent = null;
            if (previousPrice !== null && previousPrice !== 0) {
                change = currentPrice - previousPrice;
                changePercent = (change / previousPrice) * 100;
            }
            return { asset, currentPrice, previousPrice, change, changePercent };
        });
    }
}
exports.PriceService = PriceService;
//# sourceMappingURL=PriceService.js.map