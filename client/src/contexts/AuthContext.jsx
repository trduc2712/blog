import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/user`, { withCredentials: true });
        setUser(response.data.user);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUser();
  }, []);

  const handleSignUp = async (username, password, name) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/sign-up`, { username, password, name }, { withCredentials: true });
      setUser(response.data.user);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  const handleLogin = async (username, password) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/login`, { username, password }, { withCredentials: true });
      setUser(response.data.user);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.get(`${import.meta.env.VITE_API_URL}/logout`, { withCredentials: true });
      setUser(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, error, setError, handleSignUp, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  )
}