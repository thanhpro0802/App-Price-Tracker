"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkDatabaseConnection = checkDatabaseConnection;
exports.isDatabaseAvailable = isDatabaseAvailable;
exports.query = query;
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
});
let dbAvailable = false;
async function checkDatabaseConnection() {
    try {
        await pool.query('SELECT 1');
        dbAvailable = true;
        console.log('Database connection established');
        return true;
    }
    catch {
        dbAvailable = false;
        console.warn('Database unavailable — running in demo mode with in-memory data');
        return false;
    }
}
function isDatabaseAvailable() {
    return dbAvailable;
}
async function query(text, params) {
    return pool.query(text, params);
}
exports.default = pool;
//# sourceMappingURL=database.js.map