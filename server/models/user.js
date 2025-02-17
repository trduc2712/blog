import { query as _query } from "../config/db.js";

export const createUser = (username, password, name, avatar, role) => {
  if (!role) role = "USER";

  return new Promise((resolve, reject) => {
    const query =
      "INSERT INTO users (username, password, name, avatar, role) VALUES (?, ?, ?, ?, ?)";

    _query(query, [username, password, name, avatar, role], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

export const getUserByUsername = (username) => {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM users WHERE username = ?";

    _query(query, [username], (err, results) => {
      if (err) return reject({ error: "Lỗi máy chủ" });
      resolve(results[0]);
    });
  });
};

export const getUserByCredentials = (username, password) => {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM users WHERE username = ? AND password = ?";

    _query(query, [username, password], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

export const updateUser = (id, username, password, name, avatar, role) => {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE 
        users 
      SET 
        username = ?, 
        password = ?, 
        name = ?,
        avatar = ?,
        role = ?
      WHERE id = ?
    `;

    _query(
      query,
      [username, password, name, avatar, role, id],
      (err, results) => {
        if (err) return reject(err);
        resolve(results);
      }
    );
  });
};

export const getUserCount = () => {
  return new Promise((resolve, reject) => {
    const query = "SELECT COUNT(*) AS count FROM users";

    _query(query, (err, results) => {
      if (err) return reject(err);
      resolve(results[0].count);
    });
  });
};

export const getUsersWithPagination = (page, limit) => {
  return new Promise((resolve, reject) => {
    const offset = (page - 1) * limit;
    const query = `
      SELECT 
        id, 
        username, 
        password, 
        name,
        avatar,
        role
      FROM users
      LIMIT ? OFFSET ?
    `;

    _query(query, [limit, offset], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

export const deleteUserById = (id) => {
  return new Promise((resolve, reject) => {
    const query = "DELETE FROM users WHERE id = ?";

    _query(query, [id], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

export const getAllUsers = () => {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM users";

    _query(query, (err, results) => {
      if (err) return reject({ error: "Lỗi máy chủ" });
      resolve(results);
    });
  });
};

export const getUserById = (id) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT
        id,
        username,
        password,
        name,
        avatar,
        role
      FROM users
      WHERE id = ?
    `;

    _query(query, [id], (err, results) => {
      if (err) return reject(err);
      resolve(results[0]);
    });
  });
};
