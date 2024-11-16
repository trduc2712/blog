const db = require('../config/database');

exports.createUser = (username, password, name, avatar) => {
  return new Promise((resolve, reject) => {
      const query = `INSERT INTO users (username, password, name, avatar, role) VALUES (?, ?, ?, ?, 'USER')`;
      db.query(query, [username, password, name, avatar], (err, results) => {
          if (err) return reject(err);
          resolve(results);
      });
  });
};

exports.findUserByUsername = (username) => {
  return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM users WHERE username = ?';

      db.query(query, [username], (err, results) => {
        if (err) return reject({ error: 'Lỗi máy chủ' });
        resolve(results[0]);
      });
  });
};

exports.findUserByCredentials = (username, password) => {
  return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
      db.query(query, [username, password], (err, results) => {
          if (err) return reject(err);
          resolve(results);
      });
  });
};

exports.updateCurrentUser = (id, username, password, name, avatar) => {
    return new Promise((resolve, reject) => {
        const query = 'UPDATE users SET username = ?, password = ?, name = ?, avatar = ? WHERE id = ?';
        db.query(query, [username, password, name, avatar, id], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

exports.getUserCount = () => {
  return new Promise((resolve, reject) => {
      const query = 'SELECT COUNT(*) AS count FROM users';
      db.query(query, (err, results) => {
          if (err) return reject(err);
          resolve(results[0].count);
      });
  });
};

exports.getUsersWithPagination = (page, limit) => {
  return new Promise((resolve, reject) => {
      const offset = (page - 1) * limit;
      const query = `
          SELECT 
              users.id, 
              users.username, 
              users.password, 
              users.name,
              users.avatar,
              users.role
          FROM users
          LIMIT ? OFFSET ?`;
      db.query(query, [limit, offset], (err, results) => {
          if (err) return reject(err);
          resolve(results);
      })
  })
}

exports.deleteUserById = (id) => {
  return new Promise((resolve, reject) => {
      const query = 'DELETE FROM users WHERE id = ?';
      db.query(query, [id], (err, results) => {
          if (err) return reject(err);
          resolve(results);
      });
  });
};

exports.getAllUsers = () => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM users';
  
        db.query(query, (err, results) => {
          if (err) return reject({ error: 'Lỗi máy chủ' });
          resolve(results);
        });
    });
};

exports.getUserById = (id) => {
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
        db.query(query, [id], (err, results) => {
            if (err) return reject(err);
            resolve(results[0]);
        });
    });
};

exports.updateUser = (id, username, password, name, avatar, role) => {
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
          WHERE id = ?`;
      db.query(query, [username, password, name, avatar, role, id], (err, results) => {
          if (err) return reject(err);
          resolve(results);
      });
  });
};