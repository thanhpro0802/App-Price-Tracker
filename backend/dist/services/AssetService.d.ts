import { Asset } from '../models';
export declare class AssetService {
    getAllAssets(): Promise<Asset[]>;
    getAssetById(id: number): Promise<Asset | null>;
    getAssetsByCategory(category: string): Promise<Asset[]>;
    searchAssets(searchQuery: string): Promise<Asset[]>;
}
//# sourceMappingURL=AssetService.d.ts.map