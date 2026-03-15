import { query, isDatabaseAvailable } from '../config/database';
import { store } from '../config/inMemoryStore';
import { Alert } from '../models';

export class AlertRepository {
  async getUserAlerts(userId: number): Promise<Alert[]> {
    if (!isDatabaseAvailable()) {
      return store.alerts.filter(a => a.user_id === userId);
    }
    const result = await query(
      'SELECT * FROM alerts WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    return result.rows;
  }

  async createAlert(data: {
    user_id: number;
    asset_id: number;
    condition: 'above' | 'below';
    target_price: number;
  }): Promise<Alert> {
    if (!isDatabaseAvailable()) {
      const alert: Alert = {
        id: store.getNextId('alerts'),
        user_id: data.user_id,
        asset_id: data.asset_id,
        condition: data.condition,
        target_price: data.target_price,
        triggered: false,
        created_at: new Date(),
      };
      store.alerts.push(alert);
      return alert;
    }
    const result = await query(
      'INSERT INTO alerts (user_id, asset_id, condition, target_price) VALUES ($1, $2, $3, $4) RETURNING *',
      [data.user_id, data.asset_id, data.condition, data.target_price]
    );
    return result.rows[0];
  }

  async deleteAlert(id: number): Promise<void> {
    if (!isDatabaseAvailable()) {
      store.alerts = store.alerts.filter(a => a.id !== id);
      return;
    }
    await query('DELETE FROM alerts WHERE id = $1', [id]);
  }

  async getActiveAlerts(): Promise<Alert[]> {
    if (!isDatabaseAvailable()) {
      return store.alerts.filter(a => !a.triggered);
    }
    const result = await query('SELECT * FROM alerts WHERE triggered = FALSE');
    return result.rows;
  }

  async markTriggered(id: number): Promise<void> {
    if (!isDatabaseAvailable()) {
      const alert = store.alerts.find(a => a.id === id);
      if (alert) alert.triggered = true;
      return;
    }
    await query('UPDATE alerts SET triggered = TRUE WHERE id = $1', [id]);
  }
}
