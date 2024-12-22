import { useEffect, useState } from 'react';
import { stringToSlug } from '@utils/string';
import { useToastContext } from '@contexts/ToastContext';
import ToastList from '@components/ToastList';
import useModal from '@hooks/useModal';
import Modal from '@components/Modal';
import Input from '@components/Input';
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
      cancelLabel: 'Hủy',
      confirmLabel: 'Tạo',
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

  const handleChangeName = (name) => {
    setName(name);
    setSlug(stringToSlug(name));
  };

  return (
    <>
      <div className="card">
        <div className="card-header">
          <h3>Thêm chủ đề</h3>
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
            <label>Slug</label>
            <Input
              type="text"
              placeholder="Slug"
              value={slug}
              isDisabled={true}
            />
          </div>
        </div>
        <div className="card-footer-end">
          <button className="primary-btn" onClick={openConfirmCreateModal}>
            Thêm
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

export default CreateCategory;
