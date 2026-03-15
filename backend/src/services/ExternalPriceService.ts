/**
 * ExternalPriceService – fetches real-time prices from free public APIs:
 *
 *  • CoinGecko        – Crypto (BTC / ETH / SOL)
 *  • ExchangeRate-API – Forex  (USD/VND, EUR/VND, JPY/VND)
 *  • GoldAPI          – Precious metals (XAU / XAG)
 *
 * Every fetcher returns `null` on failure so the caller can fall back to
 * the existing mock / random-walk price generator.
 */

// ─── Helpers ───────────────────────────────────────────────────────────────────

const REQUEST_TIMEOUT_MS = 10_000; // 10 s per external call

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

// ─── CoinGecko (crypto) ───────────────────────────────────────────────────────

const COINGECKO_IDS: Record<string, string> = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  SOL: 'solana',
};

interface CoinGeckoResponse {
  [coinId: string]: { usd: number };
}

async function fetchCryptoPrices(): Promise<Record<string, number>> {
  const ids = Object.values(COINGECKO_IDS).join(',');
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`;

  const data = await fetchJson<CoinGeckoResponse>(url);
  if (!data) return {};

  const out: Record<string, number> = {};
  for (const [symbol, coinId] of Object.entries(COINGECKO_IDS)) {
    const price = data[coinId]?.usd;
    if (price !== undefined) out[symbol] = price;
  }
  return out;
}

// ─── ExchangeRate-API (forex) ──────────────────────────────────────────────────

interface ExchangeRateResponse {
  result: string;
  rates: Record<string, number>;
}

// Map of asset symbol → how to derive VND price from the USD-based rates
const FOREX_PAIRS: Record<string, (rates: Record<string, number>) => number | null> = {
  'USD/VND': (rates) => rates['VND'] ?? null,
  'EUR/VND': (rates) => {
    const eurUsd = rates['EUR'];
    const vnd = rates['VND'];
    if (eurUsd === undefined || vnd === undefined) return null;
    // rates are "1 USD = X foreign", so EUR/VND = VND / EUR
    return vnd / eurUsd;
  },
  'JPY/VND': (rates) => {
    const jpyUsd = rates['JPY'];
    const vnd = rates['VND'];
    if (jpyUsd === undefined || vnd === undefined) return null;
    return vnd / jpyUsd;
  },
};

async function fetchForexPrices(): Promise<Record<string, number>> {
  const url = 'https://open.er-api.com/v6/latest/USD';
  const data = await fetchJson<ExchangeRateResponse>(url);
  if (!data || data.result !== 'success' || !data.rates) return {};

  const out: Record<string, number> = {};
  for (const [symbol, derive] of Object.entries(FOREX_PAIRS)) {
    const price = derive(data.rates);
    if (price !== null) out[symbol] = Math.round(price * 10000) / 10000;
  }
  return out;
}

// ─── GoldAPI (precious metals) ─────────────────────────────────────────────────

interface GoldApiResponse {
  price: number;
}

// Simple in-memory cache (1-minute TTL) to respect gold-api.com fair-use policy
const goldCache: Record<string, { price: number; ts: number }> = {};
const GOLD_CACHE_TTL_MS = 60_000; // 1 minute

async function fetchGoldPrice(symbol: string): Promise<number | null> {
  const cached = goldCache[symbol];
  if (cached && Date.now() - cached.ts < GOLD_CACHE_TTL_MS) {
    return cached.price;
  }

  const url = `https://api.gold-api.com/price/${symbol}`;
  const data = await fetchJson<GoldApiResponse>(url);
  if (!data || data.price === undefined) return null;

  goldCache[symbol] = { price: data.price, ts: Date.now() };
  return data.price;
}

const GOLD_SYMBOLS = ['XAU', 'XAG'];

async function fetchPreciousMetalPrices(): Promise<Record<string, number>> {
  const results = await Promise.all(
    GOLD_SYMBOLS.map(async (sym) => {
      const price = await fetchGoldPrice(sym);
      return [sym, price] as const;
    }),
  );

  const out: Record<string, number> = {};
  for (const [sym, price] of results) {
    if (price !== null) out[sym] = price;
  }
  return out;
}

// ─── Public API ────────────────────────────────────────────────────────────────

/**
 * Fetch all real prices from external APIs.
 * Returns a map of `symbol → USD price` for every symbol that could be resolved.
 * Symbols that failed are simply omitted from the map.
 */
export async function fetchAllRealPrices(): Promise<Record<string, number>> {
  // Fire all three sources in parallel for speed
  const [crypto, forex, metals] = await Promise.all([
    fetchCryptoPrices(),
    fetchForexPrices(),
    fetchPreciousMetalPrices(),
  ]);

  const merged: Record<string, number> = { ...crypto, ...forex, ...metals };

  const count = Object.keys(merged).length;
  if (count > 0) {
    console.log(`[ExternalPriceService] Fetched ${count} real prices:`,
      Object.entries(merged).map(([s, p]) => `${s}=${p}`).join(', '));
  } else {
    console.warn('[ExternalPriceService] All external APIs unavailable – will use mock prices');
  }

  return merged;
}
