import express, { json } from 'express';
import cors from 'cors';
import session from 'express-session';

const app = express();
const port = 3000;

import postRoutes from './routes/postRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';

app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
  })
);

app.use(
  session({
    secret: 'My secret key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use(json({ limit: '10mb' }));

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);

app.listen(port, () => {
  console.log(`Máy chủ đang chạy tại: http://localhost:${port}`);
});
