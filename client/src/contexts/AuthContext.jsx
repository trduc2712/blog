import { createContext, useContext, useState, useEffect } from 'react';
import {
    getLoggedInUser as getLoggedInUserService,
    signUp as signUpService,
    login as loginService,
    logout as logoutService,
} from '../services/authService';

const AuthContext = createContext();

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);

    const getLoggedInUser = async () => {
        const loggedInUser = await getLoggedInUserService();
        setUser(loggedInUser);
    };

    useEffect(() => {
        getLoggedInUser();
    }, []);

    const signUp = async (username, password, name, avatar, role) => {
        const message = await signUpService(
            username,
            password,
            name,
            avatar,
            role,
            setError
        );
        if (message) {
            return true;
        } else {
            return false;
        }
    };

    const login = async (username, password) => {
        try {
            const loggedInUser = await loginService(
                username,
                password,
                setError
            );
            if (loggedInUser) {
                setUser(loggedInUser);
                return true;
            } else {
                return false;
            }
        } catch (err) {
            return false;
        }
    };

    const logout = async () => {
        await logoutService();
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                error,
                setError,
                signUp,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
