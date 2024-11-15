import styles from './Toast.module.scss';

const Toast = ({ id, title, message, onClose }) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h4>{title}</h4>
        <button className={styles.closeButton} onClick={onClose}>
          <i className="bi bi-x"></i>
        </button>
      </div>
      <div className={styles.body}>
        {message}
      </div>
    </div>
  )
}

export default Toast;