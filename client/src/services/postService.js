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