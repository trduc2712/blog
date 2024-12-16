import styles from './Upload.module.scss';
import { fileToBase64 } from '@utils/file';
import { useAuthContext } from '@contexts/AuthContext';
import Modal from '@components/Modal';
import useModal from '@hooks/useModal';
import { useState } from 'react';
import { useToastContext } from '@contexts/ToastContext';
import ToastList from '@components/ToastList';

const Upload = ({ type, upload, setUpload }) => {
  const { user } = useAuthContext();
  const [modal, setModal] = useState({});

  const { createToast } = useToastContext();
  const { isOpen, openModal, closeModal } = useModal();

  const handleChangeAvatar = async (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    const base64 = await fileToBase64(file);
    setUpload(base64);
  };

  const handleChangeThumbnail = async (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    const base64 = await fileToBase64(file);
    setUpload(base64);
  };

  const openConfirmDeleteThumbnailModal = () => {
    setModal({
      title: 'Xác nhận',
      cancelLabel: 'Không',
      confirmLabel: 'Có',
      message: `Bạn có chắc chắn muốn xóa ảnh đại diện thu nhỏ không?`,
      type: 'confirmation',
      onConfirm: () => {
        setUpload('');
        closeModal();
      },
      onCancel: () => {
        closeModal();
      },
    });

    openModal();
  };

  return (
    <>
      <div className={styles.container}>
        {type == 'avatar' && (
          <div className={styles.avatarContainer}>
            <input
              type="file"
              id="avatar"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleChangeAvatar}
            />
            <label
              htmlFor="avatar"
              className={`${upload ? styles.avatarLabel : styles.notFoundAvatar}`}
              // style={{
              //   pointerEvents: `${user && username && user.username == userUsername ? 'auto' : 'none'}`,
              // }}
            >
              <img
                src={`data:image/jpeg;base64,${upload}`}
                alt="Hình đại diện của người dùng"
                className={`${upload ? styles.avatar : styles.hide}`}
              />
              <>
                {upload ? (
                  <div className={styles.change}>
                    <i className="bi bi-pen"></i>
                  </div>
                ) : (
                  <div className={styles.upload}>
                    <i className="bi bi-plus"></i>
                    <p>Tải lên</p>
                  </div>
                )}
              </>
            </label>
          </div>
        )}
        {type == 'thumbnail' && (
          <div className={styles.thumbnailContainer}>
            <label htmlFor="thumbnail">Ảnh đại diện thu nhỏ</label>
            {!upload ? (
              <label htmlFor="thumbnail" className={styles.thumbnailLabel}>
                <i className="bi bi-image"></i>
                <p>Tải lên ảnh đại diện thu nhỏ.</p>
              </label>
            ) : (
              <>
                <img
                  src={`data:image/jpeg;base64,${upload}`}
                  className={styles.thumbnail}
                />
                <div
                  className={styles.deleteThumbnail}
                  onClick={openConfirmDeleteThumbnailModal}
                >
                  <i className="bi bi-trash"></i>
                </div>
              </>
            )}
            <input
              type="file"
              id="thumbnail"
              style={{ display: 'none' }}
              onChange={handleChangeThumbnail}
              className={styles.inputThumbnail}
            />
          </div>
        )}
      </div>
      <Modal
        title={modal.title}
        isOpen={isOpen}
        onClose={closeModal}
        cancelLabel={modal.cancelLabel}
        confirmLabel={modal.confirmLabel}
        onConfirm={modal.onConfirm}
        onCancel={modal.onCancel}
        message={modal.message}
        buttonLabel={modal.buttonLabel}
        type={modal.type}
      />
      <ToastList />
    </>
  );
};

export default Upload;
