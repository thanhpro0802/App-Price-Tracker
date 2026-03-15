import { WatchlistItem } from '../models';
export declare class WatchlistRepository {
    getUserWatchlist(userId: number): Promise<WatchlistItem[]>;
    addItem(userId: number, assetId: number): Promise<WatchlistItem>;
    removeItem(userId: number, assetId: number): Promise<void>;
    togglePin(userId: number, assetId: number): Promise<WatchlistItem | null>;
}
//# sourceMappingURL=WatchlistRepository.d.ts.map