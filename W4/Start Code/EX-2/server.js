import express from 'express';
import articleRoutes from './routes/articleRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import journalistRoutes from './routes/journalistRoutes.js';

const app = express();

app.use(express.json());

app.use('/articles', articleRoutes);
app.use('/categories', categoryRoutes);
app.use('/journalists', journalistRoutes);

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
