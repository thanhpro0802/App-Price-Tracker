"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetRepository = void 0;
const database_1 = require("../config/database");
const inMemoryStore_1 = require("../config/inMemoryStore");
class AssetRepository {
    async findAll() {
        if (!(0, database_1.isDatabaseAvailable)()) {
            return inMemoryStore_1.store.assets;
        }
        const result = await (0, database_1.query)('SELECT * FROM assets ORDER BY id');
        return result.rows;
    }
    async findById(id) {
        if (!(0, database_1.isDatabaseAvailable)()) {
            return inMemoryStore_1.store.assets.find(a => a.id === id) ?? null;
        }
        const result = await (0, database_1.query)('SELECT * FROM assets WHERE id = $1', [id]);
        return result.rows[0] ?? null;
    }
    async findByCategory(category) {
        if (!(0, database_1.isDatabaseAvailable)()) {
            return inMemoryStore_1.store.assets.filter(a => a.category === category);
        }
        const result = await (0, database_1.query)('SELECT * FROM assets WHERE category = $1 ORDER BY id', [category]);
        return result.rows;
    }
    async search(searchQuery) {
        if (!(0, database_1.isDatabaseAvailable)()) {
            const q = searchQuery.toLowerCase();
            return inMemoryStore_1.store.assets.filter(a => a.name.toLowerCase().includes(q) || a.symbol.toLowerCase().includes(q));
        }
        const result = await (0, database_1.query)('SELECT * FROM assets WHERE LOWER(name) LIKE $1 OR LOWER(symbol) LIKE $1 ORDER BY id', [`%${searchQuery.toLowerCase()}%`]);
        return result.rows;
    }
}
exports.AssetRepository = AssetRepository;
//# sourceMappingURL=AssetRepository.js.map