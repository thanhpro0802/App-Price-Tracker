import { Asset, Price, WatchlistItem, Alert, Notification, User } from '../models';
declare class InMemoryStore {
    assets: Asset[];
    prices: Price[];
    watchlist: WatchlistItem[];
    alerts: Alert[];
    notifications: Notification[];
    users: User[];
    private nextId;
    getNextId(table: string): number;
}
export declare const store: InMemoryStore;
export {};
//# sourceMappingURL=inMemoryStore.d.ts.map