import { useState, useEffect } from 'react';

import Stocklistbig from '../listComponents/stocks';
import Watchlist from '../listComponents/watchlist';
import CategorySidebar from '../components/categorySidebar';
import StockDetail from './stockDetail';

interface MainProps {
  onSelectStock: (symbol: string) => void;
  activePage: 'stocks' | 'watchlist' | 'stockDetail';
  searchQuery: string;
  onClearSearch: () => void;
  selectedStock: string | null;
  onBack: () => void;
  previousPage: 'stocks' | 'watchlist';
}

function Main({ onSelectStock, activePage, searchQuery, onClearSearch, selectedStock, onBack, previousPage }: MainProps) {
  const [filters, setFilters] = useState({
    category: 'active',
    assetType: 'stocks'
  });

  // Reset filters when switching between stocks and watchlist
  useEffect(() => {
    setFilters({
      category: 'active',
      assetType: 'stocks'
    });
    // Clear search when switching pages
    if (onClearSearch) {
      onClearSearch();
    }
  }, [activePage]);

  const handleFiltersChange = (newFilters: { category: string; assetType: string }) => {
    setFilters(newFilters);
  };

  // Render stock detail if a stock is selected
  if (activePage === 'stockDetail' && selectedStock && onBack) {
    return <StockDetail symbol={selectedStock} onBack={onBack} previousPage={previousPage} />;
  }

  return (
    <div className="flex-1 bg-gray-800  flex ">
      <CategorySidebar onFiltersChange={handleFiltersChange} />
      {activePage === 'watchlist' ? (
        <Watchlist onSelectStock={onSelectStock} searchQuery={searchQuery} />
      ) : (
        <Stocklistbig 
          filters={filters} 
          onSelectStock={onSelectStock}
          searchQuery={searchQuery}
        />
      )}
    </div>
  );
}
export default Main ;