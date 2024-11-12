const express = require('express');
const cors = require('cors');
const session = require('express-session');

const app = express();
const port = 3000;

const postRoutes = require('./routes/postRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
}));

app.use(session({
    secret: 'My secret key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use(express.json({ limit: '10mb' }));

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);

app.listen(port, () => {
    console.log(`Máy chủ đang chạy tại: http://localhost:${port}`)
})