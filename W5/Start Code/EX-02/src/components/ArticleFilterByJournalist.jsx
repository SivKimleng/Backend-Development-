import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:5000' });

export default function ArticleFilterByJournalist() {
  const [articles, setArticles] = useState([]);
  const [journalists, setJournalists] = useState([]);
  const [selectedJournalist, setSelectedJournalist] = useState('');
  const [error, setError] = useState('');

  const fetchArticles = useCallback(async (journalistId = '') => {
    setError('');

    try {
      const path = journalistId ? `/journalists/${journalistId}/articles` : '/articles';
      const res = await api.get(path);
      setArticles(res.data);
    } catch (err) {
      console.error(err);
      setError('Could not load articles. Make sure the API server is running.');
    }
  }, []);

  const fetchJournalists = useCallback(async () => {
    try {
      const res = await api.get('/journalists');
      setJournalists(res.data);
    } catch (err) {
      console.error(err);
      setError('Could not load journalists.');
    }
  }, []);

  useEffect(() => {
    fetchArticles();
    fetchJournalists();
  }, [fetchArticles, fetchJournalists]);

  const handleApplyFilters = () => {
    fetchArticles(selectedJournalist);
  };

  const handleResetFilters = () => {
    setSelectedJournalist('');
    fetchArticles();
  };

  return (
    <div>
      <h2>Articles by Journalist</h2>
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <label htmlFor="journalistFilter">Filter by Journalist:</label>
        <select
          id="journalistFilter"
          value={selectedJournalist}
          onChange={event => setSelectedJournalist(event.target.value)}
        >
          <option value="">All Journalists</option>
          {journalists.map(journalist => (
            <option key={journalist.id} value={journalist.id}>
              {journalist.name}
            </option>
          ))}
        </select>

        <button onClick={handleApplyFilters}>Apply Filters</button>
        <button onClick={handleResetFilters}>Reset Filters</button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {articles.length === 0 ? (
        <p>No articles found.</p>
      ) : (
        <ul>
          {articles.map(article => (
            <li key={article.id}>
              <strong>{article.title}</strong> <br />
              <p>{article.content}</p>
              <small>
                By Journalist #{article.journalistId} | Category #{article.categoryId}
              </small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
