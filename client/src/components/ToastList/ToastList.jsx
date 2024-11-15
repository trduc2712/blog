import styles from './ToastList.module.scss';
import Toast from '../Toast/Toast';
import { useEffect } from 'react';
import { useToastContext } from '../../contexts/ToastContext';

const ToastList = () => {
  const { toasts, removeToast } = useToastContext();

  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => {
        removeToast(toasts[0].id);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [toasts, removeToast]);

  return (
    <div className={styles.container}>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          title={toast.title}
          message={toast.message}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  )
}

export default ToastList;