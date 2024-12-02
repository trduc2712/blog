import styles from './Header.module.scss';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useModal from '@hooks/useModal';
import { useAuthContext } from '@contexts/AuthContext';
import { useToastContext } from '@contexts/ToastContext';
import Dropdown from '@components/Dropdown/Dropdown';
import Modal from '@components/Modal/Modal';

const Header = ({ isDashboard }) => {
  const [modal, setModal] = useState({});
  const [dropdownItems, setDropdownItems] = useState([]);

  const { user, logout } = useAuthContext();
  const { createToast } = useToastContext();

  const navigate = useNavigate();

  const { isOpen, openModal, closeModal } = useModal();

  const generateDropdownItems = () => {
    const items = [];

    if (!isDashboard) {
      if (user) {
        user.role === 'ADMIN' &&
          items.push({
            label: 'Trang quản trị',
            onClick: () => navigate('/dashboard'),
          });
      }
      items.push(
        { label: 'Hồ sơ của tôi', onClick: () => navigate('/my-profile') },
        { label: 'Bài viết của tôi', onClick: () => navigate('/my-posts') }
      );
    } else {
      items.push({ label: 'Trang chủ', onClick: () => navigate('/') });
    }

    items.push({
      label: 'Đăng xuất',
      onClick: openConfirmLogoutModal,
    });

    return items;
  };

  useEffect(() => {
    setDropdownItems(generateDropdownItems);
  }, [user, isDashboard]);

  const openConfirmLogoutModal = () => {
    setModal({
      title: 'Cảnh báo',
      cancelLabel: 'Không',
      confirmLabel: 'Có',
      message: 'Bạn có chắc chắn muốn đăng xuất không?',
      onConfirm: () => {
        logout();
        closeModal();
        createToast({
          type: 'success',
          title: 'Thành công',
          message: 'Đăng xuất thành công.',
        });
        navigate('/');
      },
      onCancel: closeModal,
    });
    openModal();
  };

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        {isDashboard ? (
          <h1>
            <Link to="/dashboard">Dashboard</Link>
          </h1>
        ) : (
          <h1>
            <Link to="/">Blog</Link>
          </h1>
        )}
      </div>
      <div className={styles.right}>
        {user ? (
          <>
            {!isDashboard && (
              <>
                <button
                  className={`${styles.createPost} primary-btn`}
                  onClick={() => navigate('/create-post')}
                >
                  <i className="bi bi-plus"></i> Tạo bài viết mới
                </button>
              </>
            )}
            <Dropdown
              trigger={
                <img
                  src={`data:image/jpeg;base64,${user.avatar}`}
                  alt="Hình đại diện của người dùng."
                  className={styles.avatar}
                />
              }
              items={dropdownItems}
            />
          </>
        ) : (
          <>
            <button
              className={`${styles.signUp} primary-btn`}
              onClick={() => navigate('/sign-up')}
            >
              Đăng ký
            </button>
            <button
              className={`${styles.login} primary-btn`}
              onClick={() => navigate('/login')}
            >
              Đăng nhập
            </button>
          </>
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
      />
    </div>
  );
};

export default Header;
