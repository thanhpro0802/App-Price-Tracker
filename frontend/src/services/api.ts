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
      async () => (await client.get<Asset[]>('/assets')).data,
      mockApi.getAssets
    ),

  getAsset: (id: number): Promise<Asset> =>
    tryApi(
      async () => (await client.get<Asset>(`/assets/${id}`)).data,
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
      async () => (await client.get<WatchlistItem[]>('/watchlist')).data,
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
      async () => (await client.get<Alert[]>('/alerts')).data,
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
      async () => (await client.get<DashboardStats>('/dashboard')).data,
      mockApi.getDashboard
    ),
};
