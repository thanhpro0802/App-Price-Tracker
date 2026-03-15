"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.store = void 0;
// Seed assets for demo mode
const seedAssets = [
    { id: 1, name: 'Bitcoin', category: 'crypto', symbol: 'BTC', image_url: null, created_at: new Date() },
    { id: 2, name: 'Ethereum', category: 'crypto', symbol: 'ETH', image_url: null, created_at: new Date() },
    { id: 3, name: 'Solana', category: 'crypto', symbol: 'SOL', image_url: null, created_at: new Date() },
    { id: 4, name: 'USD/VND', category: 'currency', symbol: 'USD/VND', image_url: null, created_at: new Date() },
    { id: 5, name: 'JPY/VND', category: 'currency', symbol: 'JPY/VND', image_url: null, created_at: new Date() },
    { id: 6, name: 'EUR/VND', category: 'currency', symbol: 'EUR/VND', image_url: null, created_at: new Date() },
    { id: 7, name: 'Gold', category: 'precious_metals', symbol: 'XAU', image_url: null, created_at: new Date() },
    { id: 8, name: 'Silver', category: 'precious_metals', symbol: 'XAG', image_url: null, created_at: new Date() },
    { id: 9, name: 'iPhone', category: 'products', symbol: 'IPHONE', image_url: null, created_at: new Date() },
    { id: 10, name: 'MacBook', category: 'products', symbol: 'MACBOOK', image_url: null, created_at: new Date() },
    { id: 11, name: 'Gaming Laptop', category: 'products', symbol: 'GAMING_LAPTOP', image_url: null, created_at: new Date() },
];
const defaultUser = {
    id: 1,
    email: 'demo@example.com',
    password: '$2a$10$dummy',
    created_at: new Date(),
};
class InMemoryStore {
    constructor() {
        this.assets = [...seedAssets];
        this.prices = [];
        this.watchlist = [];
        this.alerts = [];
        this.notifications = [];
        this.users = [defaultUser];
        this.nextId = {
            prices: 1,
            watchlist: 1,
            alerts: 1,
            notifications: 1,
            users: 2,
        };
    }
    getNextId(table) {
        const id = this.nextId[table] ?? 1;
        this.nextId[table] = id + 1;
        return id;
    }
}
exports.store = new InMemoryStore();
//# sourceMappingURL=inMemoryStore.js.map