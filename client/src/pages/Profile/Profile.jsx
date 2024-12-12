import styles from './Profile.module.scss';
import Header from '@components/Header';
import { useEffect, useState } from 'react';
import { useAuthContext } from '@contexts/AuthContext';
import { useToastContext } from '@contexts/ToastContext';
import { fileToBase64 } from '@utils/file';
import useModal from '@hooks/useModal';
import Modal from '@components/Modal';
import ToastList from '@components/ToastList';
import Pagination from '@components/Pagination';
import PostCardList from '@components/PostCardList';
import {
  updateUser as updateUserService,
  getUser as getUserService,
} from '@services/userService';
import {
  getPostsWithPagination as getPostsWithPaginationService,
  getPostsCountByUsername as getPostsCountByUsernameService,
} from '@services/postService';
import { useParams, useLocation } from 'react-router-dom';
import Footer from '@components/Footer';
import { deletePostById as deletePostByIdService } from '@services/postService';

const MyProfile = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [userId, setUserId] = useState('');
  const [role, setRole] = useState('');
  const [userUsername, setUserUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [keyword, setKeyword] = useState('');
  const [categorySlug, setCategorySlug] = useState('');
  const [filter, setFilter] = useState('');
  const [nameError, setNameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const postsPerPage = 9;
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

  const updateUser = async (id, username, password, name, avatar, role) => {
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

  const openConfirmUpdateModal = () => {
    setModal({
      title: 'Xác nhận',
      cancelLabel: 'Không',
      confirmLabel: 'Có',
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

  const addParam = (param, value) => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set(param, value);
    navigate(`${window.location.pathname}?${searchParams.toString()}`);
  };

  const removeParam = (param) => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.delete(param);
    navigate(`${window.location.pathname}?${searchParams.toString()}`);
  };

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
    getPosts();
  }, [user, username]);

  useEffect(() => {
    getPosts();
  }, [location.search, currentPage]);

  const getPosts = async () => {
    const urlParams = new URLSearchParams(location.search);
    const newKeyword = urlParams.get('keyword') || '';
    const newFilter = urlParams.get('filter') || '';
    const newCategorySlug = urlParams.get('categorySlug') || '';

    setKeyword(newKeyword);
    setFilter(newFilter);
    setCategorySlug(newCategorySlug);

    if (newKeyword) {
      await searchPost(newKeyword, newFilter);
    } else {
      await getPostsWithPagination(newFilter, newCategorySlug, username);
    }
  };

  const getPostsWithPagination = async (filter, categorySlug, username) => {
    window.scrollTo(0, 0);

    try {
      setLoading(true);

      const postsWithPagination = await getPostsWithPaginationService(
        currentPage,
        postsPerPage,
        filter,
        categorySlug,
        username
      );

      const postCount = await getPostsCountByUsernameService(
        username,
        currentPage,
        postsPerPage
      );

      if (postsWithPagination == null) {
        setPosts([]);
      } else {
        setPosts(postsWithPagination);
        setTotalPages(Math.ceil(postCount / postsPerPage));
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

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    const base64 = await fileToBase64(file);
    setAvatar(base64);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name) {
      setNameError('Vui lòng điền tên.');
      return;
    }

    if (!password) {
      setPasswordError('Vui lòng điền mật khẩu.');
      return;
    }

    const validNamePattern = /^[a-zA-ZÀ-ỹà-ý ]*$/;
    const validPasswordPattern = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;

    if (!validNamePattern.test(name)) {
      setNameError('Tên không hợp lệ.');
      return;
    }

    if (!validPasswordPattern.test(password)) {
      setPasswordError('Mật khẩu không hợp lệ.');
      return;
    }

    openConfirmUpdateModal();
  };

  const handleResetPasswordError = () => {
    setPasswordError('');
  };

  const handleResetNameError = () => {
    setNameError('');
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleDeletePost = (id) => {
    openConfirmDeletePostModal(id);
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

  const openConfirmDeletePostModal = (id) => {
    setModal({
      title: 'Cảnh báo',
      cancelLabel: 'Không',
      confirmLabel: 'Có',
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

  return (
    <div className={styles.container}>
      <Header isDashboard={false} />
      <div className={styles.contentWrapper}>
        {user ? (
          !loading ? (
            <>
              <div className={styles.content}>
                <div className={styles.title}>
                  <h3>
                    Danh sách bài viết của{' '}
                    {user.username == username
                      ? 'tôi'
                      : `người dùng ${username}`}
                  </h3>
                </div>
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
                  <div className={styles.notFound}>Không có bài viết nào.</div>
                )}
              </div>
              <div className={styles.sidebar}>
                <div className={styles.userInfo}>
                  <div className={styles.userInfoTop}>
                    <h3>Thông tin cá nhân</h3>
                  </div>
                  <div className={styles.userInfoBody}>
                    <form onSubmit={handleSubmit}>
                      <input
                        type="file"
                        id="avatar"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleAvatarChange}
                      />
                      <div className={styles.avatarWrapper}>
                        <label
                          htmlFor="avatar"
                          className={`${avatar ? styles.avatarLabel : styles.notFoundAvatar}`}
                          style={{
                            pointerEvents: `${user.username == userUsername ? 'auto' : 'none'}`,
                          }}
                        >
                          <img
                            src={`data:image/jpeg;base64,${avatar}`}
                            alt="Hình đại diện của người dùng"
                            className={`${avatar ? styles.avatar : styles.hide}`}
                          />
                          <>
                            {avatar ? (
                              <div className={styles.change}>
                                <i className="bi bi-pen"></i>
                              </div>
                            ) : (
                              <div className={styles.upload}>
                                <i className="bi bi-plus"></i>
                                <p>Tải lên</p>
                              </div>
                            )}
                          </>
                        </label>
                      </div>
                      <div className={styles.formGroups}>
                        <div className={styles.formGroup}>
                          <label htmlFor="username">Tên người dùng</label>
                          <input
                            id="username"
                            type="text"
                            value={userUsername}
                            disabled
                            onChange={(e) => setUserUsername(e.target.value)}
                          />
                        </div>
                        {user.username == username && (
                          <div className={styles.formGroup}>
                            <label htmlFor="password">Mật khẩu</label>
                            <div className={styles.inputPasswordWrapper}>
                              <input
                                id="password"
                                className={
                                  passwordError ? styles.redBorder : ''
                                }
                                type={isPasswordVisible ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onFocus={handleResetPasswordError}
                              />
                              <div
                                className={styles.togglePassword}
                                onClick={togglePasswordVisibility}
                              >
                                {isPasswordVisible ? (
                                  <i className="bi bi-eye-slash"></i>
                                ) : (
                                  <i className="bi bi-eye"></i>
                                )}
                              </div>
                            </div>
                            <p className={styles.passwordError}>
                              {passwordError}
                            </p>
                          </div>
                        )}
                        <div
                          className={styles.formGroup}
                          style={{
                            marginBottom: `${user.username == username ? '' : '10px'}`,
                          }}
                        >
                          <label htmlFor="name">Tên</label>
                          <input
                            id="name"
                            className={nameError ? styles.redBorder : ''}
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onFocus={handleResetNameError}
                            disabled={user.username != username}
                          />
                          {user.username == username && (
                            <p className={styles.nameError}>{nameError}</p>
                          )}
                        </div>
                      </div>
                    </form>
                  </div>
                  {user.username == username && (
                    <div className={styles.userInfoBottom}>
                      <button
                        type="submit"
                        className="secondary-btn"
                        onClick={handleSubmit}
                      >
                        Lưu
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className={styles.loading}>Đang tải...</div>
          )
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
        type={modal.type}
        cancelLabel={modal.cancelLabel}
        confirmLabel={modal.confirmLabel}
        onConfirm={modal.onConfirm}
        onCancel={modal.onCancel}
        message={modal.message}
        buttonLabel={modal.buttonLabel}
      />
      <ToastList />
      <Footer />
    </div>
  );
};

export default MyProfile;
