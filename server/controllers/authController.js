import { getUserByUsername, getUserByCredentials } from '../models/user.js';

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const userExists = await getUserByUsername(username);
    if (!userExists) {
      return res.status(404).json({ error: 'Người dùng không tồn tại.' });
    }

    const user = await getUserByCredentials(username, password);
    if (user.length == 0) {
      return res.status(404).json({ error: 'Mật khẩu không chính xác.' });
    }

    req.session.user = {
      id: user[0].id,
      name: user[0].name,
      avatar: user[0].avatar,
      username: user[0].username,
      password: user[0].password,
      role: user[0].role,
    };

    res.json({
      message: 'Đăng nhập thành công.',
      user: user[0],
    });
  } catch (err) {
    console.log('Lỗi khi đăng nhập: ', err);
    res.status(500).json({ error: 'Lỗi máy chủ.' });
  }
};

export const getLoggedInUser = async (req, res) => {
  if (req.session.user) {
    return res.json({
      message: 'Lấy thông tin người dùng đã đăng nhập thành công.',
      user: req.session.user,
    });
  } else {
    return res.status(401).json({ error: 'Chưa đăng nhập.' });
  }
};

export const logout = async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Lỗi khi đăng xuất.' });
    }
    res.clearCookie('connect.sid');
    res.json({ message: 'Đăng xuất thành công.' });
  });
};
