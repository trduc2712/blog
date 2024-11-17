import styles from './CreatePost.module.scss';
import Header from '../../components/Header/Header';
import { useEffect, useState } from 'react';
import Login from '../../components/Login/Login';
import SignUp from '../../components/SignUp/SignUp';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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
    if (!title || !thumbnail || !categorySlug || !content) {
      addToast({
        type: 'warning',
        title: 'Thông báo',
        message: 'Vui lòng điền đầy đủ thông tin.'
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
          type: 'success',
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
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
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

    console.log('title: ', title);
    console.log('content: ', content);
    console.log('userId: ', userId);
    console.log('thumbnail: ', thumbnail);
    console.log('categorySlug: ', categorySlug);
    console.log('slug: ', slug);

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
          <h2>Tạo bài viết mới</h2>
          <div className={styles.formGroups}>
            <div className={styles.formGroup} style={{ flexGrow: '1' }}>
              <label htmlFor="title">Tiêu đề</label>
              <input 
                type='text'
                placeholder='Tiêu đề bài viết'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                id='title'
              />
            </div>
          </div>
          <div className={styles.categoryPicker}>
            <label htmlFor='category' onClick={() => setIsDropdownOpen(!isDropdownOpen)}>Danh mục</label>
            <div className={styles.categoriesList} onClick={() => setIsDropdownOpen(!isDropdownOpen)}>{categoryName}</div>
            {isDropdownOpen && (
              <div className={styles.categories}>
                {categories.map((category, index) => (
                  <li 
                    key={index}
                    className={styles.category} 
                    onClick={() => 
                      {
                        setIsDropdownOpen(!isDropdownOpen);
                        setCategoryName(category.name);
                        setCategorySlug(stringToSlug(category.name));
                      }
                    }
                  >
                    {category.name}
                  </li>
                ))}
              </div>
            )}
          </div>
          <label htmlFor="thumbnail">Thumbnail</label>
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
          <label htmlFor="thumbnail">Nội dung</label>
          <div className={styles.quillWrapper} spellcheck="false">
            <ReactQuill
              value={content}
              modules={modules}
              onChange={handleContentChange}
              placeholder=''
              spellCheck={false}
              className={styles.quill}
            />
          </div>
          <div className={styles.publishWrapper}>
            <button className={styles.cancel} onClick={() => navigate('/')}>
              Hủy
            </button>
            <button className={styles.publish} onClick={openConfirmPublishModal}>
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
