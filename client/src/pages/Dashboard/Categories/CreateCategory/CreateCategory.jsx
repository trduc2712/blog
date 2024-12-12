import styles from './CreateCategory.module.scss';
import { useEffect, useState } from 'react';
import { stringToSlug } from '@utils/string';
import { useToastContext } from '@contexts/ToastContext';
import ToastList from '@components/ToastList/ToastList';
import useModal from '@hooks/useModal';
import Modal from '@components/Modal/Modal';
import { createCategory as createCategoryService } from '@services/categoryService';
import { useNavigate } from 'react-router-dom';

const CreateCategory = () => {
  const [modal, setModal] = useState('');
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');

  const navigate = useNavigate();

  const { createToast } = useToastContext();

  const { isOpen, openModal, closeModal } = useModal();

  useEffect(() => {
    setSlug(stringToSlug(name));
  }, []);

  const openConfirmCreateModal = () => {
    if (!name || !slug) {
      createToast({
        type: 'warning',
        title: 'Cảnh báo',
        message: 'Vui lòng điền đầy đủ thông tin yêu cầu.',
      });
      return;
    }
    setModal({
      title: 'Xác nhận',
      cancelLabel: 'Không',
      confirmLabel: 'Có',
      message: 'Bạn có chắc chắn muốn tạo chủ đề mới này không?',
      type: 'confirmation',
      onConfirm: () => {
        handleCreate();
        closeModal();
        createToast({
          type: 'success',
          title: 'Thông báo',
          message: 'Tạo mới chủ đề thành công',
        });
        navigate('/dashboard/categories');
      },
      onCancel: () => {
        closeModal();
      },
    });
    openModal();
  };

  const handleCreate = () => {
    const createCategory = async (name, slug) => {
      try {
        await createCategoryService(name, slug);
      } catch (err) {
        console.log(err);
      }
    };

    createCategory(name, slug);
  };

  return (
    <div className={styles.container}>
      <h2>Thêm chủ đề</h2>
      <div className={styles.formGroup}>
        <label htmlFor="name">Tên</label>
        <input
          type="text"
          name="name"
          id="name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setSlug(stringToSlug(e.target.value));
          }}
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="slug">Slug</label>
        <input
          disabled={true}
          type="text"
          name="slug"
          id="slug"
          value={slug}
          onChange={(e) => setSlug(stringToSlug(name))}
        />
      </div>
      <div className={styles.updateButtonWrapper}>
        <button
          className={`${styles.updateButton} primary-btn`}
          onClick={openConfirmCreateModal}
        >
          Thêm
        </button>
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
    </div>
  );
};

export default CreateCategory;
