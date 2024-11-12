const db = require('../config/database');

exports.createUser = (username, password, name, avatar) => {
  return new Promise((resolve, reject) => {
      const query = 'INSERT INTO users (username, password, name, avatar) VALUES (?, ?, ?, ?)';
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

exports.updateUser = (id, username, password, name, avatar) => {
    return new Promise((resolve, reject) => {
        const query = 'UPDATE users SET username = ?, password = ?, name = ?, avatar = ? WHERE id = ?';
        db.query(query, [username, password, name, avatar, id], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};