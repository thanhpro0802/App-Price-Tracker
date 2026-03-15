import type { AssetCategory } from '../types';

interface CategoryFilterProps {
  selected: AssetCategory | 'all';
  onChange: (category: AssetCategory | 'all') => void;
}

const categories: { value: AssetCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'crypto', label: 'Crypto' },
  { value: 'currency', label: 'Currency' },
  { value: 'precious_metals', label: 'Precious Metals' },
  { value: 'products', label: 'Products' },
];

export default function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map(cat => (
        <button
          key={cat.value}
          onClick={() => onChange(cat.value)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            selected === cat.value
              ? 'bg-primary-600 text-white shadow-md shadow-primary-600/25'
              : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 hover:text-primary-600 dark:hover:text-primary-400'
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
