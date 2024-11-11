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