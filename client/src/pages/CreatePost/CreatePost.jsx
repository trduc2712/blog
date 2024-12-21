import { useEffect, useState } from 'react';
import Header from '@components/Header';
import Select from '@components/Select';
import Modal from '@components/Modal';
import Upload from '@components/Upload';
import ToastList from '@components/ToastList';
import Footer from '@components/Footer';
import Input from '@components/Input';
import TextEditor from '@components/TextEditor';
import { getAllCategories as getAllCategoriesService } from '@services/categoryService';
import { useAuthContext } from '@contexts/AuthContext';
import { stringToSlug } from '@utils/string';
import { createPost as createPostService } from '@services/postService';
import { useNavigate } from 'react-router-dom';
import useModal from '@hooks/useModal';
import { useToastContext } from '@contexts/ToastContext';

const CreatePost = () => {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [categories, setCategories] = useState();
  const [categorySlug, setCategorySlug] = useState('');
  const [categoryName, setCategoryName] = useState('Chủ đề');
  const [thumbnail, setThumbnail] = useState('');
  const [userId, setUserId] = useState('');
  const [modal, setModal] = useState({});
  const [selectItems, setSelectItems] = useState();

  const { user } = useAuthContext();

  const { createToast } = useToastContext();
  const { isOpen, openModal, closeModal } = useModal();

  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Tạo bài viết mới | Blog';

    const getAllCategories = async () => {
      try {
        const categories = await getAllCategoriesService();
        setCategories(categories);
      } catch (err) {
        console.log(err);
      }
    };

    getAllCategories();
  }, []);

  useEffect(() => {
    if (user) {
      setUserId(user.id);
    }
  }, [user]);

  useEffect(() => {
    if (categories) {
      const items = categories.map((category) => ({
        label: category.name,
        onClick: () => {
          setCategorySlug(category.slug);
          setCategoryName(category.name);
        },
      }));
      setSelectItems(items);
    }
  }, [categories]);

  const openConfirmPublishModal = () => {
    if (!title || !thumbnail || !categorySlug || !content) {
      createToast({
        type: 'warning',
        title: 'Cảnh báo',
        message: 'Vui lòng điền đầy đủ thông tin.',
      });
      return;
    }
    setModal({
      title: 'Xác nhận',
      cancelLabel: 'Hủy',
      confirmLabel: 'Đăng',
      message: 'Bạn có chắc chắn muốn đăng bài viết không?',
      type: 'confirmation',
      onConfirm: () => {
        handlePublish();
        closeModal();
      },
      onCancel: () => {
        closeModal();
      },
    });
    openModal();
  };

  const handlePublish = async () => {
    const slug = stringToSlug(title);

    const result = await createPostService(
      title,
      content,
      userId,
      thumbnail,
      categorySlug,
      slug
    );

    if (result.success) {
      navigate('/');
      createToast({
        type: 'success',
        title: 'Thành công',
        message: 'Đăng bài viết thành công.',
      });
    } else {
      createToast({
        type: 'error',
        title: 'Lỗi',
        message: result.errorMessage,
      });
    }
  };

  const handleChangeTitle = (title) => {
    setTitle(title);
  };

  return (
    <>
      <Header isDashboard={false} />
      <div className="container">
        {user ? (
          <div className="card">
            <div className="card-header">
              <h3>Tạo bài viết mới</h3>
            </div>
            <div className="card-body">
              <div className="form-group">
                <label>Tiêu đề</label>
                <Input
                  type="text"
                  placeholder="Tiêu đề"
                  value={title}
                  onChangeValue={(e) => handleChangeTitle(e.target.value)}
                />
              </div>
              <div className="select">
                <p>Chủ đề</p>
                <Select
                  label="Chủ đề"
                  items={selectItems}
                  isShowCheckIcon={true}
                />
              </div>
              <Upload
                type="thumbnail"
                upload={thumbnail}
                setUpload={setThumbnail}
              />
              <div className="form-group">
                <label>Nội dung</label>
                <TextEditor content={content} setContent={setContent} />
              </div>
            </div>
            <div className="card-footer end">
              <button className="secondary-btn" onClick={() => navigate('/')}>
                Hủy
              </button>
              <button className="primary-btn" onClick={openConfirmPublishModal}>
                Đăng
              </button>
            </div>
          </div>
        ) : (
          <div className="not-logged-in">
            <p>Vui lòng đăng nhập để sử dụng chức năng này.</p>
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
      <Footer />
    </>
  );
};

export default CreatePost;
