import { useState, useMemo } from 'react';
import { useAssets } from '../hooks/useAssets';
import AssetCard from '../components/AssetCard';
import CategoryFilter from '../components/CategoryFilter';
import PriceComparison from '../components/PriceComparison';
import type { AssetCategory } from '../types';

export default function SearchPage() {
  const { assets, loading } = useAssets();
  const [category, setCategory] = useState<AssetCategory | 'all'>('all');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    let result = assets;
    if (category !== 'all') {
      result = result.filter(a => a.category === category);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        a => a.name.toLowerCase().includes(q) || a.symbol.toLowerCase().includes(q)
      );
    }
    return result;
  }, [assets, category, query]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Explore Assets</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Browse and discover assets to track
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <CategoryFilter selected={category} onChange={setCategory} />
        <div className="flex-1 w-full sm:max-w-xs">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter by name or symbol..."
            className="input-field text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(asset => (
          <AssetCard key={asset.id} asset={asset} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">No assets found matching your filters</p>
        </div>
      )}

      {/* Price Comparison */}
      <PriceComparison assets={assets} />
    </div>
  );
}
