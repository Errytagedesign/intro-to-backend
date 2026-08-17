import express from 'express';
import postRouter from './routes/post.routes.js';
import userRouter from './routes/user.routes.js';

const app = express();

app.use(express.json());

app.use('/api/v1/posts', postRouter);
app.use('/api/v1/users', userRouter);

export default app;
