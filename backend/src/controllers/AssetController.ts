import { Request, Response } from 'express';
import { AssetService } from '../services/AssetService';

const assetService = new AssetService();

export class AssetController {
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const { category } = req.query;
      let assets;
      if (category && typeof category === 'string') {
        assets = await assetService.getAssetsByCategory(category);
      } else {
        assets = await assetService.getAllAssets();
      }
      res.json(assets);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch assets' });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(String(req.params.id), 10);
      const asset = await assetService.getAssetById(id);
      if (!asset) {
        res.status(404).json({ error: 'Asset not found' });
        return;
      }
      res.json(asset);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch asset' });
    }
  }

  async search(req: Request, res: Response): Promise<void> {
    try {
      const q = req.query.q as string;
      if (!q) {
        res.status(400).json({ error: 'Search query required' });
        return;
      }
      const assets = await assetService.searchAssets(q);
      res.json(assets);
    } catch (error) {
      res.status(500).json({ error: 'Search failed' });
    }
  }
}
