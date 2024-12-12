import { useParams } from 'react-router-dom';
import styles from './EditUser.module.scss';
import { useEffect, useState } from 'react';
import {
  getUser as getUserService,
  updateUser as updateUserService,
} from '@services/userService';
import { fileToBase64 } from '@utils/file';
import { useToastContext } from '@contexts/ToastContext';
import ToastList from '@components/ToastList/ToastList';
import useModal from '@hooks/useModal';
import Modal from '@components/Modal/Modal';

const EditUser = () => {
  const { userId } = useParams();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [user, setUser] = useState();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [role, setRole] = useState('');
  const [modal, setModal] = useState('');

  const { createToast } = useToastContext();

  const { isOpen, openModal, closeModal } = useModal();

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  useEffect(() => {
    const getUser = async (id) => {
      try {
        const user = await getUserService(id);
        setUser(user);
      } catch (err) {
        console.log(err);
      }
    };

    getUser(userId);
  }, []);

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setPassword(user.password);
      setAvatar(user.avatar);
      setName(user.name);
      setRole(user.role);
    }
  }, [user]);

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    const base64 = await fileToBase64(file);
    setAvatar(base64);
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
        createToast({
          type: 'success',
          title: 'Thông báo',
          message: 'Cập nhật thông tin người dùng thành công.',
        });
      },
      onCancel: () => {
        closeModal();
      },
    });
    openModal();
  };

  const handleUpdate = () => {
    const updateUser = async (
      userId,
      username,
      password,
      name,
      avatar,
      role
    ) => {
      try {
        const updatedUser = await updateUserService(
          userId,
          username,
          password,
          name,
          avatar,
          role
        );
        setUser(updatedUser);
      } catch (err) {
        console.log(err.error);
      }
    };

    updateUser(userId, username, password, name, avatar, role);
  };

  return (
    <div className={styles.container}>
      <h2>Sửa người dùng</h2>
      <div className={styles.avatarWrapper}>
        <input
          type="file"
          id="avatar"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleAvatarChange}
        />
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
      <div className={styles.formGroup}>
        <label htmlFor="username">Tên người dùng</label>
        <input
          type="text"
          name="username"
          id="username"
          value={username}
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
          type="text"
          name="name"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className={styles.rolePicker}>
        <label
          htmlFor="role"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          Vai trò
        </label>
        <div
          className={styles.roleList}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          {role == 'ADMIN' ? 'Quản trị viên' : 'Người dùng'}
          <i className="bi bi-chevron-down"></i>
        </div>
        {isDropdownOpen && (
          <div className={styles.roles}>
            <li
              className={styles.role}
              onClick={() => {
                setRole('USER');
                setIsDropdownOpen(!isDropdownOpen);
              }}
            >
              Người dùng
            </li>
            <li
              className={styles.role}
              onClick={() => {
                setRole('ADMIN');
                setIsDropdownOpen(!isDropdownOpen);
              }}
            >
              Quản trị viên
            </li>
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

export default EditUser;
