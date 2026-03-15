import { Request, Response } from 'express';
export declare class WatchlistController {
    getWatchlist(req: Request, res: Response): Promise<void>;
    addItem(req: Request, res: Response): Promise<void>;
    removeItem(req: Request, res: Response): Promise<void>;
    togglePin(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=WatchlistController.d.ts.map