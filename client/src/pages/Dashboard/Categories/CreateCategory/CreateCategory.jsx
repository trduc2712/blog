import styles from './CreateCategory.module.scss';
import { useEffect, useState } from 'react';
import { stringToSlug } from '../../../../utils/string';
import { useToastContext } from '../../../../contexts/ToastContext';
import ToastList from '../../../../components/ToastList/ToastList';
import useModal from '../../../../hooks/useModal';
import Modal from '../../../../components/Modal/Modal';
import { createCategory as createCategoryService } from '../../../../services/categoryService';
import { useNavigate } from 'react-router-dom';

const CreateCategory = () => {
  const [modalContent, setModalContent] = useState('');
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');

  const navigate = useNavigate();

  const { addToast } = useToastContext();
  
  const { isOpen, openModal, closeModal } = useModal();

  useEffect(() => {
    setSlug(stringToSlug(name));
  }, [])

  const openConfirmCreateModal = () => {
    if (!name || !slug) {
      addToast({
        type: 'warning',
        title: 'Thông báo',
        message: 'Vui lòng điền đầy đủ thông tin yêu cầu.'
      });
      return;
    }
    setModalContent({
      title: 'Thông báo',
      cancelLabel: 'Không',
      confirmLabel: 'Có',
      message: 'Bạn có chắc chắn muốn tạo danh mục mới này không?',
      onConfirm: () => {
        handleCreate();
        closeModal();
        addToast({
          type: 'success',
          title: 'Thông báo',
          message: 'Tạo mới danh mục thành công'
        });
        navigate('/dashboard/categories')
      },
      onCancel: () => {
        closeModal();
      }
    });
    openModal();
  };

  const handleCreate = () => {
    console.log('name: ', name);
    console.log('slug: ', slug);
    const createCategory = async (name, slug) => {
      try {
        await createCategoryService(name, slug);
      } catch (err) {
        console.log(err);
      }
    };

    createCategory(name, slug);
  }

  return (
    <div className={styles.container}>
      <h2>Thêm danh mục</h2>
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
        <button className={styles.updateButton} onClick={openConfirmCreateModal}>Thêm</button>
      </div>
      <Modal
        title={modalContent.title}
        isOpen={isOpen}
        onClose={closeModal}
        cancelLabel={modalContent.cancelLabel}
        confirmLabel={modalContent.confirmLabel}
        onConfirm={modalContent.onConfirm}
        onCancel={modalContent.onCancel}
        message={modalContent.message}
        buttonLabel={modalContent.buttonLabel}
      />
      <ToastList />
    </div>
  )
}

export default CreateCategory;