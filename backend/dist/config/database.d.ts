import { Pool, QueryResult } from 'pg';
declare const pool: Pool;
export declare function checkDatabaseConnection(): Promise<boolean>;
export declare function isDatabaseAvailable(): boolean;
export declare function query(text: string, params?: unknown[]): Promise<QueryResult>;
export default pool;
//# sourceMappingURL=database.d.ts.map