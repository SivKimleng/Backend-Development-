import { categories } from '../models/data.js';

const getAllCategories = (req, res) => {
    res.json(categories);
};

const getCategoryById = (req, res) => {
    const categoryId = parseInt(req.params.id);
    const category = categories.find(c => c.id === categoryId);

    if (!category) return res.status(404).json({ error: 'Category not found' });

    res.json(category);
};

export {
    getAllCategories,
    getCategoryById
};
