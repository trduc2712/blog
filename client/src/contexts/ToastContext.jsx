import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export const useToastContext = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const createToast = useCallback(({ type, title, message }) => {
    const newToast = { id: new Date().getTime(), type, title, message };
    setToasts((prevToasts) => [...prevToasts, newToast]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, createToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
};
