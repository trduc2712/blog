import { query as _query } from '../config/db.js';

export const getAllPosts = () => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        posts.id, 
        posts.title, 
        posts.thumbnail, 
        posts.slug,
        posts.created_at,
        users.name AS user_name,
        users.username as user_username,
        users.avatar AS user_avatar,
        categories.name AS category_name,
        categories.slug AS category_slug
      FROM posts
      JOIN users ON posts.user_id = users.id
      JOIN categories ON posts.category_slug = categories.slug
    `;

    _query(query, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

export const getPostBySlug = (slug) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT
          posts.id,
          posts.title,
          posts.thumbnail,
          posts.content,
          posts.slug,
          posts.created_at,
          posts.updated_at,
          users.name AS user_name,
          users.avatar AS user_avatar,
          categories.name AS category_name
      FROM posts
      JOIN users ON posts.user_id = users.id
      JOIN categories ON posts.category_slug = categories.slug
      WHERE posts.slug = ?
    `;

    _query(query, [slug], (err, results) => {
      if (err) return reject(err);
      resolve(results[0]);
    });
  });
};

export const createPost = (
  title,
  content,
  userId,
  thumbnail,
  categorySlug,
  slug
) => {
  return new Promise((resolve, reject) => {
    const query =
      'INSERT INTO posts (title, content, user_id, thumbnail, category_slug, slug) VALUES (?, ?, ?, ?, ?, ?)';

    _query(
      query,
      [title, content, userId, thumbnail, categorySlug, slug],
      (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results);
      }
    );
  });
};

export const getPostsCount = () => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT COUNT(*) AS count FROM posts';

    _query(query, (err, results) => {
      if (err) return reject(err);
      resolve(results[0].count);
    });
  });
};

export const getPostsCountByUsername = (username) => {
  return new Promise((resolve, reject) => {
    const query = `
    SELECT COUNT(*) AS count FROM posts
    JOIN users ON posts.user_id = users.id 
    WHERE username = '${username}'`;

    _query(query, (err, results) => {
      if (err) return reject(err);
      resolve(results[0].count);
    });
  });
};

export const getPostsWithPagination = (
  page,
  limit,
  filter,
  categorySlug,
  username
) => {
  return new Promise((resolve, reject) => {
    const offset = (page - 1) * limit;

    let categoryQuery = '';
    if (categorySlug)
      categoryQuery = `WHERE posts.category_slug = '${categorySlug}'`;

    let usernameQuery = '';
    if (username)
      usernameQuery = categoryQuery
        ? `AND users.username = '${username}'`
        : `WHERE users.username = '${username}'`;

    let filterQuery = '';
    switch (filter) {
      case 'alphaAsc':
        filterQuery = 'ORDER BY title ASC';
        break;
      case 'alphaDesc':
        filterQuery = 'ORDER BY title DESC';
        break;
      case 'newest':
        filterQuery = 'ORDER BY created_at DESC';
        break;
      case 'oldest':
        filterQuery = 'ORDER BY created_at ASC';
        break;
      default:
        break;
    }

    const query = `
      SELECT 
        posts.id, 
        posts.title, 
        posts.thumbnail AS thumbnail, 
        posts.content,
        posts.slug,
        posts.summary,
        posts.created_at,
        users.name AS user_name,
        users.username as user_username,
        users.avatar AS user_avatar,
        categories.name AS category_name,
        categories.slug AS category_slug
      FROM posts
      JOIN users ON posts.user_id = users.id
      JOIN categories ON posts.category_slug = categories.slug
      ${categoryQuery}
      ${usernameQuery} 
      ${filterQuery} 
      LIMIT ? OFFSET ?
    `;

    _query(query, [limit, offset], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

export const deletePostById = (id) => {
  return new Promise((resolve, reject) => {
    const query = 'DELETE FROM posts WHERE id = ?';

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

export const getPostById = (id) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT
        posts.id,
        posts.title,
        posts.thumbnail,
        posts.content,
        posts.slug,
        users.name AS user_name,
        categories.name AS category_name
      FROM posts
      JOIN users ON posts.user_id = users.id
      JOIN categories ON posts.category_slug = categories.slug
      WHERE posts.id = ?
    `;

    _query(query, [id], (err, results) => {
      if (err) return reject(err);
      resolve(results[0]);
    });
  });
};

export const searchPostsByKeyword = (keyword, page, limit, filter) => {
  return new Promise((resolve, reject) => {
    const offset = (page - 1) * limit;

    let filterQuery;
    switch (filter) {
      case 'alphaAsc':
        filterQuery = 'ORDER BY title ASC';
        break;
      case 'alphaDesc':
        filterQuery = 'ORDER BY title DESC';
        break;
      case 'newest':
        filterQuery = 'ORDER BY created_at DESC';
        break;
      case 'oldest':
        filterQuery = 'ORDER BY created_at ASC';
        break;
      default:
        filterQuery = '';
        break;
    }

    const query = `
       SELECT 
        posts.id, 
        posts.title, 
        posts.thumbnail AS thumbnail, 
        posts.slug,
        posts.created_at,
        users.name AS user_name,
        users.username as user_username,
        users.avatar AS user_avatar,
        categories.name AS category_name,
        categories.slug AS category_slug
      FROM posts
      JOIN users ON posts.user_id = users.id
      JOIN categories ON posts.category_slug = categories.slug
      WHERE title LIKE ?
      ${filterQuery} 
      LIMIT ? OFFSET ?
    `;

    const searchKeyword = `%${keyword}%`;

    _query(query, [searchKeyword, limit, offset], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

export const getFoundPostsCount = (keyword) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT COUNT(*) AS count FROM posts WHERE title LIKE ?';

    const searchKeyword = `%${keyword}%`;

    _query(query, [searchKeyword], (err, results) => {
      if (err) return reject(err);
      resolve(results[0].count);
    });
  });
};

export const getPostsCountByCategory = (category) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT COUNT(*) AS count FROM posts WHERE category_slug = ?`;

    _query(query, [category], (err, results) => {
      if (err) return reject(err);
      resolve(results[0].count);
    });
  });
};
