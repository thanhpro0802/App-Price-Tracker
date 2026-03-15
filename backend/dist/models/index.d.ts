export interface User {
    id: number;
    email: string;
    password: string;
    created_at: Date;
}
export interface Asset {
    id: number;
    name: string;
    category: string;
    symbol: string;
    image_url: string | null;
    created_at: Date;
}
export interface Price {
    id: number;
    asset_id: number;
    price: number;
    timestamp: Date;
}
export interface WatchlistItem {
    id: number;
    user_id: number;
    asset_id: number;
    pinned: boolean;
    created_at: Date;
}
export interface Alert {
    id: number;
    user_id: number;
    asset_id: number;
    condition: 'above' | 'below';
    target_price: number;
    triggered: boolean;
    created_at: Date;
}
export interface Notification {
    id: number;
    user_id: number;
    alert_id: number;
    message: string;
    read: boolean;
    created_at: Date;
}
export interface DashboardStats {
    totalTracked: number;
    biggestIncrease: {
        asset: Asset;
        changePercent: number;
    } | null;
    biggestDrop: {
        asset: Asset;
        changePercent: number;
    } | null;
}
//# sourceMappingURL=index.d.ts.map