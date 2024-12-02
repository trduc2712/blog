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
            <i
              className="bi bi-check-circle-fill"
              style={{ color: '#52c41a' }}
            ></i>
          )}
          {type == 'error' && (
            <i className="bi bi-x-circle-fill" style={{ color: '#ff4d4f' }}></i>
          )}
          {type == 'warning' && (
            <i
              className="bi bi-exclamation-circle-fill"
              style={{ color: '#faad14' }}
            ></i>
          )}
          {type == 'info' && (
            <i
              className="bi bi-info-circle-fill"
              style={{ color: '#1677ff' }}
            ></i>
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
