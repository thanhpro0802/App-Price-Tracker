import { WatchlistItem } from '../models';
export declare class WatchlistService {
    getUserWatchlist(userId: number): Promise<WatchlistItem[]>;
    addToWatchlist(userId: number, assetId: number): Promise<WatchlistItem>;
    removeFromWatchlist(userId: number, assetId: number): Promise<void>;
    togglePin(userId: number, assetId: number): Promise<WatchlistItem | null>;
}
//# sourceMappingURL=WatchlistService.d.ts.map