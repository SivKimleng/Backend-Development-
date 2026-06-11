import express from 'express';

const app = express();
const PORT = 5000;

let articles = [];

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  return next();
});

app.get('/articles', (req, res) => {
  const { journalistId, categoryId } = req.query;
  let filteredArticles = articles;

  if (journalistId) {
    filteredArticles = filteredArticles.filter(
      article => article.journalistId === Number(journalistId),
    );
  }

  if (categoryId) {
    filteredArticles = filteredArticles.filter(
      article => article.categoryId === Number(categoryId),
    );
  }

  res.json(filteredArticles);
});

app.get('/articles/:id', (req, res) => {
  const article = articles.find(item => item.id === Number(req.params.id));

  if (!article) {
    return res.status(404).json({ message: 'Article not found.' });
  }

  return res.json(article);
});

app.post('/articles', (req, res) => {
  const { title, content, journalistId, categoryId } = req.body;

  if (!title || !content || !journalistId || !categoryId) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const article = {
    id: articles.length ? Math.max(...articles.map(item => item.id)) + 1 : 1,
    title,
    content,
    journalistId: Number(journalistId),
    categoryId: Number(categoryId),
  };

  articles.push(article);
  return res.status(201).json(article);
});

app.put('/articles/:id', (req, res) => {
  const articleIndex = articles.findIndex(
    item => item.id === Number(req.params.id),
  );

  if (articleIndex === -1) {
    return res.status(404).json({ message: 'Article not found.' });
  }

  const { title, content, journalistId, categoryId } = req.body;

  if (!title || !content || !journalistId || !categoryId) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  articles[articleIndex] = {
    id: Number(req.params.id),
    title,
    content,
    journalistId: Number(journalistId),
    categoryId: Number(categoryId),
  };

  return res.json(articles[articleIndex]);
});

app.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`);
});
