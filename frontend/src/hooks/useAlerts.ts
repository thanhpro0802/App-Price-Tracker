import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import type { Alert } from '../types';

export function useAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAlerts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.getAlerts();
      setAlerts(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch alerts');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const createAlert = useCallback(async (data: { asset_id: number; condition: 'above' | 'below'; target_price: number }) => {
    try {
      await api.createAlert(data);
      await fetchAlerts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create alert');
    }
  }, [fetchAlerts]);

  const deleteAlert = useCallback(async (id: number) => {
    try {
      await api.deleteAlert(id);
      await fetchAlerts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete alert');
    }
  }, [fetchAlerts]);

  return { alerts, loading, error, createAlert, deleteAlert, refetch: fetchAlerts };
}
