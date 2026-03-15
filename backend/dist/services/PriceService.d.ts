import { Price, Asset } from '../models';
export interface PriceWithChange {
    asset: Asset;
    currentPrice: number;
    previousPrice: number | null;
    change: number | null;
    changePercent: number | null;
}
export declare class PriceService {
    getLatestPrice(assetId: number): Promise<Price | null>;
    getPriceHistory(assetId: number, period: string): Promise<Price[]>;
    insertPrice(assetId: number, price: number): Promise<Price>;
    getAllPricesWithChange(): Promise<PriceWithChange[]>;
}
//# sourceMappingURL=PriceService.d.ts.map