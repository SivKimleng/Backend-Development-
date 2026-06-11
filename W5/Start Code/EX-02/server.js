import express from 'express';

const app = express();
const PORT = 5000;

const journalists = [
  { id: 1, name: 'Sok Dara' },
  { id: 2, name: 'Chan Vicheka' },
  { id: 3, name: 'Kim Lina' },
];

const categories = [
  { id: 1, name: 'Campus' },
  { id: 2, name: 'Technology' },
  { id: 3, name: 'Sports' },
];

const articles = [
  {
    id: 1,
    title: 'Campus Workshop Opens',
    content: 'Students joined a backend development workshop this week.',
    journalistId: 1,
    categoryId: 1,
  },
  {
    id: 2,
    title: 'New API Released',
    content: 'The engineering team released a REST API for article management.',
    journalistId: 2,
    categoryId: 2,
  },
  {
    id: 3,
    title: 'Football Team Wins Final',
    content: 'The CADT university football team won the weekend tournament.',
    journalistId: 3,
    categoryId: 3,
  },
  {
    id: 4,
    title: 'Frontend Class Adds Filtering',
    content: 'Students practiced fetching filtered article data from API routes.',
    journalistId: 1,
    categoryId: 2,
  },
  {
    id: 5,
    title: 'Campus Club Fair Announced',
    content: 'New student clubs will present their activities next Friday.',
    journalistId: 2,
    categoryId: 1,
  },
];

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  return next();
});

const filterArticles = ({ journalistId, categoryId }) => {
  return articles.filter(article => {
    const matchesJournalist = journalistId
      ? article.journalistId === Number(journalistId)
      : true;
    const matchesCategory = categoryId
      ? article.categoryId === Number(categoryId)
      : true;

    return matchesJournalist && matchesCategory;
  });
};

app.get('/articles', (req, res) => {
  const { journalistId, categoryId } = req.query;
  res.json(filterArticles({ journalistId, categoryId }));
});

app.get('/journalists', (req, res) => {
  res.json(journalists);
});

app.get('/categories', (req, res) => {
  res.json(categories);
});

app.get('/journalists/:id/articles', (req, res) => {
  res.json(filterArticles({ journalistId: req.params.id }));
});

app.get('/categories/:id/articles', (req, res) => {
  res.json(filterArticles({ categoryId: req.params.id }));
});

app.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`);
});
