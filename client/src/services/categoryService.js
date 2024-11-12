import axios from 'axios';

export const getAllCategories = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/categories`, { withCredentials: true });
    return response.data.categories;
  } catch (err) {
    throw new Error(err);
  }
};