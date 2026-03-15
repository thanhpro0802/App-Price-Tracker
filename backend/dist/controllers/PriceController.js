"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PriceController = void 0;
const PriceService_1 = require("../services/PriceService");
const PredictionService_1 = require("../services/PredictionService");
const priceService = new PriceService_1.PriceService();
const predictionService = new PredictionService_1.PredictionService();
class PriceController {
    async getLatest(req, res) {
        try {
            const assetId = parseInt(String(req.params.assetId), 10);
            const price = await priceService.getLatestPrice(assetId);
            if (!price) {
                res.status(404).json({ error: 'No price data found' });
                return;
            }
            res.json(price);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to fetch latest price' });
        }
    }
    async getHistory(req, res) {
        try {
            const assetId = parseInt(String(req.params.assetId), 10);
            const period = req.query.period || '24h';
            const history = await priceService.getPriceHistory(assetId, period);
            res.json(history);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to fetch price history' });
        }
    }
    async getPrediction(req, res) {
        try {
            const assetId = parseInt(String(req.params.assetId), 10);
            const period = req.query.period || '24h';
            const prediction = await predictionService.predictPrice(assetId, period);
            if (!prediction) {
                res.status(404).json({ error: 'Not enough data for prediction' });
                return;
            }
            res.json(prediction);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to generate prediction' });
        }
    }
}
exports.PriceController = PriceController;
//# sourceMappingURL=PriceController.js.map