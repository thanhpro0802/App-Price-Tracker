import { Request, Response } from 'express';
import { PriceService } from '../services/PriceService';
import { PredictionService } from '../services/PredictionService';

const priceService = new PriceService();
const predictionService = new PredictionService();

export class PriceController {
  async getLatest(req: Request, res: Response): Promise<void> {
    try {
      const assetId = parseInt(String(req.params.assetId), 10);
      const price = await priceService.getLatestPrice(assetId);
      if (!price) {
        res.status(404).json({ error: 'No price data found' });
        return;
      }
      res.json(price);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch latest price' });
    }
  }

  async getHistory(req: Request, res: Response): Promise<void> {
    try {
      const assetId = parseInt(String(req.params.assetId), 10);
      const period = (req.query.period as string) || '24h';
      const history = await priceService.getPriceHistory(assetId, period);
      res.json(history);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch price history' });
    }
  }

  async getPrediction(req: Request, res: Response): Promise<void> {
    try {
      const assetId = parseInt(String(req.params.assetId), 10);
      const period = (req.query.period as string) || '24h';
      const prediction = await predictionService.predictPrice(assetId, period);
      if (!prediction) {
        res.status(404).json({ error: 'Not enough data for prediction' });
        return;
      }
      res.json(prediction);
    } catch (error) {
      res.status(500).json({ error: 'Failed to generate prediction' });
    }
  }
}
