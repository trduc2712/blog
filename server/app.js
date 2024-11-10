const express = require('express');
const cors = require('cors');
const session = require('express-session');

const app = express();
const port = 3000;

const postRoutes = require('./routes/postRoutes');
const authRoutes = require('./routes/authRoutes');

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
}));

app.use(session({
    secret: 'My secret key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

app.listen(port, () => {
    console.log(`Máy chủ đang chạy tại: http://localhost:${port}`)
})