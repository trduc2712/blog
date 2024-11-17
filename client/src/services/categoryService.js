import axios from 'axios';

export const getAllCategories = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/categories`, { withCredentials: true });
    return response.data.categories;
  } catch (err) {
    console.log(err.response.data.error);
  }
};

export const getCategoryCount = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/categories/count`, { withCredentials: true });
    return response.data.count;
  } catch (err) {
    console.log(err.response.data.error);
    if (err.response && err.response.data.error) {
      console.log(err.response.data.error);
    } else {
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
    }
  }
};

export const deleteCategoryById = async (id) => {
  try {
    await axios.delete(`${import.meta.env.VITE_API_URL}/categories/${id}`, { withCredentials: true });
  } catch (err) {
    console.log(err.response.data.error);
    if (err.response && err.response.data.error) {
      console.log(err.response.data.error);
    } else {
    }
  }
};


export const getCategoryById = async (id) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/categories/${id}`, { withCredentials: true });
    return response.data.category;
  } catch (err) {
    console.log(err.response.data.error);
  }
};

export const updateCategory = async (id, name, slug) => {
  try {
    const response = await axios.put(
      `${import.meta.env.VITE_API_URL}/categories/${id}`,
      { id, name, slug },
      { withCredentials: true }
    );

    return response.data.category;
  } catch (err) {
    console.log(err.response.data.error);
  }
};

export const createCategory = async (name, slug) => {
  try {
    await axios.post(`${import.meta.env.VITE_API_URL}/categories`, { name, slug }, { withCredentials: true });
  } catch (err) {
    console.log(err.response.data.error);
  }
};