import express from 'express';
import linksRoutes from './routes/links.routes.js';
import { redirectLink } from './controllers/redirect.controller.js';

const app = express();

app.use(express.json());

app.use('/links', linksRoutes);

app.get('/', (req, res) => {
    res.json({
        message: 'URL Shortener API is running'
    });
});

app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok'
    });
});

app.get('/:code', redirectLink);

export default app;