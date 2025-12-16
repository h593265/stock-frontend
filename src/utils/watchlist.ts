// Watchlist utility functions using localStorage

export interface WatchlistItem {
  symbol: string;
  addedAt: number;
}

const WATCHLIST_KEY = 'stockspot_watchlist';

export const getWatchlist = (): string[] => {
  try {
    const stored = localStorage.getItem(WATCHLIST_KEY);
    if (!stored) return [];
    const items: WatchlistItem[] = JSON.parse(stored);
    return items.map(item => item.symbol);
  } catch (error) {
    console.error('Error reading watchlist:', error);
    return [];
  }
};

export const addToWatchlist = (symbol: string): boolean => {
  try {
    const watchlist = getWatchlist();
    if (watchlist.includes(symbol)) {
      return false; // Already exists
    }
    
    const stored = localStorage.getItem(WATCHLIST_KEY);
    const items: WatchlistItem[] = stored ? JSON.parse(stored) : [];
    items.push({ symbol, addedAt: Date.now() });
    
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(items));
    return true;
  } catch (error) {
    console.error('Error adding to watchlist:', error);
    return false;
  }
};

export const removeFromWatchlist = (symbol: string): boolean => {
  try {
    const stored = localStorage.getItem(WATCHLIST_KEY);
    if (!stored) return false;
    
    const items: WatchlistItem[] = JSON.parse(stored);
    const filtered = items.filter(item => item.symbol !== symbol);
    
    if (filtered.length === items.length) {
      return false; // Symbol not found
    }
    
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Error removing from watchlist:', error);
    return false;
  }
};

export const isInWatchlist = (symbol: string): boolean => {
  const watchlist = getWatchlist();
  return watchlist.includes(symbol);
};
