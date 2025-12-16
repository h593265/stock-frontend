import { useState } from 'react'
import './App.css'
import Main from './pages/main'
import Header from './components/header'
import Footer from './components/footer'



function App() {
  type Page = 'stocks' | 'watchlist' | 'stockDetail';
  const [activePage, setActivePage] = useState<Page>('stocks')
  const [searchQuery, setSearchQuery] = useState('')
  const [clearSearch, setClearSearch] = useState(false)
  const [selectedStock, setSelectedStock] = useState<string | null>(null)
  const [previousPage, setPreviousPage] = useState<'stocks' | 'watchlist'>('stocks')

  const handleNavigation = (page: Page) => {
    setActivePage(page);
    setSearchQuery('');
    setClearSearch(true);
    // Reset clearSearch flag after clearing
    setTimeout(() => setClearSearch(false), 0);
  };

  const handleSearch = (symbol: string) => {
    setSearchQuery(symbol);
  };

  const handleSelectStock = (symbol: string) => {
    // Save the current page before navigating to stock detail
    if (activePage === 'stocks' || activePage === 'watchlist') {
      setPreviousPage(activePage);
    }
    setSelectedStock(symbol);
    setActivePage('stockDetail');
    setSearchQuery('');
    setClearSearch(true);
    setTimeout(() => setClearSearch(false), 0);
  };

  const handleBackToStocks = () => {
    setSelectedStock(null);
    setActivePage(previousPage);
    setSearchQuery('');
    setClearSearch(true);
    setTimeout(() => setClearSearch(false), 0);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-200">
      <Header 
        onSearch={handleSearch} 
        onNavigate={handleNavigation}
        activePage={activePage}
        clearSearch={clearSearch}
      />
      <Main 
        onSelectStock={handleSelectStock} 
        activePage={activePage}
        searchQuery={searchQuery}
        onClearSearch={() => setSearchQuery('')}
        selectedStock={selectedStock}
        onBack={handleBackToStocks}
        previousPage={previousPage}
      />
      <Footer/>
    </div>
  )
}

export default App
