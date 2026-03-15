import type { Asset, Price, WatchlistItem, Alert, Notification, DashboardStats, TimePeriod } from '../types';

const mockAssets: Asset[] = [
  { id: 1, name: 'Bitcoin', category: 'crypto', symbol: 'BTC', current_price: 67432.18, price_change_percent: 2.34, last_updated: new Date().toISOString() },
  { id: 2, name: 'Ethereum', category: 'crypto', symbol: 'ETH', current_price: 3456.72, price_change_percent: -1.12, last_updated: new Date().toISOString() },
  { id: 3, name: 'Solana', category: 'crypto', symbol: 'SOL', current_price: 178.45, price_change_percent: 5.67, last_updated: new Date().toISOString() },
  { id: 4, name: 'Cardano', category: 'crypto', symbol: 'ADA', current_price: 0.62, price_change_percent: -0.84, last_updated: new Date().toISOString() },
  { id: 5, name: 'Ripple', category: 'crypto', symbol: 'XRP', current_price: 0.58, price_change_percent: 1.23, last_updated: new Date().toISOString() },
  { id: 6, name: 'Gold', category: 'precious_metals', symbol: 'XAU', current_price: 2412.30, price_change_percent: 0.45, last_updated: new Date().toISOString() },
  { id: 7, name: 'Silver', category: 'precious_metals', symbol: 'XAG', current_price: 28.93, price_change_percent: -0.32, last_updated: new Date().toISOString() },
  { id: 8, name: 'Platinum', category: 'precious_metals', symbol: 'XPT', current_price: 982.50, price_change_percent: 0.78, last_updated: new Date().toISOString() },
  { id: 9, name: 'EUR/USD', category: 'currency', symbol: 'EURUSD', current_price: 1.0912, price_change_percent: 0.15, last_updated: new Date().toISOString() },
  { id: 10, name: 'GBP/USD', category: 'currency', symbol: 'GBPUSD', current_price: 1.2834, price_change_percent: -0.22, last_updated: new Date().toISOString() },
  { id: 11, name: 'USD/JPY', category: 'currency', symbol: 'USDJPY', current_price: 154.32, price_change_percent: 0.08, last_updated: new Date().toISOString() },
  { id: 12, name: 'iPhone 15 Pro', category: 'products', symbol: 'AAPL-IP15P', current_price: 999.00, price_change_percent: -2.50, last_updated: new Date().toISOString() },
  { id: 13, name: 'PS5 Console', category: 'products', symbol: 'SONY-PS5', current_price: 449.99, price_change_percent: -5.26, last_updated: new Date().toISOString() },
  { id: 14, name: 'MacBook Air M3', category: 'products', symbol: 'AAPL-MBA3', current_price: 1099.00, price_change_percent: 0.00, last_updated: new Date().toISOString() },
  { id: 15, name: 'Polkadot', category: 'crypto', symbol: 'DOT', current_price: 7.82, price_change_percent: 3.45, last_updated: new Date().toISOString() },
  { id: 16, name: 'Palladium', category: 'precious_metals', symbol: 'XPD', current_price: 1024.00, price_change_percent: -1.67, last_updated: new Date().toISOString() },
];

function generatePriceHistory(basePrice: number, period: TimePeriod): Price[] {
  const points: Record<TimePeriod, number> = { '24h': 48, '7d': 168, '30d': 120, '1y': 365 };
  const count = points[period];
  const now = Date.now();
  const intervals: Record<TimePeriod, number> = {
    '24h': 30 * 60 * 1000,
    '7d': 60 * 60 * 1000,
    '30d': 6 * 60 * 60 * 1000,
    '1y': 24 * 60 * 60 * 1000,
  };
  const interval = intervals[period];
  const volatility = basePrice * 0.02;

  const prices: Price[] = [];
  let price = basePrice * (0.92 + Math.random() * 0.08);

  for (let i = 0; i < count; i++) {
    const t = i / count;
    const sine = Math.sin(t * Math.PI * 2 * (1 + Math.random() * 0.5)) * volatility * 0.5;
    const trend = (basePrice - price) * 0.05;
    const noise = (Math.random() - 0.5) * volatility * 0.3;
    price += sine * 0.1 + trend + noise;
    price = Math.max(price, basePrice * 0.8);

    prices.push({
      id: i + 1,
      asset_id: 1,
      price: Number(price.toFixed(price < 1 ? 4 : 2)),
      timestamp: new Date(now - (count - i) * interval).toISOString(),
    });
  }

  // Ensure the last price matches current
  if (prices.length > 0) {
    prices[prices.length - 1].price = basePrice;
  }

  return prices;
}

let mockWatchlist: WatchlistItem[] = [
  { id: 1, user_id: 1, asset_id: 1, pinned: true, asset: mockAssets[0] },
  { id: 2, user_id: 1, asset_id: 2, pinned: true, asset: mockAssets[1] },
  { id: 3, user_id: 1, asset_id: 6, pinned: false, asset: mockAssets[5] },
  { id: 4, user_id: 1, asset_id: 3, pinned: false, asset: mockAssets[2] },
  { id: 5, user_id: 1, asset_id: 12, pinned: false, asset: mockAssets[11] },
];

