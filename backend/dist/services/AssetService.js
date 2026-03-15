"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetService = void 0;
const AssetRepository_1 = require("../repositories/AssetRepository");
const assetRepository = new AssetRepository_1.AssetRepository();
class AssetService {
    async getAllAssets() {
        return assetRepository.findAll();
    }
    async getAssetById(id) {
        return assetRepository.findById(id);
    }
    async getAssetsByCategory(category) {
        return assetRepository.findByCategory(category);
    }
    async searchAssets(searchQuery) {
        return assetRepository.search(searchQuery);
    }
}
exports.AssetService = AssetService;
//# sourceMappingURL=AssetService.js.map