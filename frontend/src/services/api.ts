import axios from 'axios';
import type { Asset, Price, WatchlistItem, Alert, Notification, DashboardStats, TimePeriod } from '../types';
import { mockApi } from './mockData';

const client = axios.create({
  baseURL: '/api',
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' },
});

let useMock = false;

async function tryApi<T>(apiFn: () => Promise<T>, mockFn: () => Promise<T>): Promise<T> {
  if (useMock) return mockFn();
  try {
    return await apiFn();
  } catch {
    useMock = true;
    console.info('[API] Backend unavailable — using demo data');
    return mockFn();
  }
}

export const api = {
  getAssets: (): Promise<Asset[]> =>
    tryApi(
      async () => {
        const assets = (await client.get<Asset[]>('/assets')).data;
        // Enrich assets with current prices from dashboard
        try {
          const dashboard = (await client.get('/dashboard')).data;
          const prices: Array<{ asset: Asset; currentPrice: number; changePercent: number }> = dashboard.prices ?? [];
          const priceMap = new Map(prices.map(p => [p.asset.id, p]));
          return assets.map(a => {
            const pd = priceMap.get(a.id);
            if (pd) {
              return { ...a, current_price: pd.currentPrice, price_change_percent: pd.changePercent, last_updated: new Date().toISOString() };
            }
            return a;
          });
        } catch {
          return assets;
        }
      },
      mockApi.getAssets
    ),

  getAsset: (id: number): Promise<Asset> =>
    tryApi(
      async () => {
        const asset = (await client.get<Asset>(`/assets/${id}`)).data;
        try {
          const price = (await client.get(`/prices/${id}/latest`)).data;
          return { ...asset, current_price: price.price, last_updated: price.timestamp };
        } catch {
          return asset;
        }
      },
      () => mockApi.getAsset(id)
    ),

  searchAssets: (query: string): Promise<Asset[]> =>
    tryApi(
      async () => (await client.get<Asset[]>('/assets/search', { params: { q: query } })).data,
      () => mockApi.searchAssets(query)
    ),

  getLatestPrice: (assetId: number): Promise<Price> =>
    tryApi(
      async () => (await client.get<Price>(`/prices/${assetId}/latest`)).data,
      () => mockApi.getLatestPrice(assetId)
    ),

  getPriceHistory: (assetId: number, period: TimePeriod): Promise<Price[]> =>
    tryApi(
      async () => (await client.get<Price[]>(`/prices/${assetId}/history`, { params: { period } })).data,
      () => mockApi.getPriceHistory(assetId, period)
    ),

  getWatchlist: (): Promise<WatchlistItem[]> =>
    tryApi(
      async () => {
        const items = (await client.get<WatchlistItem[]>('/watchlist')).data;
        // Enrich watchlist items with asset data
        const enriched = await Promise.all(
          items.map(async (item) => {
            if (item.asset) return item;
            try {
              const asset = (await client.get<Asset>(`/assets/${item.asset_id}`)).data;
              const price = (await client.get(`/prices/${item.asset_id}/latest`)).data;
              return { ...item, asset: { ...asset, current_price: price.price, last_updated: price.timestamp } };
            } catch {
              return item;
            }
          })
        );
        return enriched;
      },
      mockApi.getWatchlist
    ),

  addToWatchlist: (assetId: number): Promise<WatchlistItem> =>
    tryApi(
      async () => (await client.post<WatchlistItem>('/watchlist', { asset_id: assetId })).data,
      () => mockApi.addToWatchlist(assetId)
    ),

  removeFromWatchlist: (assetId: number): Promise<void> =>
    tryApi(
      async () => { await client.delete(`/watchlist/${assetId}`); },
      () => mockApi.removeFromWatchlist(assetId)
    ),

  togglePin: (assetId: number): Promise<WatchlistItem> =>
    tryApi(
      async () => (await client.patch<WatchlistItem>(`/watchlist/${assetId}/pin`)).data,
      () => mockApi.togglePin(assetId)
    ),

  getAlerts: (): Promise<Alert[]> =>
    tryApi(
      async () => {
        const alerts = (await client.get<Alert[]>('/alerts')).data;
        const enriched = await Promise.all(
          alerts.map(async (alert) => {
            if (alert.asset) return alert;
            try {
              const asset = (await client.get<Asset>(`/assets/${alert.asset_id}`)).data;
              return { ...alert, asset };
            } catch {
              return alert;
            }
          })
        );
        return enriched;
      },
      mockApi.getAlerts
    ),

  createAlert: (data: { asset_id: number; condition: 'above' | 'below'; target_price: number }): Promise<Alert> =>
    tryApi(
      async () => (await client.post<Alert>('/alerts', data)).data,
      () => mockApi.createAlert(data)
    ),

  deleteAlert: (id: number): Promise<void> =>
    tryApi(
      async () => { await client.delete(`/alerts/${id}`); },
      () => mockApi.deleteAlert(id)
    ),

  getNotifications: (): Promise<Notification[]> =>
    tryApi(
      async () => (await client.get<Notification[]>('/notifications')).data,
      mockApi.getNotifications
    ),

  markNotificationRead: (id: number): Promise<Notification> =>
    tryApi(
      async () => (await client.patch<Notification>(`/notifications/${id}/read`)).data,
      () => mockApi.markNotificationRead(id)
    ),

  getDashboard: (): Promise<DashboardStats> =>
    tryApi(
      async () => {
        const raw = (await client.get('/dashboard')).data;
        const stats = raw.stats ?? raw;
        const increase = stats.biggestIncrease;
        const drop = stats.biggestDrop;
        return {
          totalTracked: stats.totalTracked ?? 0,
          biggestIncrease: increase
            ? { ...(increase.asset ?? increase), price_change_percent: increase.changePercent ?? increase.price_change_percent }
            : null,
          biggestDrop: drop
            ? { ...(drop.asset ?? drop), price_change_percent: drop.changePercent ?? drop.price_change_percent }
            : null,
        } as DashboardStats;
      },
      mockApi.getDashboard
    ),
};
