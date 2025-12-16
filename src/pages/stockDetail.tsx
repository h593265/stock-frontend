import { useState, useEffect } from 'react';
import Chart from '../components/chart';

interface StockDetailProps {
  symbol: string;
  onBack: () => void;
  previousPage: 'stocks' | 'watchlist';
}

interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap?: number;
  pe?: number;
  high52Week?: number;
  low52Week?: number;
  dayHigh?: number;
  dayLow?: number;
  openPrice?: number;
  previousClose?: number;
  chartData?: any[];
}

function StockDetail({ symbol, onBack, previousPage }: StockDetailProps) {
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [range, setRange] = useState('1d');
  const [interval, setInterval] = useState('15m');

  useEffect(() => {
    const fetchStockDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`http://localhost:3000/api/stocks/${symbol}?range=${range}&interval=${interval}`);
        if (!response.ok) {
          throw new Error('Failed to fetch stock data');
        }
        const data = await response.json();
        setStockData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchStockDetail();
  }, [symbol, range, interval]);

  if (loading) {
    return (
      <div className="flex-1 bg-gray-800 flex items-center justify-center">
        <div className="text-white text-xl">Loading {symbol}...</div>
      </div>
    );
  }

  if (error || !stockData) {
    return (
      <div className="flex-1 bg-gray-800 flex flex-col items-center justify-center p-8">
        <div className="text-red-400 text-xl mb-4">{error || 'Stock not found'}</div>
        <button
          onClick={onBack}
          className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Back to Stocks
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-800 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="mb-6 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
        >
          ← Back to {previousPage === 'stocks' ? 'Stocks' : 'Watchlist'}
        </button>

        {/* Stock Header */}
        <div className="bg-gray-900 rounded-lg p-6 mb-6">
          <div className="flex items-baseline gap-4 mb-2">
            <h1 className="text-4xl font-bold text-white">{stockData.symbol}</h1>
            <span className="text-xl text-gray-400">{stockData.name}</span>
          </div>
          <div className="flex items-baseline gap-4">
            <span className="text-5xl font-bold text-white">${stockData.price.toFixed(2)}</span>
            <span className={`text-2xl font-semibold ${stockData.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {stockData.change >= 0 ? '+' : ''}{stockData.change.toFixed(2)} ({stockData.changePercent >= 0 ? '+' : ''}{stockData.changePercent.toFixed(2)}%)
            </span>
          </div>
        </div>

        {/* Stock Chart */}
        <div className="bg-gray-900 rounded-lg p-6 mb-6">
          <Chart 
            data={stockData.chartData || []} 
            symbol={symbol}
            onRangeChange={setRange}
            onIntervalChange={setInterval}
            selectedRange={range}
            selectedInterval={interval}
          />
        </div>

        {/* Stock Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gray-900 rounded-lg p-6">
            <div className="text-gray-400 text-sm mb-2">Volume</div>
            <div className="text-white text-2xl font-semibold">
              {stockData.volume.toLocaleString()}
            </div>
          </div>

          {stockData.marketCap && (
            <div className="bg-gray-900 rounded-lg p-6">
              <div className="text-gray-400 text-sm mb-2">Market Cap</div>
              <div className="text-white text-2xl font-semibold">
                ${(stockData.marketCap / 1e9).toFixed(2)}B
              </div>
            </div>
          )}

          {stockData.pe && (
            <div className="bg-gray-900 rounded-lg p-6">
              <div className="text-gray-400 text-sm mb-2">P/E Ratio</div>
              <div className="text-white text-2xl font-semibold">
                {stockData.pe.toFixed(2)}
              </div>
            </div>
          )}

          {stockData.dayHigh && (
            <div className="bg-gray-900 rounded-lg p-6">
              <div className="text-gray-400 text-sm mb-2">Day High</div>
              <div className="text-white text-2xl font-semibold">
                ${stockData.dayHigh.toFixed(2)}
              </div>
            </div>
          )}

          {stockData.dayLow && (
            <div className="bg-gray-900 rounded-lg p-6">
              <div className="text-gray-400 text-sm mb-2">Day Low</div>
              <div className="text-white text-2xl font-semibold">
                ${stockData.dayLow.toFixed(2)}
              </div>
            </div>
          )}

          {stockData.high52Week && (
            <div className="bg-gray-900 rounded-lg p-6">
              <div className="text-gray-400 text-sm mb-2">52 Week High</div>
              <div className="text-white text-2xl font-semibold">
                ${stockData.high52Week.toFixed(2)}
              </div>
            </div>
          )}

          {stockData.low52Week && (
            <div className="bg-gray-900 rounded-lg p-6">
              <div className="text-gray-400 text-sm mb-2">52 Week Low</div>
              <div className="text-white text-2xl font-semibold">
                ${stockData.low52Week.toFixed(2)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StockDetail;
