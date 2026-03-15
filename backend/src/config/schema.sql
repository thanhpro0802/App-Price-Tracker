CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS assets (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL,
  symbol VARCHAR(50) NOT NULL,
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS prices (
  id SERIAL PRIMARY KEY,
  asset_id INTEGER REFERENCES assets(id) ON DELETE CASCADE,
  price DECIMAL(20, 8) NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS watchlist (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  asset_id INTEGER REFERENCES assets(id) ON DELETE CASCADE,
  pinned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, asset_id)
);

CREATE TABLE IF NOT EXISTS alerts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  asset_id INTEGER REFERENCES assets(id) ON DELETE CASCADE,
  condition VARCHAR(10) NOT NULL CHECK (condition IN ('above', 'below')),
  target_price DECIMAL(20, 8) NOT NULL,
  triggered BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  alert_id INTEGER REFERENCES alerts(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_prices_asset_timestamp ON prices(asset_id, timestamp);

-- Seed data
INSERT INTO assets (name, category, symbol) VALUES
  ('Bitcoin', 'crypto', 'BTC'),
  ('Ethereum', 'crypto', 'ETH'),
  ('Solana', 'crypto', 'SOL'),
  ('USD/VND', 'currency', 'USD/VND'),
  ('JPY/VND', 'currency', 'JPY/VND'),
  ('EUR/VND', 'currency', 'EUR/VND'),
  ('Gold', 'precious_metals', 'XAU'),
  ('Silver', 'precious_metals', 'XAG'),
  ('iPhone', 'products', 'IPHONE'),
  ('MacBook', 'products', 'MACBOOK'),
  ('Gaming Laptop', 'products', 'GAMING_LAPTOP')
ON CONFLICT DO NOTHING;
