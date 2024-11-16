import { createContext, useContext, useState, useEffect } from 'react';
import {
  getLoggedInUser as getLoggedInUserService,
  updateCurrentUser as updateCurrentUserService,
  signUp as signUpService,
  login as loginService,
  logout as logoutService
} from '../services/authService';

const AuthContext = createContext();

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  const getLoggedInUser = async () => {
    try {
      const loggedInUser = await getLoggedInUserService();
      setUser(loggedInUser);
    } catch (err) {
      console.log(err.error);
    }
  };

  useEffect(() => {
    getLoggedInUser();
  }, []);

  const updateCurrentUser = async (username, password, name, avatar) => {
    try {
      const updatedUser = await updateCurrentUserService(username, password, name, avatar, user.id);
      setUser(updatedUser);
      getLoggedInUser();
    } catch (err) {
      console.log(err.error);
    }
  };

  const signUp = async (username, password, name) => {
    try {
      await signUpService(username, password, name);
    } catch (err) {
      setError(err.error);
    }
  };

  const login = async (username, password) => {
    try {
      const loggedInUser = await loginService(username, password);
      setUser(loggedInUser);
      return true;
    } catch (err) {
      setError(err.error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await logoutService();
      setUser(null);
    } catch (err) {
      setError(err.error);
    }
  };

  return (
    <AuthContext.Provider
      value=
      {{ 
        user, 
        setUser, 
        error, 
        setError, 
        signUp, 
        login, 
        logout, 
        updateCurrentUser 
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
