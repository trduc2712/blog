import styles from './Overview.module.scss';
import Pagination from '@components/Pagination';
import PostCardList from '@components/PostCardList';
import Upload from '@components/Upload';
import { useEffect, useState } from 'react';
import { useAuthContext } from '@contexts/AuthContext';
import { useToastContext } from '@contexts/ToastContext';
import useModal from '@hooks/useModal';
import Modal from '@components/Modal';
import Input from '@components/Input';
import {
  updateUser as updateUserService,
  getUser as getUserService,
} from '@services/userService';
import {
  getPostsWithPagination as getPostsWithPaginationService,
  getPostsCount as getPostsCountService,
} from '@services/postService';
import { useParams, useLocation } from 'react-router-dom';
import { deletePostById as deletePostByIdService } from '@services/postService';

const Overview = () => {
  const [userId, setUserId] = useState('');
  const [role, setRole] = useState('');
  const [password, setPassword] = useState('');
  const [userUsername, setUserUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const postsPerPage = 6;
  const [modal, setModal] = useState({
    title: '',
    cancelLabel: '',
    confirmLabel: '',
    message: '',
    type: '',
    onConfirm: () => {},
    onCancel: () => {},
  });

  const { user, setUser } = useAuthContext();
  const { createToast } = useToastContext();

  const { isOpen, openModal, closeModal } = useModal();

  const { username } = useParams();

  const location = useLocation();

  useEffect(() => {
    document.title = 'Hồ sơ người dùng | Blog';

    const getUser = async () => {
      if (!user || user.username !== username) {
        try {
          const user = await getUserService(username);
          if (user) {
            setUserUsername(user.username);
            setAvatar(user.avatar);
            setPassword(user.password);
            setName(user.name);
          }
        } catch (err) {
          console.log(err);
        }
      } else {
        setUserId(user.id);
        setUserUsername(user.username);
        setPassword(user.password);
        setName(user.name);
        setAvatar(user.avatar);
        setRole(user.role);
      }
    };

    getUser();
  }, [user, username]);

  useEffect(() => {
    const getPosts = async () => {
      const urlParams = new URLSearchParams(location.search);
      const keyword = urlParams.get('keyword') || '';
      const time = urlParams.get('time') || '';
      const alphabet = urlParams.get('alphabet') || '';
      const categorySlug = urlParams.get('category') || '';

      await getPostsWithPagination(
        keyword,
        time,
        alphabet,
        categorySlug,
        username
      );
    };

    getPosts();
  }, [location.search, currentPage]);

  const getPostsWithPagination = async (
    keyword,
    time,
    alphabet,
    categorySlug,
    username
  ) => {
    window.scrollTo(0, 0);

    try {
      setLoading(true);

      const postsCount = await getPostsCountService(
        currentPage,
        postsPerPage,
        keyword,
        time,
        alphabet,
        categorySlug,
        username
      );

      const postsWithPagination = await getPostsWithPaginationService(
        currentPage,
        postsPerPage,
        keyword,
        time,
        alphabet,
        categorySlug,
        username
      );

      if (postsWithPagination == null) {
        setPosts([]);
      } else {
        setPosts(postsWithPagination);
        const totalPages = Math.ceil(postsCount / postsPerPage);
        setTotalPages(totalPages);
        if (totalPages == 1) setCurrentPage(1);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validNamePattern = /^[a-zA-ZÀ-ỹà-ý ]*$/;
    const validPasswordPattern = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;

    if (!validNamePattern.test(name)) {
      createToast({
        type: 'warning',
        title: 'Cảnh báo',
        message: 'Tên không được chứa ký tự đặc biệt.',
      });
      return;
    }

    if (!validPasswordPattern.test(password)) {
      createToast({
        type: 'warning',
        title: 'Cảnh báo',
        message:
          'Mật khẩu phải có ít nhất 8 ký tự và bao gồm cả chữ cái và số.',
      });
      return;
    }

    openConfirmUpdateModal();
  };

  const handleDeletePost = (id) => {
    openConfirmDeletePostModal(id);
  };

  const openConfirmDeletePostModal = (id) => {
    setModal({
      title: 'Cảnh báo',
      cancelLabel: 'Hủy',
      confirmLabel: 'Xóa',
      message: `Bạn có chắc chắn muốn xóa bài viết này không?`,
      type: 'destructive',
      onConfirm: () => {
        deletePostById(id);
        setPosts((prevPosts) => prevPosts.filter((post) => post.id != id));
        closeModal();
      },
      onCancel: () => {
        closeModal();
      },
    });
    openModal();
  };

  const deletePostById = async (id) => {
    try {
      await deletePostByIdService(id);
      createToast({
        type: 'success',
        title: 'Thông báo',
        message: 'Xóa bài viết thành công',
      });
    } catch (err) {
      createToast({
        type: 'success',
        title: 'Thông báo',
        message: 'Xóa bài viết thất bại',
      });
    }
  };

  const openConfirmUpdateModal = () => {
    console.log('openConfirmUpdateModal is running');
    setModal({
      title: 'Xác nhận',
      cancelLabel: 'Hủy',
      confirmLabel: 'Lưu',
      message: 'Bạn có chắc chắn muốn lưu các thay đổi này không?',
      type: 'confirmation',
      onConfirm: () => {
        updateUser(userId, username, password, name, avatar, role);
        closeModal();
        createToast({
          type: 'success',
          title: 'Thông báo',
          message: 'Cập nhật thông tin cá nhân thành công.',
        });
      },
      onCancel: () => {
        closeModal();
      },
    });
    openModal();
  };

  const updateUser = async (id, username, password, name, avatar, role) => {
    if (!id || !username || !password || !name || !avatar || !role) {
      console.log('Thieu thong tin');
      if (!id) {
        console.log('Thieu id');
      } else if (!username) {
        console.log('Thieu username');
      } else if (!password) {
        console.log('Thieu password');
      } else if (!name) {
        console.log('Thieu name');
      } else if (!avatar) {
        console.log('Thieu avatar');
      } else if (!role) {
        console.log('Thieu role');
      }
      return;
    }

    if (user) {
      try {
        const updatedUser = await updateUserService(
          id,
          username,
          password,
          name,
          avatar,
          role
        );

        setUser(updatedUser);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleChangePassword = (password) => {
    setPassword(password);
  };

  const handleChangeName = (name) => {
    setName(name);
  };

  return (
    <>
      <div className={styles.container}>
        {user ? (
          !loading ? (
            <>
              <div className="card">
                <div className="card-header">
                  <h3>Thông tin cá nhân</h3>
                </div>
                <div className="card-body">
                  <form onSubmit={handleSubmit}>
                    <Upload
                      type="avatar"
                      upload={avatar}
                      setUpload={setAvatar}
                    />
                    <div className="form-group">
                      <label>Tên người dùng</label>
                      <Input
                        variant="text"
                        placeholder="Tên người dùng"
                        value={userUsername}
                        isDisabled={true}
                      />
                    </div>
                    {user && username && user.username == username && (
                      <div className="form-group">
                        <label>Mật khẩu</label>
                        <Input
                          variant="password"
                          placeholder="Mật khẩu"
                          value={password}
                          onChangeValue={(e) =>
                            handleChangePassword(e.target.value)
                          }
                        />
                      </div>
                    )}
                    <div className="form-group">
                      <label>Tên</label>
                      <Input
                        variant="text"
                        placeholder="Tên"
                        value={name}
                        onChangeValue={(e) => handleChangeName(e.target.value)}
                        isDisabled={
                          (user && username && user.username != username) ||
                          false
                        }
                      />
                    </div>
                    {user && username && user.username == username && (
                      <button
                        type="submit"
                        className="secondary-btn"
                        onClick={handleSubmit}
                      >
                        Lưu
                      </button>
                    )}
                  </form>
                </div>
              </div>
              <div className="card">
                <div className="card-header">
                  <h3>Danh sách bài viết</h3>
                </div>
                <div className="card-body">
                  {posts.length > 0 ? (
                    <div className={styles.postCardList}>
                      <PostCardList
                        posts={posts}
                        onDeletePost={handleDeletePost}
                      />
                      <div className={styles.pagination}>
                        <Pagination
                          totalPages={totalPages}
                          currentPage={currentPage}
                          onPageChange={handlePageChange}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className={styles.notFound}>
                      Không có bài viết nào.
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="loading">Đang tải...</div>
          )
        ) : (
          <div className="not-logged-in">Chưa đăng nhập.</div>
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
    </>
  );
};

export default Overview;
