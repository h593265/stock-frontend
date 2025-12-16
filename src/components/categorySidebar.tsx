import { useState, useEffect } from 'react';

interface FilterOption {
    id: string;
    label: string;
    icon: string;
}

interface CategorySidebarProps {
    onFiltersChange?: (filters: { category: string; assetType: string }) => void;
}

function CategorySidebar({ onFiltersChange }: CategorySidebarProps) {
    const [activeCategory, setActiveCategory] = useState('active');
    const [activeAssetType, setActiveAssetType] = useState('stocks');

    useEffect(() => {
        if (onFiltersChange) {
            onFiltersChange({
                category: activeCategory,
                assetType: activeAssetType
            });
        }
    }, [activeCategory, activeAssetType]);

    const categories: FilterOption[] = [
        { id: 'active', label: 'Most Active', icon: '🔥' },
        { id: 'trending', label: 'Trending Now', icon: '🌟' },
        { id: 'gainers', label: 'Top Gainers', icon: '📈' },
        { id: 'losers', label: 'Top Losers', icon: '📉' },
        { id: '52weekGainers', label: '52 Week Gainers', icon: '🚀' },
        { id: '52weekLosers', label: '52 Week Losers', icon: '📊' },
    ];

    const assetTypes: FilterOption[] = [
        { id: 'all', label: 'All Assets', icon: '🌐' },
        { id: 'stocks', label: 'Stocks', icon: '📊' },
        { id: 'crypto', label: 'Crypto', icon: '₿' },
        { id: 'options', label: 'Options', icon: '📝' },
        { id: 'etf', label: 'ETFs', icon: '📦' },
        { id: 'forex', label: 'Forex', icon: '💱' },
    ];

    return (
        <div className=" bg-gray-800 bg-opacity-30 p-4">
            {/* Asset Type Dropdown */}
            <div className="mb-6">
                <h3 className="text-white font-bold text-xs mb-2 uppercase tracking-wide">
                    Asset Type
                </h3>
                <select
                    value={activeAssetType}
                    onChange={(e) => setActiveAssetType(e.target.value)}
                    className="w-full bg-gray-800 text-white px-3 py-2  border border-gray-700 focus:outline-none focus:border-blue-500 transition-colors"
                >
                    {assetTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                            {type.icon} {type.label}
                        </option>
                    ))}
                </select>
            </div>

          
            <div>
                <h3 className="text-white font-bold text-xs mb-3 uppercase tracking-wide">
                    Categories
                </h3>
                <div className="space-y-1">
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            onClick={() => setActiveCategory(category.id)}
                            className={`w-full text-left  transition-all duration-200 flex items-center cursor-pointer ${
                                activeCategory === category.id
                                    ? 'bg-purple-900 text-white '
                                    : 'text-gray-300 hover:bg-gray-800 hover:bg-opacity-50'
                            }`}
                        >
                            <span className="text-lg">{category.icon}</span>
                            <span className="text-sm font-medium">{category.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default CategorySidebar;
