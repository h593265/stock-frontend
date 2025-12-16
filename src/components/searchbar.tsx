import { useState, useEffect } from 'react';

interface SearchbarProps {
    onSearch?: (symbol: string) => void;
    clearSearch?: boolean;
}

function searchBar({ onSearch, clearSearch }: SearchbarProps) {
    const [searchTerm, setSearchTerm] = useState('');

    // Clear searchbar when clearSearch prop changes
    useEffect(() => {
        if (clearSearch) {
            setSearchTerm('');
        }
    }, [clearSearch]);

    // Debounce search with 300ms delay
    useEffect(() => {
        const delayTimer = setTimeout(() => {
            if (onSearch) {
                onSearch(searchTerm.trim().toUpperCase());
            }
        }, 300);

        return () => clearTimeout(delayTimer);
    }, [searchTerm, onSearch]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
    };

    return (
        <div className="flex  items-center bg-white bg-opacity-20 backdrop-blur-md shadow-md rounded-3xl px-4 py-2 w-200 text-black">
            <input 
                type="text" 
                placeholder="Search stock symbol..." 
                className=" focus:outline-none text-black placeholder-gray-500 w-full"
                value={searchTerm}
                onChange={handleChange}
            />
        </div>  
    )
}

export default searchBar;