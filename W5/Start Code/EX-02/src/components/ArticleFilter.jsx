import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:5000' });

export default function ArticleFilter() {
  const [articles, setArticles] = useState([]);
  const [journalists, setJournalists] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedJournalist, setSelectedJournalist] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [error, setError] = useState('');

  const fetchArticles = useCallback(async (journalistId = '', categoryId = '') => {
    setError('');

    try {
      let path = '/articles';

      if (journalistId && categoryId) {
        path = `/articles?journalistId=${journalistId}&categoryId=${categoryId}`;
      } else if (journalistId) {
        path = `/journalists/${journalistId}/articles`;
      } else if (categoryId) {
        path = `/categories/${categoryId}/articles`;
      }

      const res = await api.get(path);
      setArticles(res.data);
    } catch (err) {
      console.error(err);
      setError('Could not load articles. Make sure the API server is running');
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

  const fetchCategories = useCallback(async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (err) {
      console.error(err);
      setError('Could not load categories.');
    }
  }, []);

  useEffect(() => {
    fetchArticles();
    fetchJournalists();
    fetchCategories();
  }, [fetchArticles, fetchJournalists, fetchCategories]);

  const handleApplyFilters = () => {
    fetchArticles(selectedJournalist, selectedCategory);
  };

  const handleResetFilters = () => {
    setSelectedJournalist('');
    setSelectedCategory('');
    fetchArticles();
  };

  return (
    <div>
      <h2>Articles</h2>
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

        <label htmlFor="categoryFilter">Filter by Category:</label>
        <select
          id="categoryFilter"
          value={selectedCategory}
          onChange={event => setSelectedCategory(event.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
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
