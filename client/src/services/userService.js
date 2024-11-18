import axios from 'axios';

export const getUsersWithPagination = async (page, limit) => {
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/users?page=${page}&limit=${limit}`,
            { withCredentials: true }
        );

        return response.data.users.length > 0 ? response.data.users : null;
    } catch (err) {
        console.log(err.response.data.error);
    }
};

export const getUserCount = async () => {
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/users`,
            { withCredentials: true }
        );

        return response.data.meta.userCount;
    } catch (err) {
        console.log(err.response.data.error);
    }
};

export const deleteUserById = async (id) => {
    try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/users/${id}`, {
            withCredentials: true,
        });
    } catch (err) {
        console.log(err.response.data.error);
    }
};

export const getUsers = async () => {
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/users`,
            { withCredentials: true }
        );

        return response.data.users;
    } catch (err) {
        console.log(err.response.data.error);
    }
};

export const getUserById = async (id) => {
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/users/${id}`,
            { withCredentials: true }
        );

        return response.data.user;
    } catch (err) {
        console.log(err.response.data.error);
    }
};

export const updateUser = async (
    id,
    username,
    password,
    name,
    avatar,
    role
) => {
    try {
        const response = await axios.put(
            `${import.meta.env.VITE_API_URL}/users/${id}`,
            { username, password, name, avatar, role },
            { withCredentials: true }
        );

        return response.data.user;
    } catch (err) {
        console.log(err.response.data.error);
    }
};
