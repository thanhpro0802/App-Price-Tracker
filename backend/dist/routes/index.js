"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AssetController_1 = require("../controllers/AssetController");
const PriceController_1 = require("../controllers/PriceController");
const WatchlistController_1 = require("../controllers/WatchlistController");
const AlertController_1 = require("../controllers/AlertController");
const NotificationController_1 = require("../controllers/NotificationController");
const DashboardController_1 = require("../controllers/DashboardController");
const router = (0, express_1.Router)();
const assetController = new AssetController_1.AssetController();
const priceController = new PriceController_1.PriceController();
const watchlistController = new WatchlistController_1.WatchlistController();
const alertController = new AlertController_1.AlertController();
const notificationController = new NotificationController_1.NotificationController();
const dashboardController = new DashboardController_1.DashboardController();
// Asset routes
router.get('/assets/search', (req, res) => assetController.search(req, res));
router.get('/assets/:id', (req, res) => assetController.getById(req, res));
router.get('/assets', (req, res) => assetController.getAll(req, res));
// Price routes
router.get('/prices/:assetId/latest', (req, res) => priceController.getLatest(req, res));
router.get('/prices/:assetId/history', (req, res) => priceController.getHistory(req, res));
router.get('/prices/:assetId/prediction', (req, res) => priceController.getPrediction(req, res));
// Watchlist routes
router.get('/watchlist', (req, res) => watchlistController.getWatchlist(req, res));
router.post('/watchlist', (req, res) => watchlistController.addItem(req, res));
router.delete('/watchlist/:assetId', (req, res) => watchlistController.removeItem(req, res));
router.patch('/watchlist/:assetId/pin', (req, res) => watchlistController.togglePin(req, res));
// Alert routes
router.get('/alerts', (req, res) => alertController.getAlerts(req, res));
router.post('/alerts', (req, res) => alertController.createAlert(req, res));
router.delete('/alerts/:id', (req, res) => alertController.deleteAlert(req, res));
// Notification routes
router.get('/notifications', (req, res) => notificationController.getNotifications(req, res));
router.patch('/notifications/:id/read', (req, res) => notificationController.markRead(req, res));
// Dashboard routes
router.get('/dashboard', (req, res) => dashboardController.getDashboard(req, res));
exports.default = router;
//# sourceMappingURL=index.js.map