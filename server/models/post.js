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

export const getPostsCount = (
  keyword,
  time,
  alphabet,
  categorySlug,
  username
) => {
  return new Promise((resolve, reject) => {
    let query = 'SELECT COUNT(*) AS count FROM posts';
    let queryParams = [];

    const whereClauses = [];
    let orderQuery = '';

    if (keyword) {
      whereClauses.push('title LIKE ?');
      queryParams.push(`%${keyword}%`);
    }
    if (categorySlug) {
      whereClauses.push('category_slug = ?');
      queryParams.push(categorySlug);
    }
    if (username) {
      query += ' JOIN users ON posts.user_id = users.id';
      whereClauses.push('users.username = ?');
      queryParams.push(username);
    }
    if (time) {
      switch (time) {
        case 'today':
          whereClauses.push(
            'created_at >= CURDATE() AND created_at < CURDATE() + INTERVAL 1 DAY'
          );
          break;
        case 'this-week':
          whereClauses.push(
            `created_at >= CURDATE() - INTERVAL WEEKDAY(CURDATE()) DAY 
           AND created_at < CURDATE() - INTERVAL WEEKDAY(CURDATE()) DAY + INTERVAL 7 DAY`
          );
          break;
        case 'this-month':
          whereClauses.push(
            `created_at >= DATE_FORMAT(CURDATE(), '%Y-%m-01') 
           AND created_at < DATE_FORMAT(CURDATE() + INTERVAL 1 MONTH, '%Y-%m-01')`
          );
          break;
        case 'oldest':
          orderQuery = ' ORDER BY created_at DESC';
          break;
        case 'newest':
          orderQuery = ' ORDER BY created_at ASC';
          break;
        default:
          break;
      }
    }

    if (alphabet) {
      switch (alphabet) {
        case 'asc':
          orderQuery = ' ORDER BY title ASC';
          break;
        case 'desc':
          orderQuery = ' ORDER BY title DESC';
          break;
        default:
          break;
      }
    }

    if (whereClauses.length > 0) {
      query += ` WHERE ${whereClauses.join(' AND ')}`;
    }

    if (orderQuery) {
      query += orderQuery;
    }

    _query(query, queryParams, (err, results) => {
      if (err) return reject(err);
      resolve(results[0].count);
    });
  });
};

export const getPostsWithPagination = (
  page,
  limit,
  keyword,
  time,
  alphabet,
  categorySlug,
  username
) => {
  return new Promise((resolve, reject) => {
    const offset = (page - 1) * limit;

    let whereClauses = [];
    let orderQuery = '';

    if (keyword) {
      whereClauses.push('posts.title LIKE ?');
    }
    if (categorySlug) {
      whereClauses.push('posts.category_slug = ?');
    }
    if (username) {
      whereClauses.push('users.username = ?');
    }

    if (time) {
      switch (time) {
        case 'today':
          whereClauses.push(
            'posts.created_at >= CURDATE() AND posts.created_at < CURDATE() + INTERVAL 1 DAY'
          );
          break;
        case 'this-week':
          whereClauses.push(
            'posts.created_at >= CURDATE() - INTERVAL WEEKDAY(CURDATE()) DAY AND ' +
              'posts.created_at < CURDATE() - INTERVAL WEEKDAY(CURDATE()) DAY + INTERVAL 7 DAY'
          );
          break;
        case 'this-month':
          whereClauses.push(
            'posts.created_at >= DATE_FORMAT(CURDATE(), "%Y-%m-01") AND ' +
              'posts.created_at < DATE_FORMAT(CURDATE() + INTERVAL 1 MONTH, "%Y-%m-01")'
          );
          break;
        case 'oldest':
          orderQuery = ' ORDER BY created_at ASC';
          break;
        case 'newest':
          orderQuery = ' ORDER BY created_at DESC';
          break;
        default:
          break;
          break;
      }
    }

    if (alphabet) {
      switch (alphabet) {
        case 'asc':
          orderQuery = ' ORDER BY posts.title ASC';
          break;
        case 'desc':
          orderQuery = ' ORDER BY posts.title DESC';
          break;
        default:
          break;
      }
    }

    const whereQuery =
      whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

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
      ${whereQuery}
      ${orderQuery}
      LIMIT ? OFFSET ?
    `;

    const queryValues = [];
    if (keyword) queryValues.push(`%${keyword}%`);
    if (categorySlug) queryValues.push(categorySlug);
    if (username) queryValues.push(username);
    queryValues.push(limit, offset);

    _query(query, queryValues, (err, results) => {
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
//   return new Promise((resolve, reject) => {
//     const offset = (page - 1) * limit;

//     let filterQuery;
//     switch (filter) {
//       case 'alphaAsc':
//         filterQuery = 'ORDER BY title ASC';
//         break;
//       case 'alphaDesc':
//         filterQuery = 'ORDER BY title DESC';
//         break;
//       case 'newest':
//         filterQuery = 'ORDER BY created_at DESC';
//         break;
//       case 'oldest':
//         filterQuery = 'ORDER BY created_at ASC';
//         break;
//       default:
//         filterQuery = '';
//         break;
//     }

//     const query = `
//        SELECT
//         posts.id,
//         posts.title,
//         posts.thumbnail AS thumbnail,
//         posts.slug,
//         posts.created_at,
//         users.name AS user_name,
//         users.username as user_username,
//         users.avatar AS user_avatar,
//         categories.name AS category_name,
//         categories.slug AS category_slug
//       FROM posts
//       JOIN users ON posts.user_id = users.id
//       JOIN categories ON posts.category_slug = categories.slug
//       WHERE title LIKE ?
//       ${filterQuery}
//       LIMIT ? OFFSET ?
//     `;

//     const searchKeyword = `%${keyword}%`;

//     _query(query, [searchKeyword, limit, offset], (err, results) => {
//       if (err) return reject(err);
//       resolve(results);
//     });
//   });
// };
