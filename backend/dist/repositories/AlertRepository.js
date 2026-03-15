"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertRepository = void 0;
const database_1 = require("../config/database");
const inMemoryStore_1 = require("../config/inMemoryStore");
class AlertRepository {
    async getUserAlerts(userId) {
        if (!(0, database_1.isDatabaseAvailable)()) {
            return inMemoryStore_1.store.alerts.filter(a => a.user_id === userId);
        }
        const result = await (0, database_1.query)('SELECT * FROM alerts WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
        return result.rows;
    }
    async createAlert(data) {
        if (!(0, database_1.isDatabaseAvailable)()) {
            const alert = {
                id: inMemoryStore_1.store.getNextId('alerts'),
                user_id: data.user_id,
                asset_id: data.asset_id,
                condition: data.condition,
                target_price: data.target_price,
                triggered: false,
                created_at: new Date(),
            };
            inMemoryStore_1.store.alerts.push(alert);
            return alert;
        }
        const result = await (0, database_1.query)('INSERT INTO alerts (user_id, asset_id, condition, target_price) VALUES ($1, $2, $3, $4) RETURNING *', [data.user_id, data.asset_id, data.condition, data.target_price]);
        return result.rows[0];
    }
    async deleteAlert(id) {
        if (!(0, database_1.isDatabaseAvailable)()) {
            inMemoryStore_1.store.alerts = inMemoryStore_1.store.alerts.filter(a => a.id !== id);
            return;
        }
        await (0, database_1.query)('DELETE FROM alerts WHERE id = $1', [id]);
    }
    async getActiveAlerts() {
        if (!(0, database_1.isDatabaseAvailable)()) {
            return inMemoryStore_1.store.alerts.filter(a => !a.triggered);
        }
        const result = await (0, database_1.query)('SELECT * FROM alerts WHERE triggered = FALSE');
        return result.rows;
    }
    async markTriggered(id) {
        if (!(0, database_1.isDatabaseAvailable)()) {
            const alert = inMemoryStore_1.store.alerts.find(a => a.id === id);
            if (alert)
                alert.triggered = true;
            return;
        }
        await (0, database_1.query)('UPDATE alerts SET triggered = TRUE WHERE id = $1', [id]);
    }
}
exports.AlertRepository = AlertRepository;
//# sourceMappingURL=AlertRepository.js.map