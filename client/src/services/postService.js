import axios from 'axios';

export const getAllPosts = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/posts`, { withCredentials: true });
    return response.data.posts;
  } catch(err) {
    console.log(err.response.data.error);
  }
};

export const createPost = async (title, content, userId, thumbnail, categorySlug, slug) => {
  try {
    await axios.post(`${import.meta.env.VITE_API_URL}/posts`, { title, content, userId, thumbnail, categorySlug, slug }, { withCredentials: true });
  } catch (err) {
    console.log(err.response.data.error);
  }
};

export const getPostCount = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/posts/count`, { withCredentials: true });
    return response.data.count;
  } catch (err) {
    console.log(err.response.data.error);
  }
}

export const getPostsWithPagination = async (page, limit) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/posts/paginate?page=${page}&limit=${limit}`, { withCredentials: true });
    return response.data.posts.length > 0 ? response.data.posts : null;
  } catch(err) {
    console.log(err.response.data.error);
  }
};

export const deletePostById = async (id) => {
  try {
    await axios.delete(`${import.meta.env.VITE_API_URL}/posts/${id}`, { withCredentials: true });
  } catch (err) {
    console.log(err.response.data.error);
  }
}

export const getPostById = async (id) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/posts/id/${id}`, { withCredentials: true });
    return response.data.post;
  } catch (err) {
    console.log(err.response.data.error);
  }
};

export const updatePost = async (id, title, content, userId, thumbnail, categorySlug, slug) => {
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