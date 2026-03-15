export interface Asset {
  id: number;
  name: string;
  category: string;
  symbol: string;
  image_url?: string;
  current_price?: number;
  price_change_percent?: number;
  last_updated?: string;
}

export interface Price {
  id: number;
  asset_id: number;
  price: number;
  timestamp: string;
}

export interface WatchlistItem {
  id: number;
  user_id: number;
  asset_id: number;
  pinned: boolean;
  asset?: Asset;
}

export interface Alert {
  id: number;
  user_id: number;
  asset_id: number;
  condition: 'above' | 'below';
  target_price: number;
  triggered: boolean;
  asset?: Asset;
}

export interface Notification {
  id: number;
  user_id: number;
  alert_id: number;
  message: string;
  read: boolean;
  created_at: string;
}

export interface DashboardStats {
  totalTracked: number;
  biggestIncrease: Asset | null;
  biggestDrop: Asset | null;
}

export type TimePeriod = '24h' | '7d' | '30d' | '1y';
export type AssetCategory = 'crypto' | 'currency' | 'precious_metals' | 'products';
