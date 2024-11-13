import axios from 'axios';

export const getAllPosts = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/posts`, { withCredentials: true });
    return response.data.posts;
  } catch(err) {
    if (err.response && err.response.data.error) {
      console.log(err.response.data.error);
    } else {
      console.log(err.message);
    }
  }
};

export const createPost = async (title, content, userId, thumbnail, categorySlug, slug) => {
  try {
    await axios.post(`${import.meta.env.VITE_API_URL}/posts`, { title, content, userId, thumbnail, categorySlug, slug }, { withCredentials: true });
  } catch (err) {
    if (err.response && err.response.data.error) {
      console.log(err.response.data.error);
    } else {
      console.log(err.message);
    }
  }
};

export const getPostCount = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/posts/count`, { withCredentials: true });
    return response.data.count;
  } catch (err) {
    if (err.response && err.response.data.error) {
      console.log(err.response.data.error);
    } else {
      console.log(err.message);
    }
  }
}

export const getPostWithPagination = async (page, limit) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/posts/paginate?page=${page}&limit=${limit}`, { withCredentials: true });
    return response.data.posts;
  } catch(err) {
    if (err.response && err.response.data.error) {
      console.log(err.response.data.error);
    } else {
      console.log(err.message);
    }
  }
};