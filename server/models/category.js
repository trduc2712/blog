const db = require('../config/database');

exports.getAllCategories = () => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM categories';

    db.query(query, (err, results) => {
      if (err) return reject({ error: 'Lỗi máy chủ' });
      resolve(results);
    });
  });
};