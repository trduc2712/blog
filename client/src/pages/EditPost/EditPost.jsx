import { useParams } from 'react-router-dom';
import styles from './EditPost.module.scss';
import { getPost as getPostService } from '@services/postService';
import { useEffect, useState } from 'react';
import { getAllCategories as getAllCategoriesService } from '@services/categoryService';
import { getUsers as getUsersService } from '@services/userService';
import { updatePost as updatePostService } from '@services/postService';
import { stringToSlug } from '@utils/string';
import { useToastContext } from '@contexts/ToastContext';
import ToastList from '@components/ToastList';
import useModal from '@hooks/useModal';
import Modal from '@components/Modal';
import Select from '@components/Select';
import Input from '@components/Input';
import Upload from '@components/Upload';
import TextEditor from '@components/TextEditor';
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

  const openConfirmUpdateModal = () => {
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

  const handleChangeTitle = (title) => {
    setTitle(title);
    setSlug(stringToSlug(title));
  };

  return (
    <>
      <div className={styles.container}>
        <div className="card">
          <div className="card-header">
            <h3>Sửa bài viết</h3>
          </div>
          <div className="card-body">
            <div className="form-group">
              <label>Tiêu đề</label>
              <Input
                type="text"
                value={title}
                onChangeValue={(e) => handleChangeTitle(e.target.value)}
                placeholder="Tiêu đề"
              />
            </div>
            <div className="select">
              <p>Chủ đề</p>
              {categoryName && (
                <Select label={categoryName} items={selectCategoryItems} />
              )}
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
            {user.role == 'ADMIN' && (
              <div className="select">
                <p>Tác giả</p>
                {userName && (
                  <Select label={userName} items={selectUserItems} />
                )}
              </div>
            )}
            <div className={styles.updateButtonWrapper}>
              <button className="primary-btn" onClick={openConfirmUpdateModal}>
                Cập nhật
              </button>
            </div>
          </div>
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

export default EditPost;
