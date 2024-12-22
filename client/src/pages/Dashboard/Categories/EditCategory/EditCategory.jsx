import styles from './EditCategory.module.scss';
import { useEffect, useState } from 'react';
import { stringToSlug } from '@utils/string';
import { useParams } from 'react-router-dom';
import {
  getCategoryById as getCategoryByIdService,
  updateCategory as updateCategoryService,
} from '@services/categoryService';
import { useToastContext } from '@contexts/ToastContext';
import ToastList from '@components/ToastList';
import useModal from '@hooks/useModal';
import Modal from '@components/Modal';
import Input from '@components/Input';

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
      cancelLabel: 'Hủy',
      confirmLabel: 'Lưu',
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

  const handleChangeName = (name) => {
    setName(name);
    setSlug(stringToSlug(name));
  };

  return (
    <>
      <div className="card">
        <div className="card-header">
          <h3>Sửa chủ đề</h3>
        </div>
        <div className="card-body">
          <div className="form-group">
            <label>Tên</label>
            <Input
              type="text"
              placeholder="Tên"
              value={name}
              onChangeValue={(e) => handleChangeName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="slug">Slug</label>
            <Input
              type="text"
              placeholder="Tên"
              value={slug}
              isDisabled={true}
            />
          </div>
        </div>
        <div className="card-footer-end">
          <button className="primary-btn" onClick={openConfirmUpdateModal}>
            Cập nhật
          </button>
        </div>
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

export default EditCategory;
