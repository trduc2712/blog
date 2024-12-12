import {
  getAllUsers as getAllUsersFromModel,
  getUserCount as getUserCountFromModel,
  getUsersWithPagination as getUsersWithPaginationFromModel,
  deleteUserById as deleteUserByIdFromModel,
  getUserById as getUserByIdFromModel,
  updateUser as updateUserFromModel,
  getUserByUsername as getUserByUsernameFromModel,
  createUser as createUserFromModel,
} from '../models/user.js';

export const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);

    if (page && limit && (page <= 0 || limit <= 0)) {
      res.status(400).json({ error: 'Tham số không hợp lệ.' });
    }

    const userCount = await getUserCountFromModel();
    const users =
      page && limit
        ? await getUsersWithPaginationFromModel(page, limit)
        : await getAllUsersFromModel();

    if (users.length === 0) {
      return res.status(404).json({ error: 'Không có người dùng nào.' });
    }

    res.json({
      message:
        page && limit
          ? `Lấy các người dùng ở trang ${page} thành công.`
          : 'Lấy tất cả người dùng thành công.',
      users,
      meta: {
        userCount,
        currentPage: page || undefined,
        totalPages: page && limit ? Math.ceil(userCount / limit) : undefined,
      },
    });
  } catch (err) {
    console.log('Lỗi khi lấy người dùng: ', err);
    res.status(500).json({ error: 'Lỗi máy chủ.' });
  }
};

export const createUser = async (req, res) => {
  const { username, password, name, avatar, role } = req.body;

  if (!username || !password || !name) {
    return res.status(400).json({ error: 'Thiếu thông tin người dùng.' });
  }

  try {
    const userExists = await getUserByUsernameFromModel(username);

    if (userExists) {
      return res.status(400).json({ error: 'Người dùng đã tồn tại.' });
    }

    await createUserFromModel(username, password, name, avatar, role);
    return res.status(201).json({ message: 'Đăng ký thành công.' });
  } catch (err) {
    console.log('Lỗi khi tạo người dùng mới: ', err);
    return res.status(500).json({ error: 'Lỗi máy chủ.' });
  }
};

export const getUser = async (req, res) => {
  const id = req.params.id;

  if (!id || id <= 0) {
    return res.status(400).json({ error: 'Tham số không hợp lệ.' });
  }

  try {
    let user;

    if (!isNaN(id)) {
      user = await getUserByIdFromModel(id);
    } else {
      user = await getUserByUsernameFromModel(id);
    }

    if (!user) {
      return res.status(404).json({ error: 'Người dùng không tồn tại.' });
    }

    res.json({
      message: 'Lấy người dùng thành công.',
      user: user,
    });
  } catch (err) {
    console.log('Lỗi khi lấy người dùng: ', err);
    res.status(500).json({ error: 'Lỗi máy chủ.' });
  }
};

export const updateUser = async (req, res) => {
  const id = req.params.id;
  const { username, password, name, avatar, role } = req.body;

  if (!id || id <= 0) {
    return res.status(400).json({ error: 'Tham số không hợp lệ.' });
  }

  if (!username || !password || !name || !avatar || !role) {
    return res.status(400).json({ error: 'Thiếu thông tin người dùng.' });
  }

  try {
    const isCurrentUser =
      parseInt(req.session.user.id, 10) === parseInt(id, 10);

    const result = await updateUserFromModel(
      id,
      username,
      password,
      name,
      avatar,
      role
    );

    if (!result || result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy người dùng.' });
    }

    const updatedUser = await getUserByIdFromModel(id);

    if (isCurrentUser) {
      Object.assign(req.session.user, {
        username: updatedUser.username,
        password: updatedUser.password,
        name: updatedUser.name,
        avatar: updatedUser.avatar,
        role: updatedUser.role,
      });
    }

    res.json({
      message: 'Cập nhật người dùng thành công.',
      user: updatedUser,
    });
  } catch (err) {
    console.error('Lỗi khi cập nhật người dùng: ', err);
    res.status(500).json({ error: 'Lỗi máy chủ.' });
  }
};

export const deleteUser = async (req, res) => {
  const id = parseInt(req.params.id);

  if (!id || id <= 0) {
    return res.status(400).json({ error: 'Tham số không hợp lệ.' });
  }

  try {
    await deleteUserByIdFromModel(id);
    return res.status(204).send();
  } catch (err) {
    console.log('Lỗi khi xóa người dùng: ', err);
    return res.status(500).json({ error: 'Lỗi máy chủ.' });
  }
};