let mockAlerts: Alert[] = [
  { id: 1, user_id: 1, asset_id: 1, condition: 'above', target_price: 70000, triggered: false, asset: mockAssets[0] },
  { id: 2, user_id: 1, asset_id: 2, condition: 'below', target_price: 3000, triggered: false, asset: mockAssets[1] },
  { id: 3, user_id: 1, asset_id: 6, condition: 'above', target_price: 2500, triggered: false, asset: mockAssets[5] },
  { id: 4, user_id: 1, asset_id: 13, condition: 'below', target_price: 400, triggered: true, asset: mockAssets[12] },
];

let mockNotifications: Notification[] = [
  { id: 1, user_id: 1, alert_id: 4, message: 'PS5 Console dropped below $400 target!', read: false, created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString() },
  { id: 2, user_id: 1, alert_id: 1, message: 'Bitcoin is approaching your $70,000 target', read: false, created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
  { id: 3, user_id: 1, alert_id: 2, message: 'Ethereum price alert: currently near $3,456', read: true, created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
  { id: 4, user_id: 1, alert_id: 3, message: 'Gold reached a new high today at $2,412', read: true, created_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString() },
];

let nextWatchlistId = 6;
let nextAlertId = 5;

function delay(ms: number = 200): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const mockApi = {
  getAssets: async (): Promise<Asset[]> => {
    await delay();
    return [...mockAssets];
  },

  getAsset: async (id: number): Promise<Asset> => {
    await delay();
    const asset = mockAssets.find(a => a.id === id);
    if (!asset) throw new Error('Asset not found');
    return { ...asset };
  },

  searchAssets: async (query: string): Promise<Asset[]> => {
    await delay();
    const q = query.toLowerCase();
    return mockAssets.filter(
      a => a.name.toLowerCase().includes(q) || a.symbol.toLowerCase().includes(q)
    );
  },

  getLatestPrice: async (assetId: number): Promise<Price> => {
    await delay();
    const asset = mockAssets.find(a => a.id === assetId);
    return {
      id: 1,
      asset_id: assetId,
      price: asset?.current_price ?? 0,
      timestamp: new Date().toISOString(),
    };
  },

  getPriceHistory: async (assetId: number, period: TimePeriod): Promise<Price[]> => {
    await delay(300);
    const asset = mockAssets.find(a => a.id === assetId);
    const base = asset?.current_price ?? 100;
    return generatePriceHistory(base, period);
  },

  getWatchlist: async (): Promise<WatchlistItem[]> => {
    await delay();
    return mockWatchlist.map(w => ({ ...w }));
  },

  addToWatchlist: async (assetId: number): Promise<WatchlistItem> => {
    await delay();
    const asset = mockAssets.find(a => a.id === assetId);
    const item: WatchlistItem = {
      id: nextWatchlistId++,
      user_id: 1,
      asset_id: assetId,
      pinned: false,
      asset,
    };
    mockWatchlist.push(item);
    return { ...item };
  },

  removeFromWatchlist: async (assetId: number): Promise<void> => {
    await delay();
    mockWatchlist = mockWatchlist.filter(w => w.asset_id !== assetId);
  },

  togglePin: async (assetId: number): Promise<WatchlistItem> => {
    await delay();
    const item = mockWatchlist.find(w => w.asset_id === assetId);
    if (!item) throw new Error('Watchlist item not found');
    item.pinned = !item.pinned;
    return { ...item };
  },

  getAlerts: async (): Promise<Alert[]> => {
    await delay();
    return mockAlerts.map(a => ({ ...a }));
  },

  createAlert: async (data: { asset_id: number; condition: 'above' | 'below'; target_price: number }): Promise<Alert> => {
    await delay();
    const asset = mockAssets.find(a => a.id === data.asset_id);
    const alert: Alert = {
      id: nextAlertId++,
      user_id: 1,
      asset_id: data.asset_id,
      condition: data.condition,
      target_price: data.target_price,
      triggered: false,
      asset,
    };
    mockAlerts.push(alert);
    return { ...alert };
  },

  deleteAlert: async (id: number): Promise<void> => {
    await delay();
    mockAlerts = mockAlerts.filter(a => a.id !== id);
  },

  getNotifications: async (): Promise<Notification[]> => {
    await delay();
    return mockNotifications.map(n => ({ ...n }));
  },

  markNotificationRead: async (id: number): Promise<Notification> => {
    await delay();
    const notif = mockNotifications.find(n => n.id === id);
    if (!notif) throw new Error('Notification not found');
    notif.read = true;
    return { ...notif };
  },

  getDashboard: async (): Promise<DashboardStats> => {
    await delay();
    const sorted = [...mockAssets].sort(
      (a, b) => (b.price_change_percent ?? 0) - (a.price_change_percent ?? 0)
    );
    return {
      totalTracked: mockAssets.length,
      biggestIncrease: sorted[0] ?? null,
      biggestDrop: sorted[sorted.length - 1] ?? null,
    };
  },
};
