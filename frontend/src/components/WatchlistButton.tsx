import { Star } from 'lucide-react';

interface WatchlistButtonProps {
  isWatched: boolean;
  onToggle: () => void;
  size?: 'sm' | 'md';
}

export default function WatchlistButton({ isWatched, onToggle, size = 'md' }: WatchlistButtonProps) {
  const sizeClasses = size === 'sm' ? 'p-1.5' : 'p-2';
  const iconSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      className={`${sizeClasses} rounded-lg transition-all duration-200 ${
        isWatched
          ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-500 hover:bg-yellow-100 dark:hover:bg-yellow-900/30'
          : 'bg-gray-100 dark:bg-gray-700 text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-yellow-500'
      }`}
      title={isWatched ? 'Remove from watchlist' : 'Add to watchlist'}
    >
      <Star className={`${iconSize} ${isWatched ? 'fill-current' : ''}`} />
    </button>
  );
}
