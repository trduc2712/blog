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

exports.getCategoryCount = () => {
  return new Promise((resolve, reject) => {
      const query = 'SELECT COUNT(*) AS count FROM categories';
      db.query(query, (err, results) => {
          if (err) return reject(err);
          resolve(results[0].count);
      });
  });
};

exports.getCategoriesWithPagination = (page, limit) => {
  return new Promise((resolve, reject) => {
      const offset = (page - 1) * limit;
      const query = `
          SELECT 
              categories.id, 
              categories.name, 
              categories.slug
          FROM categories
          LIMIT ? OFFSET ?`;
      db.query(query, [limit, offset], (err, results) => {
          if (err) return reject(err);
          resolve(results);
      })
  })
}

exports.deleteCategoryById = (id) => {
  return new Promise((resolve, reject) => {
      const query = 'DELETE FROM categories WHERE id = ?';
      db.query(query, [id], (err, results) => {
          if (err) return reject(err);
          resolve(results);
      });
  });
};