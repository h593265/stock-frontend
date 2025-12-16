import Navbar from './navbar' 
import Searchbar from './searchbar'
type Page = 'stocks' | 'watchlist' | 'stockDetail';

interface HeaderProps {
    onSearch?: (symbol: string) => void;
    onNavigate?: (page: Page) => void;
    activePage?: Page;
    clearSearch?: boolean;
}

function Header ({ onSearch, onNavigate, activePage, clearSearch }: HeaderProps) {
    const navbarActivePage = activePage === 'stockDetail' ? undefined : activePage;
    
    return (
        <div className="width-full bg-gray-800 shadow-md p-4 ">  

            <div className="flex  text-center flex flex-row items-center   justify-between  ">
                <div className="text-3xl font-bold text-white  text-left">Stockspot</div>
                <Searchbar onSearch={onSearch} clearSearch={clearSearch}/>
                <Navbar onNavigate={onNavigate} activePage={navbarActivePage}/>
            </div>
        </div>  

        
    );
}
export default Header;