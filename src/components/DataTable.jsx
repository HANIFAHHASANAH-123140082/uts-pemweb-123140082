import React, { useState } from 'react';

const DataTable = ({ cryptocurrencies, onSelectCoin }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'market_cap_rank', direction: 'asc' });

  if (!cryptocurrencies || cryptocurrencies.length === 0) {
    return (
      <div className="no-data">
        <p>No cryptocurrencies found. Try adjusting your filter.</p>
      </div>
    );
  }

  const handleSort = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });
  };

  const sortedData = [...cryptocurrencies].sort((a, b) => {
    let aValue = a[sortConfig.key];
    let bValue = b[sortConfig.key];

    if (aValue === null || aValue === undefined) return 1;
    if (bValue === null || bValue === undefined) return -1;

    if (sortConfig.direction === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const formatPrice = (price) => {
    if (price >= 1) {
      return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else {
      return `$${price.toFixed(6)}`;
    }
  };

  const formatMarketCap = (cap) => {
    if (cap >= 1e12) return `$${(cap / 1e12).toFixed(2)}T`;
    if (cap >= 1e9) return `$${(cap / 1e9).toFixed(2)}B`;
    if (cap >= 1e6) return `$${(cap / 1e6).toFixed(2)}M`;
    return `$${cap.toLocaleString()}`;
  };

  return (
    <div className="data-table">
      <h3>📊 Cryptocurrency List</h3>
      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort('market_cap_rank')} className="sortable">
                Rank {sortConfig.key === 'market_cap_rank' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th>Coin</th>
              <th onClick={() => handleSort('current_price')} className="sortable">
                Price {sortConfig.key === 'current_price' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('market_cap')} className="sortable">
                Market Cap {sortConfig.key === 'market_cap' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('price_change_percentage_24h')} className="sortable">
                24h Change {sortConfig.key === 'price_change_percentage_24h' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((coin) => (
              <tr key={coin.id}>
                <td className="rank">#{coin.market_cap_rank}</td>
                <td className="coin-info">
                  <img src={coin.image} alt={coin.name} />
                  <div>
                    <strong>{coin.name}</strong>
                    <span className="symbol">{coin.symbol.toUpperCase()}</span>
                  </div>
                </td>
                <td className="price">{formatPrice(coin.current_price)}</td>
                <td>{formatMarketCap(coin.market_cap)}</td>
                <td>
                  <span className={`change ${coin.price_change_percentage_24h >= 0 ? 'positive' : 'negative'}`}>
                    {coin.price_change_percentage_24h >= 0 ? '▲' : '▼'} 
                    {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                  </span>
                </td>
                <td>
                  <button 
                    className="view-btn"
                    onClick={() => onSelectCoin(coin)}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;