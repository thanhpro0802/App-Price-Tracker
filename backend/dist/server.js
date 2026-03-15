"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app_1 = __importDefault(require("./app"));
const database_1 = require("./config/database");
const priceScheduler_1 = require("./scheduler/priceScheduler");
const PriceUpdateService_1 = require("./services/PriceUpdateService");
const PORT = process.env.PORT || 5000;
async function main() {
    // Check database availability
    await (0, database_1.checkDatabaseConnection)();
    // Seed historical data and run initial price update
    const priceUpdateService = new PriceUpdateService_1.PriceUpdateService();
    await priceUpdateService.seedHistoricalPrices();
    await priceUpdateService.updateAllPrices();
    // Start the scheduler
    (0, priceScheduler_1.startPriceScheduler)();
    // Start the server
    app_1.default.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`API available at http://localhost:${PORT}/api`);
    });
}
main().catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
});
//# sourceMappingURL=server.js.map