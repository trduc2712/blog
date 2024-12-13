import styles from './CreateUser.module.scss';
import { useEffect, useState } from 'react';
import { fileToBase64 } from '@utils/file';
import { useToastContext } from '@contexts/ToastContext';
import ToastList from '@components/ToastList/ToastList';
import useModal from '@hooks/useModal';
import Modal from '@components/Modal/Modal';
import { useNavigate } from 'react-router-dom';
import { signUp } from '@services/authService';
import Select from '@components/Select';

const CreateUser = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [role, setRole] = useState('USER');
  const [modal, setModal] = useState('');
  const [selectRoleItems, setSelectRoleItems] = useState([]);

  const { createToast } = useToastContext();

  const { isOpen, openModal, closeModal } = useModal();

  const navigate = useNavigate();

  useEffect(() => {
    const items = [
      {
        label: 'Quản trị viên',
        onClick: () => {
          setRole('ADMIN');
        },
      },
      {
        label: 'Người dùng',
        onClick: () => {
          setRole('ADMIN');
        },
      },
    ];
    setSelectRoleItems(items);
  }, []);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    const base64 = await fileToBase64(file);
    setAvatar(base64);
  };

  const openConfirmCreateModal = () => {
    if (!username || !password || !name || !avatar) {
      createToast({
        type: 'warning',
        title: 'Cảnh báo',
        message: 'Vui lòng điền đầy đủ thông tin yêu cầu',
      });
      return;
    }
    setModal({
      title: 'Xác nhận',
      cancelLabel: 'Không',
      confirmLabel: 'Có',
      message: 'Bạn có chắc chắn muốn tạo người dùng mới này không?',
      type: 'confirmation',
      onConfirm: () => {
        handleCreate();
        closeModal();
        createToast({
          type: 'success',
          title: 'Thông báo',
          message: 'Tạo mới người dùng thành công',
        });
        navigate('/dashboard/users');
      },
      onCancel: () => {
        closeModal();
      },
    });
    openModal();
  };

  const handleCreate = () => {
    const createUser = async (username, password, name, avatar, role) => {
      try {
        const user = await signUp(username, password, name, avatar, role);
        setUser(user);
      } catch (err) {
        console.log(err.error);
      }
    };

    createUser(username, password, name, avatar, role);
  };

  return (
    <div className={styles.container}>
      <h2>Thêm người dùng</h2>
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
      <div className={styles.select}>
        <p>Vai trò</p>
        <Select
          label={`${role == 'ADMIN' ? 'Quản trị viên' : 'Người dùng'}`}
          items={selectRoleItems}
        />
      </div>
      <div className={styles.createButtonWrapper}>
        <button
          className={`${styles.createButton} primary-btn`}
          onClick={openConfirmCreateModal}
        >
          Thêm
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

export default CreateUser;
