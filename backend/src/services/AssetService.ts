import { AssetRepository } from '../repositories/AssetRepository';
import { Asset } from '../models';

const assetRepository = new AssetRepository();

export class AssetService {
  async getAllAssets(): Promise<Asset[]> {
    return assetRepository.findAll();
  }

  async getAssetById(id: number): Promise<Asset | null> {
    return assetRepository.findById(id);
  }

  async getAssetsByCategory(category: string): Promise<Asset[]> {
    return assetRepository.findByCategory(category);
  }

  async searchAssets(searchQuery: string): Promise<Asset[]> {
    return assetRepository.search(searchQuery);
  }
}
