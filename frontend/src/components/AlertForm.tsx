import { useState } from 'react';
import { Plus } from 'lucide-react';
import type { Asset } from '../types';

interface AlertFormProps {
  assets: Asset[];
  defaultAssetId?: number;
  onSubmit: (data: { asset_id: number; condition: 'above' | 'below'; target_price: number }) => void;
}

export default function AlertForm({ assets, defaultAssetId, onSubmit }: AlertFormProps) {
  const [assetId, setAssetId] = useState(defaultAssetId ?? (assets[0]?.id ?? 0));
  const [condition, setCondition] = useState<'above' | 'below'>('above');
  const [targetPrice, setTargetPrice] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(targetPrice);
    if (isNaN(price) || price <= 0) return;
    onSubmit({ asset_id: assetId, condition, target_price: price });
    setTargetPrice('');
  };

  return (
    <form onSubmit={handleSubmit} className="card p-4 lg:p-6">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Create Price Alert</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Asset
          </label>
          <select
            value={assetId}
            onChange={(e) => setAssetId(Number(e.target.value))}
            className="input-field"
          >
            {assets.map(a => (
              <option key={a.id} value={a.id}>
                {a.name} ({a.symbol})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Condition
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setCondition('above')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                condition === 'above'
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-2 border-green-300 dark:border-green-700'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border-2 border-transparent'
              }`}
            >
              Price Above
            </button>
            <button
              type="button"
              onClick={() => setCondition('below')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                condition === 'below'
                  ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-2 border-red-300 dark:border-red-700'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border-2 border-transparent'
              }`}
            >
              Price Below
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Target Price ($)
          </label>
          <input
            type="number"
            step="any"
            value={targetPrice}
            onChange={(e) => setTargetPrice(e.target.value)}
            placeholder="Enter target price..."
            className="input-field"
            required
          />
        </div>

        <button
          type="submit"
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Alert
        </button>
      </div>
    </form>
  );
}
