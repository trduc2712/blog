import axios from 'axios';

export const getLoggedInUser = async () => {
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/auth/me`,
            { withCredentials: true }
        );

        return response.data.user;
    } catch (err) {
        console.log(err.response.data.error);
    }
};

export const signUp = async (
    username,
    password,
    name,
    avatar,
    role,
    setError
) => {
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/users/`,
            { username, password, name, avatar, role },
            { withCredentials: true }
        );

        return response.data.message;
    } catch (err) {
        console.log(err.response.data.error);
        setError(err.response.data.error);
    }
};

export const login = async (username, password, setError) => {
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/auth/login`,
            { username, password },
            { withCredentials: true }
        );

        return response.data.user;
    } catch (err) {
        console.log(err.response.data.error);
        setError(err.response.data.error);
    }
};

export const logout = async () => {
    try {
        await axios.get(`${import.meta.env.VITE_API_URL}/auth/logout`, {
            withCredentials: true,
        });
    } catch (err) {
        console.log(err.response.data.error);
    }
};
