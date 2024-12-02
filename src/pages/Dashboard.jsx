import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Chart from 'chart.js/auto';
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();
  const chartRef = useRef(null); // Reference for the Chart.js instance

  // State management
  const [notifications, setNotifications] = useState([]);
  const [financialData, setFinancialData] = useState([]);
  const [cryptoData, setCryptoData] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredNews, setFilteredNews] = useState([]);
  const [news, setNews] = useState([]);
  const [tweets, setTweets] = useState([]);
  const [error, setError] = useState('');

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [newsResponse, financialResponse, cryptoResponse] = await Promise.all([
          axios.get(
            'https://newsapi.org/v2/top-headlines?country=ug&category=business&apiKey=1511466b366b45fd82015808536dd01c'
          ),
          axios.get('https://api.exchangerate-api.com/v4/latest/USD'),
          axios.get(
            'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=ugx'
          ),
        ]);

        setNews(newsResponse.data.articles);
        setFinancialData(financialResponse.data.rates);
        setCryptoData(cryptoResponse.data);
        setError(''); // Clear any existing errors
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
      }
    };

    fetchData();
  }, []);

  // Filter news based on search term
  useEffect(() => {
    if (searchTerm) {
      setFilteredNews(
        news.filter((article) =>
          article.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredNews(news);
    }
  }, [searchTerm, news]);

  // Display financial data on a chart
  useEffect(() => {
    if (financialData && Object.keys(financialData).length > 0) {
      if (chartRef.current) chartRef.current.destroy(); // Clean up previous instance

      const ctx = document.getElementById('financialChart').getContext('2d');
      chartRef.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: Object.keys(financialData),
          datasets: [
            {
              label: 'Exchange Rates (USD)',
              data: Object.values(financialData),
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
        },
      });
    }
  }, [financialData]);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <div className="header-buttons">
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <main>
        {error && <p className="error">{error}</p>}

        <section className="metrics">
          <div className="card">
            <h3>Bitcoin (BTC)</h3>
            <p>{cryptoData.bitcoin?.ugx?.toLocaleString() || 'N/A'} UGX</p>
          </div>
          <div className="card">
            <h3>Ethereum (ETH)</h3>
            <p>{cryptoData.ethereum?.ugx?.toLocaleString() || 'N/A'} UGX</p>
          </div>
        </section>

        <section className="financial-data">
          <h2>Exchange Rates</h2>
          {financialData && Object.keys(financialData).length > 0 ? (
            <canvas id="financialChart" width="400" height="200"></canvas>
          ) : (
            <p>Loading exchange rates...</p>
          )}
        </section>

        <section className="search-news">
          <h2>Search News</h2>
          <input
            type="text"
            placeholder="Search news..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search news"
          />
          <ul>
            {filteredNews.map((article, index) => (
              <li key={index}>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Read more about ${article.title}`}
                >
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
