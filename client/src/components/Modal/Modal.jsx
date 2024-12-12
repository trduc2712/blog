import styles from './Modal.module.scss';

const Modal = ({
  isOpen,
  title,
  onClose,
  cancelLabel,
  confirmLabel,
  message,
  onConfirm,
  onCancel,
  type,
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            {type == 'success' && (
              <i className={`bi bi-check-circle-fill ${styles.success}`}></i>
            )}
            {type == 'destructive' && (
              <i
                className={`bi bi-exclamation-circle-fill ${styles.destructive}`}
              ></i>
            )}
            {type == 'info' && (
              <i className={`bi bi-info-circle-fill ${styles.info}`}></i>
            )}
            {type == 'confirmation' && (
              <i
                className={`bi bi-question-circle-fill ${styles.confirmation}`}
              ></i>
            )}
            <h3>{title}</h3>
          </div>
          <div className={styles.close} onClick={onClose}>
            <i className="bi bi-x"></i>
          </div>
        </div>
        <div className={styles.body}>
          <p>{message}</p>
        </div>
        <div className={styles.footer}>
          <button
            className={`${styles.cancel} ${type == 'destructive' ? 'outline-destructive-btn' : 'outline-primary-btn'}`}
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            className={`${styles.confirm} ${type == 'destructive' ? 'destructive-btn' : 'primary-btn'}`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
