import axios from 'axios';

export const getAllCategories = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/categories`, { withCredentials: true });
    return response.data.categories;
  } catch (err) {
    throw new Error(err);
  }
};

export const getCategoryCount = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/categories/count`, { withCredentials: true });
    return response.data.count;
  } catch (err) {
    if (err.response && err.response.data.error) {
      console.log(err.response.data.error);
    } else {
      console.log(err.message);
    }
  }
}

export const getCategoriesWithPagination = async (page, limit) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/categories/paginate?page=${page}&limit=${limit}`, { withCredentials: true });
    return response.data.categories.length > 0 ? response.data.categories : null;
  } catch(err) {
    if (err.response && err.response.data.error) {
      console.log(err.response.data.error);
    } else {
      console.log(err.message);
    }
  }
};

export const deleteCategoryById = async (id) => {
  try {
    await axios.delete(`${import.meta.env.VITE_API_URL}/categories/${id}`, { withCredentials: true });
  } catch (err) {
    if (err.response && err.response.data.error) {
      console.log(err.response.data.error);
    } else {
      console.log(err.message);
    }
  }
}