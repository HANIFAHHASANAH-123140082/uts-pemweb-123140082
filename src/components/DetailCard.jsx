import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const DetailCard = ({ coin, onClose }) => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [portfolioAmount, setPortfolioAmount] = useState('');
  const [totalValue, setTotalValue] = useState(0);

  useEffect(() => {
    fetchChartData();
  }, [coin.id]);

  const fetchChartData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coin.id}/market_chart?vs_currency=usd&days=7`
      );
      const data = await response.json();
      
      const formattedData = data.prices.map(([timestamp, price]) => ({
        date: new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        price: price
      }));

      setChartData(formattedData);
    } catch (error) {
      console.error('Error fetching chart data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCalculate = (e) => {
    e.preventDefault();
    if (portfolioAmount && !isNaN(portfolioAmount) && portfolioAmount > 0) {
      const value = parseFloat(portfolioAmount) * coin.current_price;
      setTotalValue(value);
    }
  };

  const formatPrice = (price) => {
    if (price >= 1) {
      return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else {
      return `$${price.toFixed(6)}`;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="detail-card" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>✕</button>
        
        <div className="coin-header">
          <img src={coin.image} alt={coin.name} />
          <div>
            <h2>{coin.name}</h2>
            <span className="symbol">{coin.symbol.toUpperCase()}</span>
          </div>
        </div>

        <div className="coin-stats">
          <div className="stat-item">
            <span className="label">Current Price</span>
            <span className="value">{formatPrice(coin.current_price)}</span>
          </div>
          <div className="stat-item">
            <span className="label">Market Cap Rank</span>
            <span className="value">#{coin.market_cap_rank}</span>
          </div>
          <div className="stat-item">
            <span className="label">24h Change</span>
            <span className={`value ${coin.price_change_percentage_24h >= 0 ? 'positive' : 'negative'}`}>
              {coin.price_change_percentage_24h >= 0 ? '▲' : '▼'} 
              {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
            </span>
          </div>
          <div className="stat-item">
            <span className="label">24h High</span>
            <span className="value">{formatPrice(coin.high_24h)}</span>
          </div>
          <div className="stat-item">
            <span className="label">24h Low</span>
            <span className="value">{formatPrice(coin.low_24h)}</span>
          </div>
          <div className="stat-item">
            <span className="label">Total Volume</span>
            <span className="value">${(coin.total_volume / 1e9).toFixed(2)}B</span>
          </div>
        </div>

        <div className="chart-section">
          <h3>7-Day Price Chart</h3>
          {loading ? (
            <div className="chart-loading">Loading chart data...</div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => formatPrice(value)}
                  labelStyle={{ color: '#333' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#667eea" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="portfolio-calculator">
          <h3>💼 Portfolio Calculator</h3>
          <form onSubmit={handleCalculate}>
            <div className="calculator-input">
              <label>Amount of {coin.symbol.toUpperCase()}</label>
              <input
                type="number"
                value={portfolioAmount}
                onChange={(e) => setPortfolioAmount(e.target.value)}
                placeholder={`Enter amount of ${coin.symbol.toUpperCase()}`}
                min="0"
                step="0.00000001"
                required
              />
            </div>
            <button type="submit" className="calculate-btn">
              Calculate Total Value
            </button>
          </form>
          
          {totalValue > 0 && (
            <div className="calculation-result">
              <p>Total Portfolio Value:</p>
              <h2>${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
              <small>{portfolioAmount} {coin.symbol.toUpperCase()} × {formatPrice(coin.current_price)}</small>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailCard;