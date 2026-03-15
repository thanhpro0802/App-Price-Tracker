import { Alert } from '../models';
export declare class AlertService {
    getUserAlerts(userId: number): Promise<Alert[]>;
    createAlert(data: {
        user_id: number;
        asset_id: number;
        condition: 'above' | 'below';
        target_price: number;
    }): Promise<Alert>;
    deleteAlert(id: number): Promise<void>;
    checkAlerts(): Promise<void>;
}
//# sourceMappingURL=AlertService.d.ts.map