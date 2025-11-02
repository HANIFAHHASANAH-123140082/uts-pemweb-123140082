import React, { useState } from 'react';

const SearchForm = ({ onFilter, onRefresh, loading }) => {
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter({
      minPrice: minPrice ? parseFloat(minPrice) : 0,
      maxPrice: maxPrice ? parseFloat(maxPrice) : Infinity
    });
  };

  const handleReset = () => {
    setMinPrice('');
    setMaxPrice('');
    onFilter({ minPrice: 0, maxPrice: Infinity });
  };

  return (
    <div className="search-form">
      <div className="refresh-section">
        <button 
          className="refresh-btn" 
          onClick={onRefresh}
          disabled={loading}
        >
          {loading ? '⏳ Loading...' : '🔄 Refresh Data'}
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <h3>Filter by Price Range</h3>
        <div className="filter-group">
          <div className="input-group">
            <label>Min Price ($)</label>
            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="0"
              min="0"
              step="0.01"
            />
          </div>
          <div className="input-group">
            <label>Max Price ($)</label>
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="No limit"
              min="0"
              step="0.01"
            />
          </div>
          <div className="button-group">
            <button type="submit" className="filter-btn">
              🔍 Apply Filter
            </button>
            <button type="button" className="reset-btn" onClick={handleReset}>
              ↺ Reset
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SearchForm;