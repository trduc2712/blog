import axios from 'axios';

export const getAllPosts = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/posts`, {
      withCredentials: true,
    });
    return response.data.posts;
  } catch (err) {
    console.log(err.response.data.error);
  }
};

export const createPost = async (
  title,
  content,
  userId,
  thumbnail,
  categorySlug,
  slug
) => {
  try {
    await axios.post(
      `${import.meta.env.VITE_API_URL}/posts`,
      { title, content, userId, thumbnail, categorySlug, slug },
      { withCredentials: true }
    );
    return { success: true };
  } catch (err) {
    if (err.response?.status === 413) {
      return {
        success: false,
        errorMessage: err.response?.data.error,
      };
    }
    return {
      success: false,
      errorMessage: err.response?.data?.error || 'Có lỗi xảy ra',
    };
  }
};

export const getPostsCount = async (
  page,
  limit,
  keyword,
  time,
  alphabet,
  categorySlug,
  username
) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/posts?alphabet=${alphabet ? alphabet : ''}&time=${time ? time : ''}&keyword=${keyword ? keyword : ''}&page=${page}&limit=${limit}&categorySlug=${categorySlug ? categorySlug : ''}&username=${username ? username : ''}`,
      { withCredentials: true }
    );
    return response.data.meta.postsCount;
  } catch (err) {
    console.log(err.response.data.error);
  }
};

export const getPostsWithPagination = async (
  page,
  limit,
  keyword,
  time,
  alphabet,
  categorySlug,
  username
) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/posts?alphabet=${alphabet ? alphabet : ''}&time=${time ? time : ''}&keyword=${keyword ? keyword : ''}&page=${page}&limit=${limit}&categorySlug=${categorySlug ? categorySlug : ''}&username=${username ? username : ''}`,
      { withCredentials: true }
    );
    return response.data.posts.length > 0 ? response.data.posts : null;
  } catch (err) {
    console.log(err.response.data.error);
  }
};

export const deletePostById = async (id) => {
  try {
    await axios.delete(`${import.meta.env.VITE_API_URL}/posts/${id}`, {
      withCredentials: true,
    });
  } catch (err) {
    console.log(err.response.data.error);
  }
};

export const getPost = async (id) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/posts/${id}`,
      { withCredentials: true }
    );
    return response.data.post;
  } catch (err) {
    console.log(err.response.data.error);
  }
};

export const updatePost = async (
  id,
  title,
  content,
  userId,
  thumbnail,
  categorySlug,
  slug
) => {
  try {
    const response = await axios.put(
      `${import.meta.env.VITE_API_URL}/posts/${id}`,
      { title, content, userId, thumbnail, categorySlug, slug },
      { withCredentials: true }
    );

    return response.data.post;
  } catch (err) {
    console.log(err.response.data.error);
  }
};
