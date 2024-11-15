import styles from './CreatePost.module.scss';
import Header from '../../components/Header/Header';
import { useEffect, useState } from 'react';
import Login from '../../components/Login/Login';
import SignUp from '../../components/SignUp/SignUp';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Dropdown from '../../components/Dropdown/Dropdown';
import { getAllCategories as getAllCategoriesService } from '../../services/categoryService';
import { useAuthContext } from '../../contexts/AuthContext';
import { stringToSlug } from '../../utils/string';
import { fileToBase64 } from '../../utils/file';
import { createPost as createPostService } from '../../services/postService';
import { useNavigate } from 'react-router-dom';
import useModal from '../../hooks/useModal';
import Modal from '../../components/Modal/Modal';
import { useToastContext } from '../../contexts/ToastContext';
import ToastList from '../../components/ToastList/ToastList';

const CreatePost = () => {
  const [isModalLoginOpen, setIsModalLoginOpen] = useState(false);
  const [isModalSignUpOpen, setIsModalSignUpOpen] = useState(false);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [categories, setCategories] = useState();
  const [categorySlug, setCategorySlug] = useState('');
  const [categoryName, setCategoryName] = useState('Danh mục');
  const [thumbnail, setThumbnail] = useState('');
  const [userId, setUserId] = useState('');
  const [modalContent, setModalContent] = useState({});

  const { user } = useAuthContext();
  const { addToast } = useToastContext();

  const { isOpen, openModal, closeModal } = useModal();

  const dropdownChildren = [];
  const openModalLogin = () => setIsModalLoginOpen(true);
  const openModalSignUp = () => setIsModalSignUpOpen(true);
  const closeModalLogin = () => setIsModalLoginOpen(false);
  const closeModalSignUp = () => setIsModalSignUpOpen(false);

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
    if (!thumbnail) {
      addToast({
        title: 'Thông báo',
        message: 'Vui lòng chọn thumbnail'
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
        addToast({
          title: 'Thông báo',
          message: 'Đăng bài viết thành công'
        })
      },
      onCancel: () => {
        closeModal();
      }
    });
    openModal();
  };

  const modules = {
    toolbar: [
      [{ 'header': [2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['clean'],
      ['link'],
      ['blockquote'],
      [{ 'color': [] }],
      ['image'],
      ['undo', 'redo'],
    ],
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

    const createPost = async (title, content, userId, thumbnail, categorySlug, slug) => {
      try {
        await createPostService(title, content, userId, thumbnail, categorySlug, slug);
      } catch (err) {
        return;
      }
    };

    createPost(title, content, userId, thumbnail, categorySlug, slug);
    navigate('/');
  }
  
  const handleChangeThumbnail = async (e) => {
    const file = e.target.files[0];

    if (!file) {
      console.log('Vui lòng chọn ảnh');
      return;
    }

    const base64 = await fileToBase64(file);
    setThumbnail(base64);
  }

  return (
    <div className={styles.container}>
      <Header
        isDashboard={false}
        openModalLogin={openModalLogin}
        openModalSignUp={openModalSignUp}
      />
      <div className={styles.contentWrapper}>
        {user ? (
          <div className={styles.content}>
          <h1>Tạo bài viết mới</h1>
          <div className={styles.formGroups}>
            <div className={styles.formGroup} style={{ flexGrow: '1' }}>
              <input 
                type='text'
                placeholder='Tiêu đề bài viết'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                id='title'
              />
            </div>
            <div className={styles.formGroup}>
              <Dropdown 
                trigger={
                  <div className={styles.categoriesList}>
                    {categoryName == 'Danh mục' ? (
                      'Danh mục'
                    ) : (
                      <>{categoryName}</>
                    )}
                  </div>} 
                children={dropdownChildren} 
              />
            </div>
          </div>
          <div className={styles.thumbnailWrapper}>
            {!thumbnail && 
              <label htmlFor="thumbnail" className={styles.thumbnailLabel}>
                Nhấn để chọn thumbnail
              </label>
            }
            {!thumbnail && 
              <input 
                type='file'
                id='thumbnail'
                style={{ display: 'none' }}
                onChange={handleChangeThumbnail}
                className={styles.inputThumbnail}
              />
            }
            {thumbnail && <img src={`data:image/jpeg;base64,${thumbnail}`} className={styles.thumbnail} />}
          </div>
          <ReactQuill
            value={content}
            modules={modules}
            onChange={handleContentChange}
            placeholder="Nội dung bài viết"
            spellCheck={false}
            className={styles.quill}
          />
          <div className={styles.publishButtonWrapper}>
            <div className={styles.publishButton} onClick={openConfirmPublishModal}>
              Đăng
            </div>
          </div>
        </div>
        ) : (
          <div className={styles.notLoggedIn}>
            Chưa đăng nhập
          </div>
        )}
      </div>
      <Login isOpen={isModalLoginOpen} onClose={closeModalLogin} />
      <SignUp isOpen={isModalSignUpOpen} onClose={closeModalSignUp} />
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
