import styles from './CreatePost.module.scss';
import Header from '@components/Header';
import { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getAllCategories as getAllCategoriesService } from '@services/categoryService';
import { useAuthContext } from '@contexts/AuthContext';
import { stringToSlug } from '@utils/string';
import { fileToBase64 } from '@utils/file';
import { createPost as createPostService } from '@services/postService';
import { useNavigate } from 'react-router-dom';
import useModal from '@hooks/useModal';
import Modal from '@components/Modal';
import { useToastContext } from '@contexts/ToastContext';
import ToastList from '@components/ToastList';
import Footer from '@components/Footer';
import { useRef } from 'react';

const CreatePost = () => {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [categories, setCategories] = useState();
  const [categorySlug, setCategorySlug] = useState('');
  const [categoryName, setCategoryName] = useState('Chủ đề');
  const [thumbnail, setThumbnail] = useState('');
  const [userId, setUserId] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [modal, setModal] = useState({});

  const { user } = useAuthContext();

  const { createToast } = useToastContext();
  const { isOpen, openModal, closeModal } = useModal();

  const quillRef = useRef(null);

  const dropdownChildren = [];

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setUserId(user.id);
    }
  }, [user]);

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

  const handleContentChange = (value) => {
    setContent(value);
  };

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
      cancelLabel: 'Không',
      confirmLabel: 'Có',
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

  const customToolbar = (
    <div className="custom-toolbar">
      <select className="ql-header">
        <option value="1">Tiêu đề 1</option>
        <option value="2">Tiêu đề 2</option>
        <option value="3">Tiêu đề 3</option>
        <option value="">Văn bản</option>
      </select>
      <button className="ql-bold" aria-label="In đậm">
        <i className="bi bi-type-bold"></i>
      </button>
      <button className="ql-italic" aria-label="In nghiêng">
        <i className="bi bi-type-italic"></i>
      </button>
      <button className="ql-underline" aria-label="Gạch chân">
        <i className="bi bi-type-underline"></i>
      </button>
      <button
        className="ql-list"
        value="ordered"
        aria-label="Danh sách có thứ tự"
      >
        <i className="bi bi-list-ol"></i>
      </button>
      <button
        className="ql-list"
        value="bullet"
        aria-label="Danh sách không thứ tự"
      >
        <i className="bi bi-list-ul"></i>
      </button>
      <button className="ql-image" aria-label="Chèn ảnh">
        <i className="bi bi-image"></i>
      </button>
      <button className="ql-clean" aria-label="Xóa định dạng"></button>
    </div>
  );

  const modules = {
    toolbar: {
      container: '.custom-toolbar',
    },
  };

  if (categories) {
    categories.forEach((category) => {
      dropdownChildren.push({
        label: category.name,
        onClick: () => {
          setCategorySlug(category.slug);
          setCategoryName(category.name);
        },
      });
    });
  }

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

  const handleChangeThumbnail = async (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    const base64 = await fileToBase64(file);
    setThumbnail(base64);
  };

  const openConfirmDeleteThumbnailModal = () => {
    setModal({
      title: 'Xác nhận',
      cancelLabel: 'Không',
      confirmLabel: 'Có',
      message: `Bạn có chắc chắn muốn xóa ảnh đại diện thu nhỏ không?`,
      type: 'confirmation',
      onConfirm: () => {
        setThumbnail('');
        closeModal();
      },
      onCancel: () => {
        closeModal();
      },
    });

    openModal();
  };

  return (
    <div className={styles.container}>
      <Header isDashboard={false} />
      <div className={styles.contentWrapper}>
        {user ? (
          <div className={styles.content}>
            <h2>Tạo bài viết mới</h2>
            <div className={styles.formGroups}>
              <div className={styles.formGroup} style={{ flexGrow: '1' }}>
                <label htmlFor="title">Tiêu đề</label>
                <input
                  type="text"
                  placeholder="Tiêu đề bài viết"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  id="title"
                />
              </div>
            </div>
            <div className={styles.categoryPicker}>
              <label
                htmlFor="category"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                Chủ đề
              </label>
              <div
                className={styles.categoriesList}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                {categoryName}
                <i className="bi bi-chevron-down"></i>
              </div>
              {isDropdownOpen && (
                <>
                  <div className={styles.categories}>
                    {categories.map((category, index) => (
                      <li
                        key={index}
                        className={styles.category}
                        onClick={() => {
                          setIsDropdownOpen(!isDropdownOpen);
                          setCategoryName(category.name);
                          setCategorySlug(stringToSlug(category.name));
                        }}
                      >
                        {category.name}
                      </li>
                    ))}
                  </div>
                </>
              )}
            </div>
            <label htmlFor="thumbnail">Ảnh đại diện thu nhỏ</label>
            <div className={styles.thumbnailWrapper}>
              {!thumbnail ? (
                <label htmlFor="thumbnail" className={styles.thumbnailLabel}>
                  <i className="bi bi-image"></i>
                  <p>Tải lên ảnh đại diện thu nhỏ.</p>
                </label>
              ) : (
                <>
                  <img
                    src={`data:image/jpeg;base64,${thumbnail}`}
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
            <label>Nội dung</label>
            <div className="quill-wrapper" spellCheck="false">
              {customToolbar}
              <ReactQuill
                ref={quillRef}
                value={content}
                modules={modules}
                onChange={handleContentChange}
                placeholder=""
                spellCheck={false}
              />
            </div>
            <div className={styles.publishWrapper}>
              <button
                className={`${styles.cancel} outline-primary-btn`}
                onClick={() => navigate('/')}
              >
                Hủy
              </button>
              <button
                className={`${styles.publish} primary-btn`}
                onClick={openConfirmPublishModal}
              >
                Đăng
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.notLoggedIn}>
            <p>Chưa đăng nhập.</p>
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
    </div>
  );
};

export default CreatePost;
