import styles from './Modal.module.scss';

const Modal = ({ isOpen, title, onClose, cancelLabel, confirmLabel, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.header}>
        <h3>{title}</h3>
        <button className={styles.closeButton} onClick={onClose}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#000" className="bi bi-x" viewBox="0 0 16 16">
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
          </svg>
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