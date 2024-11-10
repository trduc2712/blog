const db = require('../config/database');

exports.getAllPosts = () => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT 
                posts.id, 
                posts.title, 
                posts.image AS post_image, 
                posts.slug,
                posts.created_at,
                users.name AS user_name,
                users.username as username,
                users.avatar AS user_avatar,
                categories.name AS category_name
            FROM posts
            JOIN users ON posts.user_id = users.id
            JOIN categories ON posts.category_id = categories.id
        `;
        
        db.query(query, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

exports.getPostBySlug = (slug) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT
                posts.id,
                posts.title,
                posts.image,
                posts.content,
                posts.image AS post_image, 
                posts.slug,
                posts.created_at,
                posts.updated_at,
                users.name AS user_name,
                users.avatar AS user_avatar,
                categories.name AS category_name
            FROM posts
            JOIN users ON posts.user_id = users.id
            JOIN categories ON posts.category_id = categories.id
            WHERE posts.slug = ?
        `;
        
        db.query(query, [slug], (err, results) => {
            if (err) return reject(err);
            resolve(results[0]);
        });
    });
};
