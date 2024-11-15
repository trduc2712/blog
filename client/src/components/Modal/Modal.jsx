import styles from './Modal.module.scss';

const Modal = ({ isOpen, title, onClose, cancelLabel, confirmLabel, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.header}>
        <h3>{title}</h3>
        <button className={styles.closeButton} onClick={onClose}>
          <i className="bi bi-x"></i>
        </button>
      </div>
      <div className={styles.body}>
        <p>{message}</p>
      </div>
      <div className={styles.footer}>
        <button className={styles.cancelButton} onClick={onCancel}>
          {cancelLabel}
        </button>
        <button className={styles.confirmButton} onClick={onConfirm} >
          {confirmLabel}
        </button>
      </div>
    </div>
  )
}

export default Modal;