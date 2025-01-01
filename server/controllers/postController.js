import {
  getPostById as getPostByIdFromModel,
  getPostBySlug as getPostBySlugFromModel,
  createPost as createPostFromModel,
  getAllPosts as getAllPostsFromModel,
  getPostsCount as getPostsCountFromModel,
  getPostsWithPagination as getPostsWithPaginationFromModel,
  deletePostById as deletePostByIdFromModel,
  updatePost as updatePostFromModel,
} from '../models/post.js';

export const getPosts = async (req, res) => {
  try {
    let { page, limit, keyword, time, alphabet, categorySlug, username } =
      req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    if (page <= 0 || limit <= 0) {
      return res.status(400).json({ error: 'Tham số không hợp lệ.' });
    }

    const postsCount = await getPostsCountFromModel(
      keyword,
      time,
      alphabet,
      categorySlug,
      username
    );

    const totalPages = Math.ceil(postsCount / limit);

    if (page > totalPages) {
      page = 1;
    }

    const posts =
      page && limit
        ? await getPostsWithPaginationFromModel(
            page,
            limit,
            keyword,
            time,
            alphabet,
            categorySlug,
            username
          )
        : await getAllPostsFromModel();

    if (posts.length === 0) {
      if (categorySlug) {
        return res.status(404).json({
          error: `Không có bài viết nào thuộc chủ đề ${categorySlug}`,
        });
      }
      return res.status(404).json({ error: 'Không có bài viết nào.' });
    }

    return res.json({
      message: 'Lấy các bài viết thành công.',
      posts,
      meta: {
        postsCount,
        currentPage: page,
        totalPages,
      },
    });
  } catch (err) {
    console.error('Lỗi khi lấy bài viết: ', err);
    return res.status(500).json({ error: 'Lỗi máy chủ.' });
  }
};

export const createPost = async (req, res) => {
  const { title, content, userId, thumbnail, categorySlug, slug } = req.body;

  if (!title || !content || !userId || !thumbnail || !categorySlug || !slug) {
    return res.status(400).json({ error: 'Thiếu thông tin bài viết.' });
  }

  try {
    const newPost = await createPostFromModel(
      title,
      content,
      userId,
      thumbnail,
      categorySlug,
      slug
    );

    return res.status(201).json({
      message: 'Tạo bài viết thành công.',
      post: newPost,
    });
  } catch (err) {
    console.log('Lỗi khi tạo bài viết mới: ', err);
    console.log('Mã lỗi: ', err.code);
    return res.status(500).json({ error: 'Lỗi máy chủ.' });
  }
};

export const getPost = async (req, res) => {
  const id = req.params.id;
  let post;

  try {
    if (!isNaN(id)) {
      post = await getPostByIdFromModel(id);
    } else {
      post = await getPostBySlugFromModel(id);
    }

    if (!post) {
      return res.status(404).json({ error: 'Bài viết không tồn tại.' });
    }

    res.json({
      message: 'Lấy bài viết thành công.',
      post: post,
    });
  } catch (err) {
    console.log('Lỗi khi lấy bài viết: ', err);
    res.status(500).json({ error: 'Lỗi máy chủ.' });
  }
};

export const updatePost = async (req, res) => {
  const id = req.params.id;
  const { title, content, userId, thumbnail, categorySlug, slug } = req.body;

  if (!id || id <= 0) {
    return res.status(400).json({ error: 'Tham số không hợp lệ' });
  }

  if (!title || !content || !userId || !thumbnail || !categorySlug || !slug) {
    return res.status(400).json({ error: 'Thiếu thông tin bài viết.' });
  }

  try {
    const result = await updatePostFromModel(
      id,
      title,
      content,
      userId,
      thumbnail,
      categorySlug,
      slug
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: 'Không tìm thấy bài viết.',
      });
    }

    const updatedPost = await getPostByIdFromModel(id);

    res.json({
      message: 'Cập nhật bài viết thành công.',
      post: updatedPost,
    });
  } catch (err) {
    console.error('Lỗi khi cập nhật bài viết: ', err);
    res.status(500).json({ error: 'Lỗi máy chủ.' });
  }
};

export const deletePost = async (req, res) => {
  const id = parseInt(req.params.id);

  if (!id || id <= 0) {
    return res.status(400).json({ error: 'Tham số không không hợp lệ.' });
  }

  try {
    await deletePostByIdFromModel(id);
    return res.status(204).send();
  } catch (err) {
    console.log('Lỗi khi xóa bài viết: ', err);
    return res.status(500).json({ error: 'Lỗi máy chủ.' });
  }
};
