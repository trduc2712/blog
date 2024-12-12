import {
  getPostById as getPostByIdFromModel,
  getPostBySlug as getPostBySlugFromModel,
  createPost as createPostFromModel,
  getAllPosts as getAllPostsFromModel,
  getPostsCount as getPostsCountFromModel,
  getPostsWithPagination as getPostsWithPaginationFromModel,
  deletePostById as deletePostByIdFromModel,
  updatePost as updatePostFromModel,
  searchPostsByKeyword as searchPostsByKeywordFromModel,
  getFoundPostsCount as getFoundPostsCountFromModel,
  getPostsCountByCategory as getPostsCountByCategoryFromModel,
  getPostsCountByUsername as getPostsCountByUsernameFromModel,
} from '../models/post.js';

export const getPosts = async (req, res) => {
  try {
    let page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const keyword = req.query.keyword;
    const filter = req.query.filter;
    const categorySlug = req.query.categorySlug;
    const username = req.query.username;

    if (page <= 0 || limit <= 0) {
      return res.status(400).json({ error: 'Tham số không hợp lệ.' });
    }

    if (keyword) {
      try {
        const foundPosts = await searchPostsByKeywordFromModel(
          keyword,
          page,
          limit,
          filter
        );
        const foundPostsCount = await getFoundPostsCountFromModel(keyword);
        const totalPages = Math.ceil(foundPostsCount / limit);

        if (page > totalPages) {
          page = 1;
        }

        if (foundPosts.length === 0) {
          return res.status(404).json({ error: 'Không tìm thấy bài viết.' });
        }

        return res.json({
          message: `Tìm kiếm bài viết với từ khóa "${keyword}" thành công`,
          posts: foundPosts,
          meta: {
            foundPostsCount,
            currentPage: page,
            totalPages,
          },
        });
      } catch (err) {
        console.error(
          `Lỗi khi tìm kiếm bài viết với từ khóa "${keyword}": `,
          err
        );
        return res.status(500).json({ error: 'Lỗi máy chủ.' });
      }
    }

    let postCount;
    if (categorySlug) {
      postCount = await getPostsCountByCategoryFromModel(categorySlug);
    } else if (username) {
      postCount = await getPostsCountByUsernameFromModel(username);
    } else {
      postCount = await getPostsCountFromModel();
    }

    const totalPages = Math.ceil(postCount / limit);

    if (page > totalPages) {
      page = 1;
    }

    const posts =
      page && limit
        ? await getPostsWithPaginationFromModel(
            page,
            limit,
            filter,
            categorySlug,
            username
          )
        : await getAllPostsFromModel();

    if (posts.length === 0) {
      return res.status(404).json({ error: 'Không có bài viết nào.' });
    }

    return res.json({
      message:
        page && limit
          ? `Lấy các bài viết ở trang ${page} thành công.`
          : 'Lấy tất cả bài viết thành công.',
      posts,
      meta: {
        postCount,
        currentPage: page || undefined,
        totalPages: page && limit ? totalPages : undefined,
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
