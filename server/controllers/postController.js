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
    const slug = req.params.slug;
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

    try {
        await Post.createPost(title, content, userId, thumbnail, categorySlug, slug);
        return res.status(201).json({ message: 'Tạo bài viết thành công' });
    } catch (err) {
        return res.status(500).json({ error: 'Lỗi máy chủ' });
    }     
};

exports.getPostCount = async (req, res) => {
    try {
        const count = await Post.getPostCount();
        if (count == 0) {
            return res.status(404).json({ error: 'Không có bài viết nào' });
        }
        res.json({
            message: 'Lấy số lượng bài viết thành công',
            count: count
        });
    } catch (err) {
        res.status(500).json({ error: 'Lỗi máy chủ' });
    }
}

exports.getPostsWithPagination = async (req, res) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);

    try {
        const totalPosts = await Post.getPostCount();
        
        const posts = await Post.getPostsWithPagination(page, limit);

        if (posts.length === 0) {
            return res.status(404).json({ error: 'Không có bài viết nào' });
        }
  
        res.json({
            message: `Lấy các bài viết ở trang ${page} thành công`,
            posts: posts,
            totalPosts: totalPosts,
            currentPage: page,
            totalPages: Math.ceil(totalPosts / limit)
        });
    } catch (err) {
        res.status(500).json({ error: 'Lỗi máy chủ' });
    }
};

exports.deletePostById = async (req, res) => {
    const postId = parseInt(req.params.id);
    if (!postId) {
        return res.status(400).json({ error: 'Thiếu ID của bài viết' });
    }
    try {
        await Post.deletePostById(postId);
        return res.status(200).json({ message: 'Xóa bài viết thành công' });
    } catch (err) {
        return res.status(500).json({ error: 'Lỗi máy chủ' });
    }  
}

exports.getPostById = async (req, res) => {
    const id = req.params.id;
    
    try {
        const post = await Post.getPostById(id);
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

exports.updatePost = async (req, res) => {
    const id = req.params.id;

    console.log('id la: ', id);
    
    const { title, content, userId, thumbnail, categorySlug, slug } = req.body; 
  
    try {
        const result = await Post.updatePost(id, title, content, userId, thumbnail, categorySlug, slug);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Không tìm thấy bài viết' });
        }
    
        const updatedPost = await Post.getPostById(id);
        res.json({
            message: 'Cập nhật thông tin bài viết thành công',
            post: updatedPost,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Lỗi máy chủ' });
    }
};
  