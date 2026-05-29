import { articles } from '../models/data.js';

const getAllArticles = (req, res) => {
    res.json(articles);
};

const getArticleById = (req, res) => {
    const articleId = parseInt(req.params.id);
    const article = articles.find(a => a.id === articleId);

    if (!article) return res.status(404).json({ error: 'Article not found' });

    res.json(article);
};

export {
    getAllArticles,
    getArticleById
};
