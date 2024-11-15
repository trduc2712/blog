const User = require('../models/user');

exports.updateUser = async (req, res) => {
  const id = req.params.id;
  const { username, password, name, avatar } = req.body;

  try {
    const result = await User.updateUser(id, username, password, name, avatar);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy người dùng' });
    }

    const updatedUser = await User.findUserByUsername(username);

    if (req.session.user.id == id) {
      req.session.user = {
        id: updatedUser.id,
        username: updatedUser.username,
        password: updatedUser.password,
        name: updatedUser.name,
        avatar: updatedUser.avatar,
      };
    } else {
      console.log('updatedUser.id: ', updatedUser.id);
      console.log('req.session.user.id: ', req.session.user.id);
    }

    res.json({
      message: 'Cập nhật thông tin người dùng thành công',
      user: updatedUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Lỗi máy chủ' });
  }
};

exports.getUserCount = async (req, res) => {
  try {
      const count = await Post.getUserCount();
      if (count == 0) {
          return res.status(404).json({ error: 'Không có người dùng nào' });
      }
      res.json({
          message: 'Lấy số lượng người dùng thành công',
          count: count
      });
  } catch (err) {
      res.status(500).json({ error: 'Lỗi máy chủ' });
  }
}

exports.getUserWithPagination = async (req, res) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);

  try {
      const totalUsers = await User.getUserCount();
      
      const users = await User.getUserWithPagination(page, limit);

      if (users.length === 0) {
          return res.status(404).json({ error: 'Không có người dùng nào' });
      }

      res.json({
          message: `Lấy các người dùng ở trang ${page} thành công`,
          users: users,
          totalUsers: totalUsers,
          currentPage: page,
          totalPages: Math.ceil(totalUsers / limit)
      });
  } catch (err) {
      res.status(500).json({ error: 'Lỗi máy chủ' });
  }
};

exports.deleteUserById = async (req, res) => {
  const userId = parseInt(req.params.id);
  if (!userId) {
      return res.status(400).json({ error: 'Thiếu ID của người dùng' });
  }
  try {
      await User.deleteUserById(userId);
      return res.status(200).json({ message: 'Xóa người dùng thành công' });
  } catch (err) {
      return res.status(500).json({ error: 'Lỗi máy chủ' });
  }  
}