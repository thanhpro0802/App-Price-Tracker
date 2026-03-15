import { Router } from 'express';
import { AssetController } from '../controllers/AssetController';
import { PriceController } from '../controllers/PriceController';
import { WatchlistController } from '../controllers/WatchlistController';
import { AlertController } from '../controllers/AlertController';
import { NotificationController } from '../controllers/NotificationController';
import { DashboardController } from '../controllers/DashboardController';

const router = Router();

const assetController = new AssetController();
const priceController = new PriceController();
const watchlistController = new WatchlistController();
const alertController = new AlertController();
const notificationController = new NotificationController();
const dashboardController = new DashboardController();

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

export default router;
