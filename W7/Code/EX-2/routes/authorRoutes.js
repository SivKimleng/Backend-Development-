const express = require('express');
const router = express.Router();
const authorController = require('../controllers/authorController');

router.post('/seed', authorController.seedData);

router.get('/', authorController.getAllAuthors);

router.get('/:id/books', authorController.getAuthorBooks);
router.post('/:id/books', authorController.createAuthorBook);

module.exports = router;
