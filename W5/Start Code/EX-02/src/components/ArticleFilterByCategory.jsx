import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:5000' });

export default function ArticleFilterByCategory() {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [error, setError] = useState('');

  const fetchArticles = useCallback(async (categoryId = '') => {
    setError('');

    try {
      const path = categoryId ? `/categories/${categoryId}/articles` : '/articles';
      const res = await api.get(path);
      setArticles(res.data);
    } catch (err) {
      console.error(err);
      setError('Could not load articles. Make sure the API server is running.');
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
    fetchCategories();
  }, [fetchArticles, fetchCategories]);

  const handleApplyFilters = () => {
    fetchArticles(selectedCategory);
  };

  const handleResetFilters = () => {
    setSelectedCategory('');
    fetchArticles();
  };

  return (
    <div>
      <h2>Articles by Category</h2>
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
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
