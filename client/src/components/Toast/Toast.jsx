import styles from './Toast.module.scss';

const Toast = ({ id, type, title, message, onClose }) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {type == 'success' && (
            <i className={`bi bi-check-circle-fill ${styles.success}`}></i>
          )}
          {type == 'error' && (
            <i className={`bi bi-x-circle-fill ${styles.error}`}></i>
          )}
          {type == 'warning' && (
            <i
              className={`bi bi-exclamation-circle-fill ${styles.warning}`}
            ></i>
          )}
          {type == 'info' && (
            <i className={`bi bi-info-circle-fill ${styles.info}`}></i>
          )}
          <h4 style={{ marginLeft: '5px' }}>{title}</h4>
        </div>
        <div className={styles.close} onClick={onClose}>
          <i className="bi bi-x"></i>
        </div>
      </div>
      <div className={styles.body}>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default Toast;
