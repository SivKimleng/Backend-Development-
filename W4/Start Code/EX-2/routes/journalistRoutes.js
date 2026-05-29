import express from 'express';
import {
    getAllJournalists,
    getJournalistById
} from '../controllers/journalistController.js';

const router = express.Router();

router.get('/', getAllJournalists);
router.get('/:id', getJournalistById);

export default router;
