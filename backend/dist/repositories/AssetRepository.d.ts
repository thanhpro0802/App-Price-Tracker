import { Asset } from '../models';
export declare class AssetRepository {
    findAll(): Promise<Asset[]>;
    findById(id: number): Promise<Asset | null>;
    findByCategory(category: string): Promise<Asset[]>;
    search(searchQuery: string): Promise<Asset[]>;
}
//# sourceMappingURL=AssetRepository.d.ts.map