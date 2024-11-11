import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  const fetchUser = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/auth/get-logged-in-user`, { withCredentials: true });
      setUser(response.data.user);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const updateUser = async (username, password, name, avatar) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/users/update-user/${user.id}`,
        { username, password, name, avatar },
        { withCredentials: true }
      );

      setUser(response.data.user);
      fetchUser();
      console.log('Thông tin người dùng đã được cập nhật trong AuthContext');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSignUp = async (username, password, name) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/sign-up`, { username, password, name }, { withCredentials: true });
      setUser(response.data.user);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  const handleLogin = async (username, password) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, { username, password }, { withCredentials: true });
      setUser(response.data.user);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.get(`${import.meta.env.VITE_API_URL}/auth/logout`, { withCredentials: true });
      setUser(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, error, setError, handleSignUp, handleLogin, handleLogout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}
