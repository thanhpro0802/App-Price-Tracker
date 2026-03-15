import { Alert } from '../models';
export declare class AlertRepository {
    getUserAlerts(userId: number): Promise<Alert[]>;
    createAlert(data: {
        user_id: number;
        asset_id: number;
        condition: 'above' | 'below';
        target_price: number;
    }): Promise<Alert>;
    deleteAlert(id: number): Promise<void>;
    getActiveAlerts(): Promise<Alert[]>;
    markTriggered(id: number): Promise<void>;
}
//# sourceMappingURL=AlertRepository.d.ts.map