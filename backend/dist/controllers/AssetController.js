"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetController = void 0;
const AssetService_1 = require("../services/AssetService");
const assetService = new AssetService_1.AssetService();
class AssetController {
    async getAll(req, res) {
        try {
            const { category } = req.query;
            let assets;
            if (category && typeof category === 'string') {
                assets = await assetService.getAssetsByCategory(category);
            }
            else {
                assets = await assetService.getAllAssets();
            }
            res.json(assets);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to fetch assets' });
        }
    }
    async getById(req, res) {
        try {
            const id = parseInt(String(req.params.id), 10);
            const asset = await assetService.getAssetById(id);
            if (!asset) {
                res.status(404).json({ error: 'Asset not found' });
                return;
            }
            res.json(asset);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to fetch asset' });
        }
    }
    async search(req, res) {
        try {
            const q = req.query.q;
            if (!q) {
                res.status(400).json({ error: 'Search query required' });
                return;
            }
            const assets = await assetService.searchAssets(q);
            res.json(assets);
        }
        catch (error) {
            res.status(500).json({ error: 'Search failed' });
        }
    }
}
exports.AssetController = AssetController;
//# sourceMappingURL=AssetController.js.map