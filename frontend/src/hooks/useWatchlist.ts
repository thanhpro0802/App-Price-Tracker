import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import type { WatchlistItem } from '../types';

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWatchlist = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.getWatchlist();
      setWatchlist(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch watchlist');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWatchlist();
  }, [fetchWatchlist]);

  const addToWatchlist = useCallback(async (assetId: number) => {
    try {
      await api.addToWatchlist(assetId);
      await fetchWatchlist();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add to watchlist');
    }
  }, [fetchWatchlist]);

  const removeFromWatchlist = useCallback(async (assetId: number) => {
    try {
      await api.removeFromWatchlist(assetId);
      await fetchWatchlist();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove from watchlist');
    }
  }, [fetchWatchlist]);

  const togglePin = useCallback(async (assetId: number) => {
    try {
      await api.togglePin(assetId);
      await fetchWatchlist();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle pin');
    }
  }, [fetchWatchlist]);

  const isInWatchlist = useCallback(
    (assetId: number) => watchlist.some(w => w.asset_id === assetId),
    [watchlist]
  );

  return { watchlist, loading, error, addToWatchlist, removeFromWatchlist, togglePin, isInWatchlist, refetch: fetchWatchlist };
}
