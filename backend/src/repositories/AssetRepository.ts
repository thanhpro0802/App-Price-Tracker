import { query, isDatabaseAvailable } from '../config/database';
import { store } from '../config/inMemoryStore';
import { Asset } from '../models';

export class AssetRepository {
  async findAll(): Promise<Asset[]> {
    if (!isDatabaseAvailable()) {
      return store.assets;
    }
    const result = await query('SELECT * FROM assets ORDER BY id');
    return result.rows;
  }

  async findById(id: number): Promise<Asset | null> {
    if (!isDatabaseAvailable()) {
      return store.assets.find(a => a.id === id) ?? null;
    }
    const result = await query('SELECT * FROM assets WHERE id = $1', [id]);
    return result.rows[0] ?? null;
  }

  async findByCategory(category: string): Promise<Asset[]> {
    if (!isDatabaseAvailable()) {
      return store.assets.filter(a => a.category === category);
    }
    const result = await query('SELECT * FROM assets WHERE category = $1 ORDER BY id', [category]);
    return result.rows;
  }

  async search(searchQuery: string): Promise<Asset[]> {
    if (!isDatabaseAvailable()) {
      const q = searchQuery.toLowerCase();
      return store.assets.filter(
        a => a.name.toLowerCase().includes(q) || a.symbol.toLowerCase().includes(q)
      );
    }
    const result = await query(
      'SELECT * FROM assets WHERE LOWER(name) LIKE $1 OR LOWER(symbol) LIKE $1 ORDER BY id',
      [`%${searchQuery.toLowerCase()}%`]
    );
    return result.rows;
  }
}
