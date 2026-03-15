"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PredictionService = void 0;
const PriceRepository_1 = require("../repositories/PriceRepository");
const priceRepository = new PriceRepository_1.PriceRepository();
class PredictionService {
    async predictPrice(assetId, period = '24h') {
        const history = await priceRepository.getPriceHistory(assetId, period);
        if (history.length < 2) {
            return null;
        }
        const prices = history.map(p => Number(p.price));
        const n = prices.length;
        // Simple linear regression: y = mx + b
        const xValues = Array.from({ length: n }, (_, i) => i);
        const yValues = prices;
        const sumX = xValues.reduce((a, b) => a + b, 0);
        const sumY = yValues.reduce((a, b) => a + b, 0);
        const sumXY = xValues.reduce((acc, x, i) => acc + x * yValues[i], 0);
        const sumX2 = xValues.reduce((acc, x) => acc + x * x, 0);
        const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;
        // Predict next point
        const predictedPrice = slope * n + intercept;
        const currentPrice = prices[prices.length - 1];
        // Calculate R-squared for confidence
        const meanY = sumY / n;
        const ssTotal = yValues.reduce((acc, y) => acc + (y - meanY) ** 2, 0);
        const ssResidual = yValues.reduce((acc, y, i) => acc + (y - (slope * xValues[i] + intercept)) ** 2, 0);
        const rSquared = ssTotal === 0 ? 0 : 1 - ssResidual / ssTotal;
        const confidence = Math.max(0, Math.min(100, rSquared * 100));
        const predictedChange = predictedPrice - currentPrice;
        const predictedChangePercent = currentPrice !== 0 ? (predictedChange / currentPrice) * 100 : 0;
        let direction = 'stable';
        if (predictedChangePercent > 0.1)
            direction = 'up';
        else if (predictedChangePercent < -0.1)
            direction = 'down';
        return {
            currentPrice: Number(currentPrice.toFixed(8)),
            predictedPrice: Number(predictedPrice.toFixed(8)),
            confidence: Number(confidence.toFixed(2)),
            direction,
            predictedChange: Number(predictedChange.toFixed(8)),
            predictedChangePercent: Number(predictedChangePercent.toFixed(4)),
        };
    }
}
exports.PredictionService = PredictionService;
//# sourceMappingURL=PredictionService.js.map