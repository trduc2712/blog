import axios from "axios";

export const getUsersWithPagination = async (page, limit) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/paginate?page=${page}&limit=${limit}`, { withCredentials: true });
    return response.data.users.length > 0 ? response.data.users : null;
  } catch(err) {
    if (err.response && err.response.data.error) {
      console.log(err.response.data.error);
    } else {
      console.log(err.message);
    }
  }
};

export const getUserCount = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/count`, { withCredentials: true });
    return response.data.count;
  } catch (err) {
    if (err.response && err.response.data.error) {
      console.log(err.response.data.error);
    } else {
      console.log(err.message);
    }
  }
};

export const deleteUserById = async (id) => {
  try {
    await axios.delete(`${import.meta.env.VITE_API_URL}/users/${id}`, { withCredentials: true });
  } catch (err) {
    if (err.response && err.response.data.error) {
      console.log(err.response.data.error);
    } else {
      console.log(err.message);
    }
  }
};