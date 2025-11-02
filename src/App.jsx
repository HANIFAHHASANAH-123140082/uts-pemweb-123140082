import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import SearchForm from './components/SearchForm';
import DataTable from './components/DataTable';
import DetailCard from './components/DetailCard';

const App = () => {
  const [cryptocurrencies, setCryptocurrencies] = useState([]);
  const [filteredCryptos, setFilteredCryptos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [priceFilter, setPriceFilter] = useState({ minPrice: 0, maxPrice: Infinity });

  useEffect(() => {
    fetchCryptocurrencies();
  }, []);

  useEffect(() => {
    filterCryptocurrencies();
  }, [cryptocurrencies, priceFilter]);

  const fetchCryptocurrencies = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false'
      );

      if (!response.ok) {
        throw new Error('Failed to fetch cryptocurrency data');
      }

      const data = await response.json();
      setCryptocurrencies(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch data');
      setCryptocurrencies([]);
    } finally {
      setLoading(false);
    }
  };

  const filterCryptocurrencies = () => {
    const filtered = cryptocurrencies.filter(
      (crypto) =>
        crypto.current_price >= priceFilter.minPrice &&
        crypto.current_price <= priceFilter.maxPrice
    );
    setFilteredCryptos(filtered);
  };

  const handleFilter = (filter) => {
    setPriceFilter(filter);
  };

  const handleRefresh = () => {
    fetchCryptocurrencies();
  };

  const handleSelectCoin = (coin) => {
    setSelectedCoin(coin);
  };

  const handleCloseDetail = () => {
    setSelectedCoin(null);
  };

  return (
    <div className="app">
      <Header />

      <main className="container">
        <SearchForm 
          onFilter={handleFilter} 
          onRefresh={handleRefresh}
          loading={loading}
        />

        {loading && <div className="loading">⏳ Loading cryptocurrency data...</div>}

        {error && <div className="error">❌ {error}</div>}

        {!loading && !error && (
          <>
            <DataTable 
              cryptocurrencies={filteredCryptos} 
              onSelectCoin={handleSelectCoin}
            />
          </>
        )}

        {selectedCoin && (
          <DetailCard 
            coin={selectedCoin} 
            onClose={handleCloseDetail}
          />
        )}
      </main>

      <footer className="footer">
        <p>Made with ❤️ by [Hanifah Hasanah] - NIM: 123140082</p>
        <p>Data provided by CoinGecko API</p>
      </footer>
    </div>
  );
};

export default App;