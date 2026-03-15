import { Price } from '../models';
export declare class PriceRepository {
    getLatestPrice(assetId: number): Promise<Price | null>;
    getPriceHistory(assetId: number, period: string): Promise<Price[]>;
    insertPrice(assetId: number, price: number): Promise<Price>;
    getLatestPrices(): Promise<Price[]>;
    getPreviousPrices(hoursAgo: number): Promise<Price[]>;
    private periodToInterval;
    private periodToSqlInterval;
}
//# sourceMappingURL=PriceRepository.d.ts.map