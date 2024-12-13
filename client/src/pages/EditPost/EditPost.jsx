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
import ToastList from '@components/ToastList';
import useModal from '@hooks/useModal';
import Modal from '@components/Modal';
import Select from '@components/Select';
import { useAuthContext } from '@contexts/AuthContext';

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
  const [modal, setModal] = useState('');
  const [selectUserItems, setSelectUserItems] = useState([]);
  const [selectCategoryItems, setSelectCategoryItems] = useState([]);

  const { postId } = useParams();

  const { createToast } = useToastContext();
  const { user } = useAuthContext();

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
    if (categories) {
      const items = categories.map((category) => ({
        label: category.name,
        onClick: () => {
          setCategorySlug(category.slug);
          setCategoryName(category.name);
        },
      }));
      setSelectCategoryItems(items);
    }
  }, [categories]);

  useEffect(() => {
    if (users) {
      const user = users.find((user) => user.name == userName);
      setUserId(user.id);

      const items = users.map((user) => ({
        label: user.name,
        onClick: () => {
          setUserName(user.name);
          setUserId(user.id);
        },
      }));
      setSelectUserItems(items);
    }
  }, [users]);

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setSlug(stringToSlug(post.title));
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
      return;
    }

    const base64 = await fileToBase64(file);
    setThumbnail(base64);
  };

  const openConfirmUpdateModal = () => {
    setModal({
      title: 'Xác nhận',
      cancelLabel: 'Không',
      confirmLabel: 'Có',
      message: 'Bạn có chắc chắn muốn lưu các thay đổi này không?',
      type: 'confirmation',
      onConfirm: () => {
        handleUpdate();
        closeModal();
      },
      onCancel: () => {
        closeModal();
      },
    });
    openModal();
  };

  const handleUpdate = () => {
    setCategorySlug(stringToSlug(categoryName));
    setSlug(stringToSlug(title));

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
        createToast({
          type: 'success',
          title: 'Thông báo',
          message: 'Cập nhật bài viết thành công.',
        });
      } catch (err) {
        console.log(err);
        return;
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
      <div className={styles.select}>
        <p>Chủ đề</p>
        {categoryName && (
          <Select label={categoryName} items={selectCategoryItems} />
        )}
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="thumbnail">Thumbnail</label>
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
      {user.role == 'ADMIN' && (
        <div className={styles.select}>
          <p>Tác giả</p>
          {userName && <Select label={userName} items={selectUserItems} />}
        </div>
      )}
      <div className={styles.updateButtonWrapper}>
        <button
          className={`${styles.updateButton} primary-btn`}
          onClick={openConfirmUpdateModal}
        >
          Cập nhật
        </button>
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
    </div>
  );
};

export default EditPost;
