import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Chart from 'chart.js/auto';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();

  const [cryptoData, setCryptoData] = useState({});
  const [financialData, setFinancialData] = useState({});
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [cryptoResponse, financialResponse, newsResponse] = await Promise.all([
          axios.get(
            'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd'
          ),
          axios.get('https://api.exchangerate-api.com/v4/latest/USD'),
          axios.get(
            'https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=YOUR_API_KEY'
          ),
        ]);
        setCryptoData(cryptoResponse.data);
        setFinancialData(financialResponse.data.rates);
        setNews(newsResponse.data.articles);
      } catch (err) {
        setError('Failed to fetch data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <h2>My App</h2>
        <nav>
          <ul>
            <li><a href="/dashboard">Dashboard</a></li>
            <li><a href="/settings">Settings</a></li>
            <li><a onClick={handleLogout} style={{ cursor: 'pointer' }}>Logout</a></li>
          </ul>
        </nav>
      </aside>
      <main className="main-content">
        <header className="main-header">
          <h1>Dashboard</h1>
        </header>
        {loading ? (
          <p>Loading data...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <section className="cards-container">
            <div className="card">
              <h3>Bitcoin (BTC)</h3>
              <p>${cryptoData.bitcoin?.usd?.toLocaleString() || 'N/A'}</p>
            </div>
            <div className="card">
              <h3>Ethereum (ETH)</h3>
              <p>${cryptoData.ethereum?.usd?.toLocaleString() || 'N/A'}</p>
            </div>
            <div className="card">
              <h3>Exchange Rate</h3>
              <p>1 USD = {financialData?.EUR?.toLocaleString() || 'N/A'} EUR</p>
            </div>
          </section>
        )}

        <section className="news-section">
          <h2>Latest News</h2>
          <ul>
            {news.slice(0, 5).map((article, index) => (
              <li key={index}>
                <a href={article.url} target="_blank" rel="noopener noreferrer">
                  {article.title}
                </a>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
