import express from 'express';

const app = express();

app.use(express.json());

import postRouter from './routes/post.routes.js';

app.use('/api/v1/posts', postRouter);

export default app;
