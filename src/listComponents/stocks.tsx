import { useState, useEffect } from 'react';
import Pager from '../components/pager';
import { addToWatchlist, isInWatchlist, removeFromWatchlist, getWatchlist } from '../utils/watchlist';
import { API_URL } from '../utils/config';
interface Stock {
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
    volume?: number;
}

type SortField = 'symbol' | 'price' | 'change' | 'changePercent' | 'volume';
type SortDirection = 'asc' | 'desc';

interface StocklistbigProps {
    filters: {
        category: string;
        assetType: string;
    };
    onSelectStock: (symbol: string) => void;
    searchQuery?: string;
}

function Stocklistbig({ filters, onSelectStock, searchQuery }: StocklistbigProps) {
    const [stocks, setStocks] = useState<Stock[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortField, setSortField] = useState<SortField>('symbol');
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
    const itemsPerPage = 10;

    useEffect(() => {
        const fetchStocks = async () => {
            setLoading(true);
            setError(null);
            
            try {
                // Handle watchlist separately
                if (filters.category === 'watchlist') {
                    const symbols = getWatchlist();
                    if (symbols.length === 0) {
                        setStocks([]);
                        setLoading(false);
                        return;
                    }

                    const stockPromises = symbols.map(async (symbol) => {
                        try {
                            const response = await fetch(`${API_URL}/api/stocks/${symbol}`);
                            if (!response.ok) throw new Error(`Failed to fetch ${symbol}`);
                            const data = await response.json();
                            return {
                                symbol: data.symbol,
                                name: data.name || data.symbol,
                                price: data.price || 0,
                                change: data.change || 0,
                                changePercent: data.changePercent || 0,
                                volume: data.volume || 0
                            };
                        } catch (err) {
                            console.error(`Error fetching ${symbol}:`, err);
                            return null;
                        }
                    });

                    const results = await Promise.all(stockPromises);
                    const validStocks = results.filter(stock => stock !== null) as Stock[];
                    setStocks(validStocks);
                } else {
                    const response = await fetch(`${API_URL}/api/stocks?category=${filters.category}&asset=${filters.assetType}`);
                    
                    if (!response.ok) {
                        throw new Error('Failed to fetch stocks');
                    }
                    
                    const data = await response.json();
                    setStocks(data);
                }
            } catch (err) {
                console.error('Error fetching stocks:', err);
                setError(err instanceof Error ? err.message : 'Failed to fetch stocks from API');
                setStocks([]);
            } finally {
                setLoading(false);
            }
        };

        fetchStocks();
        setCurrentPage(1);
    }, [filters]);

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const formatNumber = (value?: number) => {
        if (!value) return 'N/A';
        if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
        if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
        if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
        if (value >= 1e3) return `${(value / 1e3).toFixed(2)}K`;
        return value.toLocaleString();
    };

    const sortedStocks = [...stocks].sort((a, b) => {
        let aVal = a[sortField];
        let bVal = b[sortField];
        
        if (aVal === undefined) aVal = 0;
        if (bVal === undefined) bVal = 0;
        
        if (typeof aVal === 'string' && typeof bVal === 'string') {
            return sortDirection === 'asc' 
                ? aVal.localeCompare(bVal)
                : bVal.localeCompare(aVal);
        }
        
        return sortDirection === 'asc'
            ? (aVal as number) - (bVal as number)
            : (bVal as number) - (aVal as number);
    });

    // Apply search filter if searchQuery exists
    const filteredStocks = searchQuery 
        ? sortedStocks.filter(stock => 
            stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
            stock.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : sortedStocks;

    const totalPages = Math.ceil(filteredStocks.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentStocks = filteredStocks.slice(startIndex, endIndex);

    return (
        <div className="flex-1 bg-gray-800 p-6 overflow-y-auto flex flex-col">
            <h2 className="text-white text-2xl font-bold mb-4 ">
                {searchQuery ? (
                    <>
                        Search: "{searchQuery}" 
                        <span className="text-gray-400 text-lg ml-2">({filteredStocks.length} results)</span>
                    </>
                ) : (
                    filters.category === 'all' ? 'All Stocks' : filters.category.charAt(0).toUpperCase() + filters.category.slice(1)
                )}
            </h2>
            
            {error && (
                <div className="bg-yellow-500 bg-opacity-20  text-yellow-200 px-4 py-2 rounded mb-4">
                    {error}
                </div>
            )}
            
            {loading ? (
                <div className="text-gray-300 flex-1 flex items-center justify-center">Loading stocks...</div>
            ) : (
                <>
                    <div className="overflow-x-auto flex-1">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b-2 border-gray-600 bg-gray-800 bg-opacity-50">
                                    <th 
                                        onClick={() => handleSort('symbol')}
                                        className="text-left py-4 px-4 text-gray-200 font-bold cursor-pointer hover:text-white hover:bg-gray-700 transition-colors"
                                    >
                                        Symbol {sortField === 'symbol' && (sortDirection === 'asc' ? '↑' : '↓')}
                                    </th>
                                    <th 
                                        onClick={() => handleSort('price')}
                                        className="text-right py-4 px-4 text-gray-200 font-bold cursor-pointer hover:text-white hover:bg-gray-700 transition-colors"
                                    >
                                        Price {sortField === 'price' && (sortDirection === 'asc' ? '↑' : '↓')}
                                    </th>
                                    <th 
                                        onClick={() => handleSort('change')}
                                        className="text-right py-4 px-4 text-gray-200 font-bold cursor-pointer hover:text-white hover:bg-gray-700 transition-colors"
                                    >
                                        Change {sortField === 'change' && (sortDirection === 'asc' ? '↑' : '↓')}
                                    </th>
                                    <th 
                                        onClick={() => handleSort('changePercent')}
                                        className="text-right py-4 px-4 text-gray-200 font-bold cursor-pointer hover:text-white hover:bg-gray-700 transition-colors"
                                    >
                                        Change % {sortField === 'changePercent' && (sortDirection === 'asc' ? '↑' : '↓')}
                                    </th>
                                    <th 
                                        onClick={() => handleSort('volume')}
                                        className="text-right py-4 px-4 text-gray-200 font-bold cursor-pointer hover:text-white hover:bg-gray-700 transition-colors"
                                    >
                                        Volume {sortField === 'volume' && (sortDirection === 'asc' ? '↑' : '↓')}
                                    </th>
                                    <th className="text-center py-4 px-4 text-gray-200 font-bold ">
                                        Watchlist
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentStocks.map((stock, index) => {
                                    const inWatchlist = isInWatchlist(stock.symbol);
                                    return (
                                    <tr 
                                        key={stock.symbol}
                                        onClick={() => onSelectStock(stock.symbol)}
                                        className={`cursor-pointer hover:bg-blue-900 hover:bg-opacity-20 transition-all ${
                                            index % 2 === 0 ? 'bg-gray-900 bg-opacity-20' : 'bg-gray-800 bg-opacity-20'
                                        }`}
                                    >
                                        <td 
                                            onClick={() => onSelectStock(stock.symbol)}
                                            className="py-4 px-4 cursor-pointer"
                                        >
                                            <div className="text-white font-bold text-base">{stock.symbol}</div>
                                            <div className="text-gray-400 text-xs mt-1">{stock.name}</div>
                                        </td>
                                        <td 
                                            onClick={() => onSelectStock(stock.symbol)}
                                            className="py-4 px-4 text-right text-white font-semibold text-base cursor-pointer"
                                        >
                                            ${stock.price.toFixed(2)}
                                        </td>
                                        <td 
                                            onClick={() => onSelectStock(stock.symbol)}
                                            className={`py-4 px-4 text-right font-semibold text-base cursor-pointer ${stock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}
                                        >
                                            {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}
                                        </td>
                                        <td 
                                            onClick={() => onSelectStock(stock.symbol)}
                                            className={`py-4 px-4 text-right font-semibold text-base cursor-pointer ${stock.changePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}
                                        >
                                            {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                                        </td>
                                        <td 
                                            onClick={() => onSelectStock(stock.symbol)}
                                            className="py-4 px-4 text-right text-gray-300 text-sm cursor-pointer"
                                        >
                                            {formatNumber(stock.volume)}
                                        </td>
                                        <td className="py-4 px-4 text-center">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (inWatchlist) {
                                                        // Remove from watchlist
                                                        if (removeFromWatchlist(stock.symbol)) {
                                                            if (filters.category === 'watchlist') {
                                                                // If on watchlist page, remove from list
                                                                const updatedSymbols = getWatchlist();
                                                                setStocks(stocks.filter(s => updatedSymbols.includes(s.symbol)));
                                                            } else {
                                                                // If on stocks page, just refresh to update color
                                                                setStocks([...stocks]);
                                                            }
                                                        }
                                                    } else {
                                                        // Add to watchlist
                                                        if (addToWatchlist(stock.symbol)) {
                                                            setStocks([...stocks]);
                                                        }
                                                    }
                                                }}
                                                className="bg-transparent hover:scale-110 transition-transform"
                                                title={inWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
                                            >
                                                <span className={`inline-block w-6 h-6 rounded-full ${
                                                    inWatchlist ? 'bg-green-500' : 'bg-gray-500'
                                                }`}></span>
                                            </button>
                                        </td>
                                    </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    
                  
                        <Pager
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                            itemsPerPage={itemsPerPage}
                            totalItems={stocks.length}
                        />
                   
                </>
            )}
        </div>
    );
}

export default Stocklistbig;