"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertService = void 0;
const AlertRepository_1 = require("../repositories/AlertRepository");
const NotificationRepository_1 = require("../repositories/NotificationRepository");
const PriceRepository_1 = require("../repositories/PriceRepository");
const AssetRepository_1 = require("../repositories/AssetRepository");
const alertRepository = new AlertRepository_1.AlertRepository();
const notificationRepository = new NotificationRepository_1.NotificationRepository();
const priceRepository = new PriceRepository_1.PriceRepository();
const assetRepository = new AssetRepository_1.AssetRepository();
class AlertService {
    async getUserAlerts(userId) {
        return alertRepository.getUserAlerts(userId);
    }
    async createAlert(data) {
        return alertRepository.createAlert(data);
    }
    async deleteAlert(id) {
        return alertRepository.deleteAlert(id);
    }
    async checkAlerts() {
        const activeAlerts = await alertRepository.getActiveAlerts();
        for (const alert of activeAlerts) {
            const latestPrice = await priceRepository.getLatestPrice(alert.asset_id);
            if (!latestPrice)
                continue;
            const currentPrice = Number(latestPrice.price);
            const targetPrice = Number(alert.target_price);
            let triggered = false;
            if (alert.condition === 'above' && currentPrice >= targetPrice) {
                triggered = true;
            }
            else if (alert.condition === 'below' && currentPrice <= targetPrice) {
                triggered = true;
            }
            if (triggered) {
                await alertRepository.markTriggered(alert.id);
                const asset = await assetRepository.findById(alert.asset_id);
                const assetName = asset?.name ?? `Asset #${alert.asset_id}`;
                const message = `${assetName} price is now ${currentPrice}, which is ${alert.condition} your target of ${targetPrice}`;
                await notificationRepository.create({
                    user_id: alert.user_id,
                    alert_id: alert.id,
                    message,
                });
            }
        }
    }
}
exports.AlertService = AlertService;
//# sourceMappingURL=AlertService.js.map