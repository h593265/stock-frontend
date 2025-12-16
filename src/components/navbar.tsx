interface NavbarProps {
    onNavigate?: (page: 'stocks' | 'watchlist') => void;
    activePage?: 'stocks' | 'watchlist';
}

function navbar({ onNavigate, activePage = 'stocks' }: NavbarProps) {
    return (   
        <nav className="">
            <div className="">
                <div className="flex text-l font-bold text-white font-size-xl background-none ">
                    <div 
                        onClick={() => onNavigate?.('stocks')}
                        className={`font-semibold transition-colors px-4 py-2  hover:bg-gray-800 bg-transparent cursor-pointer select-none${
                            activePage === 'stocks' ?  ' text-black' : 'text-white hover:text-grey-100 cursor-pointer   '
                        }`}
                    >
                        Stocks
                    </div>
                    <div 
                        onClick={() => onNavigate?.('watchlist')}
                        className={`font-semibold transition-colors px-4 py-2 rounded-lg hover:bg-gray-800 select-none${
                            activePage === 'watchlist' ? ' text-black' : 'text-white hover:text-grey-100 cursor-pointer'
                        }`}
                    >
                        Watchlist
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default navbar;