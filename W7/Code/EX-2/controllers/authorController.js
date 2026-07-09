const { Author, Book } = require('../model');

const seedData = async (req, res) => {
  try {
    await Book.destroy({ where: {} });
    await Author.destroy({ where: {} });

    const authorsData = [
      {
        name: 'Ronan The Best',
        birthYear: 1990,
        books: [
          { title: 'Advanced Algorithm and Data Structure', publicationYear: 2010, pages: 400 },
          { title: 'Flutter Programming', publicationYear: 2020, pages: 300 },
        ],
      },
      {
        name: 'Kim Ang',
        birthYear: 1995,
        books: [
          { title: 'Web-Design Fundamentals', publicationYear: 2018, pages: 70 },
          { title: 'Full-Stack Development', publicationYear: 2021, pages: 380 },
        ],
      },
      {
        name: 'Hok Tim',
        birthYear: 2000,
        books: [
          { title: "Kid's Coding Guide", publicationYear: 2022, pages: 120 },
          { title: 'Database Basics', publicationYear: 2023, pages: 180 },
        ],
      },
    ];

    await Author.bulkCreate(authorsData, {
      include: [{ association: 'books' }],
    });

    res.status(201).json({ message: 'Database successfully seeded with sample authors and books!' });
  } catch (error) {
    console.error('Error seeding database:', error);
    res.status(500).json({ error: 'Failed to seed database', details: error.message });
  }
};

// Fetch all books from an author
const getAuthorBooks = async (req, res) => {
  try {
    const { id } = req.params;
    const author = await Author.findByPk(id, {
      include: {
        model: Book,
        as: 'books',
      },
    });

    if (!author) {
      return res.status(404).json({ error: `Author with ID ${id} not found` });
    }

    res.status(200).json({
      author: {
        id: author.id,
        name: author.name,
        birthYear: author.birthYear,
      },
      books: author.books,
    });
  } catch (error) {
    console.error('Error fetching author books:', error);
    res.status(500).json({ error: 'Failed to fetch books', details: error.message });
  }
};

// Create a new book for an existing author using .createBook()
const createAuthorBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, publicationYear, pages } = req.body;

    if (!title || !publicationYear || !pages) {
      return res.status(400).json({ error: 'Title, Publication Year, and Pages are required' });
    }

    const author = await Author.findByPk(id);
    if (!author) {
      return res.status(404).json({ error: `Author with ID ${id} not found` });
    }

    // Call .createBook() method
    const newBook = await author.createBook({
      title,
      publicationYear,
      pages,
    });

    res.status(201).json({
      message: 'Book created successfully',
      book: newBook,
    });
  } catch (error) {
    console.error('Error creating author book:', error);
    res.status(500).json({ error: 'Failed to create book', details: error.message });
  }
};

// List all authors along with their books
const getAllAuthors = async (req, res) => {
  try {
    const authors = await Author.findAll({
      include: {
        model: Book,
        as: 'books',
      },
    });
    res.status(200).json(authors);
  } catch (error) {
    console.error('Error fetching authors:', error);
    res.status(500).json({ error: 'Failed to fetch authors', details: error.message });
  }
};

module.exports = { seedData, getAuthorBooks, createAuthorBook, getAllAuthors };
