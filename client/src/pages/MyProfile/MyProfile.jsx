import styles from './MyProfile.module.scss';
import Header from '@components/Header/Header';
import { useEffect, useState } from 'react';
import { useAuthContext } from '@contexts/AuthContext';
import { useToastContext } from '@contexts/ToastContext';
import { fileToBase64 } from '@utils/file';
import useModal from '@hooks/useModal';
import Modal from '@components/Modal/Modal';
import ToastList from '@components/ToastList/ToastList';
import { updateUser as updateUserService } from '@services/userService';

const MyProfile = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [userId, setUserId] = useState('');
  const [role, setRole] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [modalContent, setModalContent] = useState({});

  const { user, setUser } = useAuthContext();
  const { createToast } = useToastContext();

  const { isOpen, openModal, closeModal } = useModal();

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
    setModalContent({
      title: 'Thông báo',
      cancelLabel: 'Không',
      confirmLabel: 'Có',
      message: 'Bạn có chắc chắn muốn lưu các thay đổi này không?',
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
        if (user) {
          setUsername(user.username);
          setPassword(user.password);
          setName(user.name);
          setAvatar(user.avatar);
          setRole(user.role);
        }
        closeModal();
      },
    });
    openModal();
  };

  useEffect(() => {
    document.title = 'Hồ sơ của tôi | Blog';

    if (user) {
      setUserId(user.id);
      setUsername(user.username);
      setPassword(user.password);
      setName(user.name);
      setAvatar(user.avatar);
      setRole(user.role);
    }
  }, [user]);

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];

    if (!file) {
      console.log('Vui lòng chọn ảnh');
      return;
    }

    const base64 = await fileToBase64(file);
    setAvatar(base64);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    openConfirmUpdateModal();
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <div className={styles.container}>
      <Header isDashboard={false} />
      <div className={styles.contentWrapper}>
        {user ? (
          <div className={styles.content}>
            <h2>Hồ sơ của tôi</h2>
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
                    value={username}
                    disabled
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="password">Mật khẩu</label>
                  <div className={styles.inputPasswordWrapper}>
                    <input
                      id="password"
                      type={isPasswordVisible ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="name">Tên</label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
              <div className={styles.buttons}>
                <button
                  type="submit"
                  className={`${styles.create} primary-btn`}
                >
                  Lưu
                </button>
              </div>
            </form>
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

export default MyProfile;
