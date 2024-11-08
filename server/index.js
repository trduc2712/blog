const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const session = require('express-session');

require('dotenv').config();

const app = express();
const port = 3000;

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

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.log('Kết nối thất bại, lỗi: ', err.stack);
        return;
    }
    console.log('Kết nối thành công');
})

app.use(express.json());

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Lỗi máy chủ'});
        }
        if (results.length == 0) {
            return res.status(404).json({ error: 'Sai tài khoản hoặc mật khẩu' });
        }
        const user = results[0];
        req.session.user = {
            id: user.id,
            name: user.name
        }
        res.json({
            message: 'Đăng nhập thành công',
            user: {
                id: user.id,
                name: user.name,
            }
        });
    })
})

app.get('/api/user', (req, res) => {
    if (req.session.user) {
        return res.json({
            message: 'Lấy thông tin người dùng thành công',
            user: req.session.user,
        });
    } else {
        return res.status(401).json({ error: 'Chưa đăng nhập' });
    }
});

app.get('/api/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Lỗi khi đăng xuất' });
        }
        res.clearCookie('connect.sid');
        res.json({ message: 'Đăng xuất thành công' });
    });
})

app.listen(port, () => {
    console.log(`Máy chủ đang chạy tại: http://localhost:${port}`)
})