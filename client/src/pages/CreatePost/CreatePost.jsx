import styles from './CreatePost.module.scss';
import Header from '@components/Header/Header';
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
import Modal from '@components/Modal/Modal';
import { useToastContext } from '@contexts/ToastContext';
import ToastList from '@components/ToastList/ToastList';

const CreatePost = () => {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [categories, setCategories] = useState();
  const [categorySlug, setCategorySlug] = useState('');
  const [categoryName, setCategoryName] = useState('Danh mục');
  const [thumbnail, setThumbnail] = useState('');
  const [userId, setUserId] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [modalContent, setModalContent] = useState({});

  const { user } = useAuthContext();

  const { createToast } = useToastContext();
  const { isOpen, openModal, closeModal } = useModal();

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
      console.log('Thieu thong tin.');
      createToast({
        type: 'warning',
        title: 'Cảnh báo',
        message: 'Vui lòng điền đầy đủ thông tin.',
      });
      return;
    }
    setModalContent({
      title: 'Thông báo',
      cancelLabel: 'Không',
      confirmLabel: 'Có',
      message: 'Bạn có chắc chắn muốn đăng bài viết không?',
      onConfirm: () => {
        handlePublish();
        closeModal();
        createToast({
          type: 'success',
          title: 'Thành công',
          message: 'Đăng bài viết thành công.',
        });
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

  const handlePublish = () => {
    const slug = stringToSlug(title);

    console.log('title: ', title);
    console.log('content: ', content);
    console.log('userId: ', userId);
    console.log('thumbnail: ', thumbnail);
    console.log('categorySlug: ', categorySlug);
    console.log('slug: ', slug);

    const createPost = async (
      title,
      content,
      userId,
      thumbnail,
      categorySlug,
      slug
    ) => {
      await createPostService(
        title,
        content,
        userId,
        thumbnail,
        categorySlug,
        slug
      );
    };

    createPost(title, content, userId, thumbnail, categorySlug, slug);
    navigate('/');
  };

  const handleChangeThumbnail = async (e) => {
    const file = e.target.files[0];

    if (!file) {
      console.log('Vui lòng chọn ảnh');
      return;
    }

    const base64 = await fileToBase64(file);
    setThumbnail(base64);
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
                Danh mục
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
                  <i className="bi bi-upload"></i> Tải lên
                </label>
              ) : (
                <img
                  src={`data:image/jpeg;base64,${thumbnail}`}
                  className={styles.thumbnail}
                />
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
                value={content}
                modules={modules}
                onChange={handleContentChange}
                placeholder=""
                spellCheck={false}
              />
            </div>
            <div className={styles.publishWrapper}>
              <button
                className={`${styles.cancel} secondary-btn`}
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
  );
};

export default CreatePost;
