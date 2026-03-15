export interface PredictionResult {
    currentPrice: number;
    predictedPrice: number;
    confidence: number;
    direction: 'up' | 'down' | 'stable';
    predictedChange: number;
    predictedChangePercent: number;
}
export declare class PredictionService {
    predictPrice(assetId: number, period?: string): Promise<PredictionResult | null>;
}
//# sourceMappingURL=PredictionService.d.ts.map