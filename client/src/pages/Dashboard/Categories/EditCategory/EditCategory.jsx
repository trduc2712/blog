import styles from './EditCategory.module.scss';
import { useEffect, useState } from 'react';
import { stringToSlug } from '@utils/string';
import { useParams } from 'react-router-dom';
import {
  getCategoryById as getCategoryByIdService,
  updateCategory as updateCategoryService,
} from '@services/categoryService';
import { useToastContext } from '@contexts/ToastContext';
import ToastList from '@components/ToastList/ToastList';
import useModal from '@hooks/useModal';
import Modal from '@components/Modal/Modal';

const EditCategory = () => {
  const [category, setCategory] = useState();
  const [modal, setModal] = useState('');
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');

  const { categoryId } = useParams();

  const { createToast } = useToastContext();

  const { isOpen, openModal, closeModal } = useModal();

  useEffect(() => {
    setSlug(stringToSlug(name));

    const getCategoryById = async (id) => {
      try {
        const category = await getCategoryByIdService(id);
        setCategory(category);
      } catch (err) {
        console.log(err);
      }
    };

    getCategoryById(categoryId);
  }, []);

  useEffect(() => {
    if (category) {
      setName(category.name);
      setSlug(category.slug);
    }
  }, [category]);

  const openConfirmUpdateModal = () => {
    setModal({
      title: 'Xác nhận',
      cancelLabel: 'Không',
      confirmLabel: 'Có',
      message: 'Bạn có chắc chắn muốn lưu các thay đổi này không?',
      type: 'confirmation',
      onConfirm: () => {
        handleUpdate();
        closeModal();
        createToast({
          type: 'success',
          title: 'Thông báo',
          message: 'Cập nhật chủ đề thành công',
        });
      },
      onCancel: () => {
        closeModal();
      },
    });
    openModal();
  };

  const handleUpdate = () => {
    const updateCategory = async (categoryId, name, slug) => {
      try {
        await updateCategoryService(categoryId, name, slug);
      } catch (err) {
        console.log(err);
      }
    };

    updateCategory(categoryId, name, slug);
  };

  return (
    <div className={styles.container}>
      <h2>Sửa chủ đề</h2>
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
          onChange={() => setSlug(stringToSlug(name))}
        />
      </div>
      <div className={styles.updateButtonWrapper}>
        <button
          className={`${styles.updateButton} primary-btn`}
          onClick={openConfirmUpdateModal}
        >
          Cập nhật
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

export default EditCategory;
