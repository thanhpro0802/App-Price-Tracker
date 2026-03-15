"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertController = void 0;
const AlertService_1 = require("../services/AlertService");
const alertService = new AlertService_1.AlertService();
const DEMO_USER_ID = 1;
class AlertController {
    async getAlerts(req, res) {
        try {
            const userId = DEMO_USER_ID;
            const alerts = await alertService.getUserAlerts(userId);
            res.json(alerts);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to fetch alerts' });
        }
    }
    async createAlert(req, res) {
        try {
            const userId = DEMO_USER_ID;
            const { asset_id, condition, target_price } = req.body;
            if (!asset_id || !condition || target_price === undefined) {
                res.status(400).json({ error: 'asset_id, condition, and target_price are required' });
                return;
            }
            if (condition !== 'above' && condition !== 'below') {
                res.status(400).json({ error: 'condition must be "above" or "below"' });
                return;
            }
            const alert = await alertService.createAlert({
                user_id: userId,
                asset_id,
                condition,
                target_price,
            });
            res.status(201).json(alert);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to create alert' });
        }
    }
    async deleteAlert(req, res) {
        try {
            const id = parseInt(String(req.params.id), 10);
            await alertService.deleteAlert(id);
            res.json({ message: 'Alert deleted' });
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to delete alert' });
        }
    }
}
exports.AlertController = AlertController;
//# sourceMappingURL=AlertController.js.map