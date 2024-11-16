import styles from './MyProfile.module.scss';
import Header from '../../components/Header/Header';
import { useEffect, useState } from 'react';
import Login from '../../components/Login/Login';
import SignUp from '../../components/SignUp/SignUp';
import { useAuthContext } from '../../contexts/AuthContext';
import { useToastContext } from '../../contexts/ToastContext';
import { fileToBase64 } from '../../utils/file';
import useModal from '../../hooks/useModal';
import Modal from '../../components/Modal/Modal';
import ToastList from '../../components/ToastList/ToastList';

const MyProfile = () => {
  const [isModalLoginOpen, setIsModalLoginOpen] = useState(false);
  const [isModalSignUpOpen, setIsModalSignUpOpen] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [modalContent, setModalContent] = useState({});
  
  const { user, updateCurrentUser } = useAuthContext();
  const { addToast } = useToastContext();

  const { isOpen, openModal, closeModal } = useModal();

  const openModalLogin = () => setIsModalLoginOpen(true);
  const openModalSignUp = () => setIsModalSignUpOpen(true);
  const closeModalLogin = () => setIsModalLoginOpen(false);
  const closeModalSignUp = () => setIsModalSignUpOpen(false);

  const openConfirmUpdateModal = () => {
    setModalContent({
      title: 'Thông báo',
      cancelLabel: 'Không',
      confirmLabel: 'Có',
      message: 'Bạn có chắc chắn muốn lưu các thay đổi này không?',
      onConfirm: () => {
        updateCurrentUser(username, password, name, avatar);
        closeModal();
        addToast({
          title: "Thông báo",
          message: "Cập nhật người dùng thành công",
        });
      },
      onCancel: () => {
        if (user) {
          setUsername(user.username);
          setPassword(user.password);
          setName(user.name);
          setAvatar(user.avatar);
          setRole(user.role);
        };
        closeModal();
      }
    });
    openModal();
  };

  useEffect(() => {
    document.title = 'Hồ sơ của tôi | Blog';

    if (user) {
      setUsername(user.username);
      setPassword(user.password);
      setName(user.name);
      setAvatar(user.avatar);
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
  }

  return (
    <div className={styles.container}>
      <Header
        isDashboard={false}
        openModalLogin={openModalLogin}
        openModalSignUp={openModalSignUp}
      />
      <div className={styles.contentWrapper}>
        {user ? (
          <div className={styles.content}>
            <h1>Hồ sơ của tôi</h1>
            <form onSubmit={handleSubmit}>
              <input
                type="file"
                id="avatar"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleAvatarChange}
              />
              <div className={styles.avatarWrapper}>
                <label htmlFor="avatar">
                  <img
                    src={`data:image/jpeg;base64,${avatar}`} 
                    alt="Hình đại diện của người dùng"
                    className={styles.avatar}
                  />
                </label>
              </div>
              <div className={styles.formGroups}>
                <div className={styles.formGroup}>
                  <label htmlFor='username'>Tên người dùng</label>
                  <input
                    id='username' 
                    type='text'
                    value={username} 
                    disabled
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor='password'>Mật khẩu</label>
                  <div className={styles.inputPasswordWrapper}>
                    <input 
                      id='password' 
                      type={isPasswordVisible ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <div className={styles.togglePassword} onClick={togglePasswordVisibility}>
                      {isPasswordVisible ?
                        <i className="bi bi-eye-slash"></i>
                      :
                        <i className="bi bi-eye"></i>
                      }
                    </div>
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor='name'>Tên</label>
                  <input 
                    id='name' 
                    type='text' 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
              <div className={styles.buttons}>
                <button type='submit' className={styles.saveButton}>Lưu</button>
              </div>
            </form>
          </div>
        ) : (
          <div className={styles.notLoggedIn}>
            <p>Chưa đăng nhập</p>
          </div>
        )}
      </div>
      <Login isOpen={isModalLoginOpen} onClose={closeModalLogin} />
      <SignUp isOpen={isModalSignUpOpen} onClose={closeModalSignUp} />
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
  )
}

export default MyProfile;