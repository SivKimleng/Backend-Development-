import { journalists } from '../models/data.js';

const getAllJournalists = (req, res) => {
    res.json(journalists);
};

const getJournalistById = (req, res) => {
    const journalistId = parseInt(req.params.id);
    const journalist = journalists.find(j => j.id === journalistId);

    if (!journalist) return res.status(404).json({ error: 'Journalist not found' });

    res.json(journalist);
};

export {
    getAllJournalists,
    getJournalistById
};
