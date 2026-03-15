export function formatPrice(price: number): string {
  if (price >= 1) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(price);
}

export function formatPercent(value: number): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    crypto: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
    currency: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    precious_metals: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
    products: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
  };
  return colors[category] ?? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400';
}

export function timeAgo(dateString: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
