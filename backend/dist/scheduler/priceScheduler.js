"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startPriceScheduler = startPriceScheduler;
const node_cron_1 = __importDefault(require("node-cron"));
const PriceUpdateService_1 = require("../services/PriceUpdateService");
const AlertService_1 = require("../services/AlertService");
const priceUpdateService = new PriceUpdateService_1.PriceUpdateService();
const alertService = new AlertService_1.AlertService();
function startPriceScheduler() {
    // Run price updates every 5 minutes
    node_cron_1.default.schedule('*/5 * * * *', async () => {
        try {
            await priceUpdateService.updateAllPrices();
            await alertService.checkAlerts();
        }
        catch (error) {
            console.error('Scheduled price update failed:', error);
        }
    });
    console.log('Price scheduler started (every 5 minutes)');
}
//# sourceMappingURL=priceScheduler.js.map