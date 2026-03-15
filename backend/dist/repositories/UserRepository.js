"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const database_1 = require("../config/database");
const inMemoryStore_1 = require("../config/inMemoryStore");
class UserRepository {
    async findByEmail(email) {
        if (!(0, database_1.isDatabaseAvailable)()) {
            return inMemoryStore_1.store.users.find(u => u.email === email) ?? null;
        }
        const result = await (0, database_1.query)('SELECT * FROM users WHERE email = $1', [email]);
        return result.rows[0] ?? null;
    }
    async create(email, hashedPassword) {
        if (!(0, database_1.isDatabaseAvailable)()) {
            const user = {
                id: inMemoryStore_1.store.getNextId('users'),
                email,
                password: hashedPassword,
                created_at: new Date(),
            };
            inMemoryStore_1.store.users.push(user);
            return user;
        }
        const result = await (0, database_1.query)('INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *', [email, hashedPassword]);
        return result.rows[0];
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=UserRepository.js.map