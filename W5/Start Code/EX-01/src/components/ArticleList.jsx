import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:5000' });

export default function ArticleList() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    api.get('/articles')
      .then(res => setArticles(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <nav style={{ marginBottom: '20px' }}>
        <Link to="/" style={{ marginRight: '10px' }}>📄 View Articles</Link>
        <Link to="/add">➕ Add Article</Link>
      </nav>

      <h2>Articles</h2>
      {articles.length === 0 ? (
        <p>No articles found.</p>
      ) : (
        <ul>
          {articles.map(article => (
            <li key={article.id}>
              <strong>{article.title}</strong><br />
              <p>{article.content}</p>
              <small>
                By Journalist #{article.journalistId} | Category #{article.categoryId}
              </small>
              <br />
              <Link to={`/articles/${article.id}`} style={{ marginRight: '10px' }}>View</Link>
              <Link to={`/update/${article.id}`}>Update</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
