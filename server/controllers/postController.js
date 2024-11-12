const Post = require('../models/post');

exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.getAllPosts();
        if (posts.length === 0) {
            return res.status(404).json({ error: 'Không có bài viết nào' });
        }
        res.json({
            message: 'Lấy tất cả bài viết thành công',
            posts: posts
        });
    } catch (err) {
        res.status(500).json({ error: 'Lỗi máy chủ' });
    }
};

exports.getPostBySlug = async (req, res) => {
    const { slug } = req.params;
    try {
        const post = await Post.getPostBySlug(slug);
        if (!post) {
            return res.status(404).json({ error: 'Bài viết không tồn tại' });
        }
        res.json({
            message: 'Lấy bài viết thành công',
            post: post
        });
    } catch (err) {
        res.status(500).json({ error: 'Lỗi máy chủ' });
    }
};

exports.createPost = async (req, res) => {
    const { title, content, userId, thumbnail, categorySlug, slug } = req.body;
    
    if (!userId) {
        return res.status(400).json({ error: 'Thiếu user ID' });
    }
    if (!categorySlug) {
        return res.status(400).json({ error: 'Thiếu category slug' });
    }

    try {
        await Post.createPost(title, content, userId, thumbnail, categorySlug, slug);
        return res.status(201).json({ message: 'Tạo bài viết thành công' });
    } catch (err) {
        return res.status(500).json({ error: 'Lỗi máy chủ' });
    }     
  };
