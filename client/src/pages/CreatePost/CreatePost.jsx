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
    setModalContent({
      title: 'Thông báo',
      cancelLabel: 'Không',
      confirmLabel: 'Có',
      message: 'Bạn có chắc chắn muốn đăng bài viết không?',
      onConfirm: () => {
        handlePublish();
        closeModal();
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
              <label htmlFor="thumbnail" className={styles.thumbnailLabel}>
                Thumbnail
              </label>
              <input 
                type='file'
                id='thumbnail'
                style={{ display: 'none' }}
                onChange={handleChangeThumbnail}
              />
            </div>
            <div className={styles.formGroup}>
              <Dropdown 
                trigger={
                  <div className={styles.categoriesList}>
                    {categoryName == 'Danh mục' ? (
                      <>
                        {categoryName}
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-down-fill" viewBox="0 0 16 16">
                          <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
                        </svg>
                      </>
                    ) : (
                      <>{categoryName}</>
                    )}
                  </div>} 
                children={dropdownChildren} 
              />
            </div>
          </div>
          <div className={styles.thumbnailWrapper} style={{ display: `${thumbnail ? 'block' : 'none'}` }}>
            <img src={`data:image/jpeg;base64,${thumbnail}`} />
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
              Xuất bản
            </div>
          </div>
        </div>
        ) : (
          <div className={styles.content}>
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
    </div>
  );
};

export default CreatePost;
