import { useParams } from 'react-router-dom';
import styles from './EditPost.module.scss';
import { getPost as getPostService } from '@services/postService';
import { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getAllCategories as getAllCategoriesService } from '@services/categoryService';
import { getUsers as getUsersService } from '@services/userService';
import { updatePost as updatePostService } from '@services/postService';
import { stringToSlug } from '@utils/string';
import { fileToBase64 } from '@utils/file';
import { useToastContext } from '@contexts/ToastContext';
import ToastList from '@components/ToastList/ToastList';
import useModal from '@hooks/useModal';
import Modal from '@components/Modal/Modal';

const EditPost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [userId, setUserId] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [categorySlug, setCategorySlug] = useState('');
  const [slug, setSlug] = useState('');
  const [categories, setCategories] = useState('');
  const [users, setUsers] = useState('');
  const [userName, setUserName] = useState('');
  const [post, setPost] = useState();
  const [isCategoriesDropdownOpen, setIsCategoriesDropdownOpen] =
    useState(false);
  const [isUsersDropdownOpen, setIsUsersDropdownOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');

  const { postId } = useParams();

  const { createToast } = useToastContext();

  const { isOpen, openModal, closeModal } = useModal();

  useEffect(() => {
    const getPost = async (id) => {
      try {
        const post = await getPostService(id);
        setPost(post);
      } catch (err) {
        console.log(err);
      }
    };

    const getAllCategories = async () => {
      try {
        const categories = await getAllCategoriesService();
        setCategories(categories);
      } catch (err) {
        console.log(err);
      }
    };

    const getUsers = async () => {
      try {
        const users = await getUsersService();
        setUsers(users);
      } catch (err) {
        console.log(err);
      }
    };

    getPost(postId);
    getAllCategories();
    getUsers();
  }, []);

  useEffect(() => {
    if (users) {
      const user = users.find((user) => user.name == userName);
      setUserId(user.id);
    }
  }, [users]);

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setSlug(stringToSlug(title));
      setThumbnail(post.thumbnail);
      setCategoryName(post.category_name);
      setCategorySlug(stringToSlug(post.category_name));
      setContent(post.content);
      setUserName(post.user_name);
      setThumbnail(post.thumbnail);
    }
  }, [post]);

  const handleContentChange = (value) => {
    setContent(value);
  };

  const handleThumbnailChange = async (e) => {
    const file = e.target.files[0];

    if (!file) {
      console.log('Vui lòng chọn ảnh');
      return;
    }

    const base64 = await fileToBase64(file);
    setThumbnail(base64);
  };

  const openConfirmUpdateModal = () => {
    setModalContent({
      title: 'Thông báo',
      cancelLabel: 'Không',
      confirmLabel: 'Có',
      message: 'Bạn có chắc chắn muốn lưu các thay đổi này không?',
      onConfirm: () => {
        handleUpdate();
        closeModal();
        createToast({
          type: 'success',
          title: 'Thông báo',
          message: 'Cập nhật bài viết thành công',
        });
      },
      onCancel: () => {
        closeModal();
      },
    });
    openModal();
  };

  const handleUpdate = () => {
    const updatePost = async (
      postId,
      title,
      content,
      userId,
      thumbnail,
      categorySlug,
      slug
    ) => {
      try {
        await updatePostService(
          postId,
          title,
          content,
          userId,
          thumbnail,
          categorySlug,
          slug
        );
      } catch (err) {
        console.log(err);
      }
    };

    updatePost(postId, title, content, userId, thumbnail, categorySlug, slug);
  };

  const customToolbar = (
    <div className="custom-toolbar">
      <select className="ql-header">
        <option value="1">Tiêu đề 1</option>
        <option value="2">Tiêu đề 2</option>
        <option value="3">Tiêu đề 3</option>
        <option value="">Văn bản</option>
      </select>
      <button className="ql-bold" aria-label="In đậm"></button>
      <button className="ql-italic" aria-label="In nghiêng"></button>
      <button className="ql-underline" aria-label="Gạch chân"></button>
      <button
        className="ql-list"
        value="ordered"
        aria-label="Danh sách có thứ tự"
      ></button>
      <button
        className="ql-list"
        value="bullet"
        aria-label="Danh sách không thứ tự"
      ></button>
      <button className="ql-image" aria-label="Chèn ảnh"></button>
      <button className="ql-clean" aria-label="Xóa định dạng">
        <i className="bi bi-eraser"></i>
      </button>
    </div>
  );

  const modules = {
    toolbar: {
      container: '.custom-toolbar',
    },
  };

  return (
    <div className={styles.container}>
      <h2>Sửa bài viết</h2>
      <div className={styles.formGroup}>
        <label htmlFor="title">Tiêu đề</label>
        <input
          type="text"
          name="title"
          id="title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setSlug(stringToSlug(title));
          }}
        />
      </div>
      <div className={styles.categoryPicker}>
        <label
          htmlFor="category"
          onClick={() => setIsCategoriesDropdownOpen(!isCategoriesDropdownOpen)}
        >
          Danh mục
        </label>
        <div
          className={styles.categoriesList}
          onClick={() => setIsCategoriesDropdownOpen(!isCategoriesDropdownOpen)}
        >
          {categoryName}
          <i className="bi bi-chevron-down"></i>
        </div>
        {isCategoriesDropdownOpen && (
          <div className={styles.categories}>
            {categories.map((category, index) => (
              <li
                key={index}
                className={styles.category}
                onClick={() => {
                  setIsCategoriesDropdownOpen(!isCategoriesDropdownOpen);
                  setCategoryName(category.name);
                  setCategorySlug(stringToSlug(category.name));
                }}
              >
                {category.name}
              </li>
            ))}
          </div>
        )}
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="thumbnail">Thumbnail</label>
        <div className={styles.thumbnailWrapper}>
          <img
            src={`data:image/jpeg;base64,${thumbnail}`}
            alt="Hình đại diện của bài viết"
            className={styles.thumbnail}
          />
          <input
            type="file"
            id="thumbnail"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleThumbnailChange}
          />
        </div>
      </div>
      <div className={styles.formGroup}>
        <label>Nội dung</label>
        <div className="quill-wrapper" spellCheck="false">
          {customToolbar}
          <ReactQuill
            value={content}
            modules={modules}
            onChange={handleContentChange}
            placeholder=""
            spellCheck={false}
            className={styles.quill}
          />
        </div>
      </div>
      <div className={styles.userPicker}>
        <label
          htmlFor="user"
          onClick={() => setIsUsersDropdownOpen(!isUsersDropdownOpen)}
        >
          Tác giả
        </label>
        <div
          className={styles.usersList}
          onClick={() => setIsUsersDropdownOpen(!isUsersDropdownOpen)}
        >
          {userName}
        </div>
        {isUsersDropdownOpen && (
          <div className={styles.users}>
            {users.map((user, index) => (
              <li
                key={index}
                className={styles.user}
                onClick={() => {
                  setIsUsersDropdownOpen(!isUsersDropdownOpen);
                  setUserName(user.name);
                  setUserId(user.id);
                }}
              >
                {user.name}
              </li>
            ))}
          </div>
        )}
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

export default EditPost;
