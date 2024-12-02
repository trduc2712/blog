import { query as _query } from '../config/db.js';

export const getAllCategories = () => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM categories';

    _query(query, (err, results) => {
      if (err) return reject({ error: 'Lỗi máy chủ' });
      resolve(results);
    });
  });
};

export const getCategoryCount = () => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT COUNT(*) AS count FROM categories';

    _query(query, (err, results) => {
      if (err) return reject(err);
      resolve(results[0].count);
    });
  });
};

export const getCategoriesWithPagination = (page, limit) => {
  return new Promise((resolve, reject) => {
    const offset = (page - 1) * limit;

    const query = `
      SELECT 
        categories.id, 
        categories.name, 
        categories.slug
      FROM categories
      LIMIT ? OFFSET ?
    `;

    _query(query, [limit, offset], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

export const deleteCategoryById = (id) => {
  return new Promise((resolve, reject) => {
    const query = 'DELETE FROM categories WHERE id = ?';

    _query(query, [id], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

export const updatePost = (
  id,
  title,
  content,
  userId,
  thumbnail,
  categorySlug,
  slug
) => {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE 
        posts 
      SET 
        title = ?, 
        content = ?, 
        user_id = ?,
        thumbnail = ?,
        category_slug = ?,
        slug = ?
      WHERE id = ?
    `;

    _query(
      query,
      [title, content, userId, thumbnail, categorySlug, slug, id],
      (err, results) => {
        if (err) return reject(err);
        resolve(results);
      }
    );
  });
};

export const getCategoryById = (id) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT
        id,
        name,
        slug
      FROM categories
      WHERE id = ?
    `;

    _query(query, [id], (err, results) => {
      if (err) return reject(err);
      resolve(results[0]);
    });
  });
};

export const updateCategory = (id, name, slug) => {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE 
        categories
      SET 
        name = ?,
        slug = ?
      WHERE id = ?
      `;

    _query(query, [name, slug, id], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

export const createCategory = (name, slug) => {
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO categories (name, slug) VALUES (?, ?)';

    _query(query, [name, slug], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};
