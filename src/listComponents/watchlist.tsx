import { useEffect } from 'react';
import Stocklistbig from './stocks';
import { getWatchlist } from '../utils/watchlist';

interface WatchlistProps {
    onSelectStock: (symbol: string) => void;
    searchQuery?: string;
}

function Watchlist({ onSelectStock, searchQuery }: WatchlistProps) {
    useEffect(() => {
        // Force refresh when component mounts
        const symbols = getWatchlist();
        console.log('Watchlist symbols:', symbols);
    }, []);

    return (
        <div className="flex-1">
            <Stocklistbig 
                filters={{ category: 'watchlist', assetType: 'stocks' }}
                onSelectStock={onSelectStock}
                searchQuery={searchQuery}
            />
        </div>
    );
}

export default Watchlist;
