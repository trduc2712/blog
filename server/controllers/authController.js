const User = require('../models/user');

exports.signUp = async (req, res) => {
  const { username, password, name } = req.body;
  const defaultAvatar = 'https://plus.unsplash.com/premium_photo-1666900440561-94dcb6865554?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cmFuZG9tfGVufDB8fDB8fHww';

  try {
      const userExists = await User.getUserByUsername(username);
      if (userExists.length > 0) {
          return res.status(400).json({ error: 'Tên người dùng đã tồn tại' });
      }
      await User.registerUser(username, password, name, defaultAvatar);
      return res.status(201).json({ message: 'Đăng ký thành công' });
  } catch (err) {
      return res.status(500).json({ error: 'Lỗi máy chủ' });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
      const user = await User.findUserByCredentials(username, password);
      if (user.length == 0) {
          return res.status(404).json({ error: 'Sai tài khoản hoặc mật khẩu' });
      }

      req.session.user = {
          id: user[0].id,
          name: user[0].name,
          avatar: user[0].avatar,
          username: user[0].username,
          password: user[0].password,
      };

      res.json({
          message: 'Đăng nhập thành công',
          user: user[0],
      });
  } catch (err) {
      res.status(500).json({ error: 'Lỗi máy chủ' });
  }
};

exports.getLoggedInUser  = (req, res) => {
  if (req.session.user) {
      return res.json({
          message: 'Lấy thông tin người dùng đã đăng nhập thành công',
          user: req.session.user,
      });
  } else {
      return res.status(401).json({ error: 'Chưa đăng nhập' });
  }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
      if (err) {
          return res.status(500).json({ error: 'Lỗi khi đăng xuất' });
      }
      res.clearCookie('connect.sid');
      res.json({ message: 'Đăng xuất thành công' });
  });
};
