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
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={`${styles.container}`}>
        <div className={styles.header}>
          <h3>{title}</h3>
          <div className={styles.close} onClick={onClose}>
            <i className="bi bi-x"></i>
          </div>
        </div>
        <div className={styles.body}>
          <p>{message}</p>
        </div>
        <div className={styles.footer}>
          <button
            className={`${styles.cancel} secondary-btn`}
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            className={`${styles.confirm} primary-btn`}
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
