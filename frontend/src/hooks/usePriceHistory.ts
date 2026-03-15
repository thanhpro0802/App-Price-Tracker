import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import type { Price, TimePeriod } from '../types';

export function usePriceHistory(assetId: number | undefined, period: TimePeriod) {
  const [prices, setPrices] = useState<Price[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    if (!assetId) return;
    try {
      setLoading(true);
      const data = await api.getPriceHistory(assetId, period);
      setPrices(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch price history');
    } finally {
      setLoading(false);
    }
  }, [assetId, period]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return { prices, loading, error, refetch: fetchHistory };
}
