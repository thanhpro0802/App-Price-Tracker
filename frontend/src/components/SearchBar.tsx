import { Search, X, Loader2 } from 'lucide-react';
import type { Asset } from '../types';
import { formatPrice } from '../utils';

interface SearchBarProps {
  query: string;
  results: Asset[];
  loading: boolean;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  handleQueryChange: (value: string) => void;
  clear: () => void;
  onSelect: (assetId: number) => void;
}

export default function SearchBar({
  query,
  results,
  loading,
  isOpen,
  handleQueryChange,
  clear,
  onSelect,
}: SearchBarProps) {
  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          placeholder="Search assets..."
          className="w-full pl-10 pr-10 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
        />
        {query && (
          <button
            onClick={clear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
          </button>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-80 overflow-auto">
          {results.map(asset => (
            <button
              key={asset.id}
              onClick={() => onSelect(asset.id)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left"
            >
              <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-xs font-bold text-primary-700 dark:text-primary-300">
                {asset.symbol.slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {asset.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{asset.symbol}</p>
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {formatPrice(asset.current_price ?? 0)}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
