import { query, isDatabaseAvailable } from '../config/database';
import { store } from '../config/inMemoryStore';
import { User } from '../models';

export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    if (!isDatabaseAvailable()) {
      return store.users.find(u => u.email === email) ?? null;
    }
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0] ?? null;
  }

  async create(email: string, hashedPassword: string): Promise<User> {
    if (!isDatabaseAvailable()) {
      const user: User = {
        id: store.getNextId('users'),
        email,
        password: hashedPassword,
        created_at: new Date(),
      };
      store.users.push(user);
      return user;
    }
    const result = await query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *',
      [email, hashedPassword]
    );
    return result.rows[0];
  }
}
