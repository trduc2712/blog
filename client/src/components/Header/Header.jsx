import styles from './Header.module.scss';
import { Link, useNavigate } from 'react-router-dom';
import { useToastContext } from '../../contexts/ToastContext';
import { useAuthContext } from '../../contexts/AuthContext';
import { useEffect, useState } from 'react';
import Dropdown from '../Dropdown/Dropdown';
import useModal from '../../hooks/useModal';
import Modal from '../Modal/Modal';

const Header = ({ isDashboard, openModalLogin, openModalSignUp }) => {
  const { user, logout } = useAuthContext();
  const [modalContent, setModalContent] = useState({});
  const [dropdownChildren, setDropdownChildren] = useState([]);

  const navigate = useNavigate();

  const { isOpen, openModal, closeModal } = useModal();

  const { addToast } = useToastContext();

  useEffect(() => {
    const items = [];
    if (!isDashboard) {
      if (user) {
        if (user.role == 'ADMIN') 
          items.push({ label: 'Trang quản trị', onClick: () => navigate('/dashboard') });
      }
      items.push(
        { label: 'Hồ sơ của tôi', onClick: () => navigate('/my-profile') },
        { label: 'Bài viết của tôi', onClick: () => navigate('/my-posts') },
      );
    } else {
      items.push({ label: 'Trang chủ', onClick: () => navigate('/') });
    }
    
    items.push({ label: 'Đăng xuất', onClick: () => { openConfirmLogoutModal(); } });

    setDropdownChildren(items);
  }, [user, isDashboard]);

  const openConfirmLogoutModal = () => {
    setModalContent({
      title: 'Cảnh báo',
      cancelLabel: 'Không',
      confirmLabel: 'Có',
      message: 'Bạn có chắc chắn muốn đăng xuất không?',
      onConfirm: () => {
        logout();
        closeModal();
        addToast({
          type: 'success',
          title: "Thông báo",
          message: "Đăng xuất thành công.",
        });
        navigate('/');
      },
      onCancel: closeModal
    });
    openModal();
  };

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        {isDashboard ? (
          <h1><Link to='/dashboard'>Dashboard</Link></h1>
        ) : (
          <h1><Link to='/'>Blog</Link></h1>
        )}
      </div>
      <div className={styles.right}>
        {user ? (
          <>
            {!isDashboard && (<button className={styles.createPost} onClick={() => navigate('/create-post')}>Tạo bài viết mới</button>)}
            <Dropdown trigger={<img src={`data:image/jpeg;base64,${user.avatar}`} alt='Hình đại diện của người dùng.' className={styles.avatar} />} children={dropdownChildren} />
          </>
        ) : (
          <>
            <button onClick={openModalSignUp} className={styles.signUp}>Đăng ký</button>
            <button onClick={openModalLogin} className={styles.login}>Đăng nhập</button>
          </>
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
    </div>
  )
}

export default Header;