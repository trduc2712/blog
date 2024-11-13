import styles from './MyProfile.module.scss';
import Header from '../../components/Header/Header';
import { useEffect, useState } from 'react';
import Login from '../../components/Login/Login';
import SignUp from '../../components/SignUp/SignUp';
import { useAuthContext } from '../../contexts/AuthContext';
import { fileToBase64 } from '../../utils/file';
import useModal from '../../hooks/useModal';
import Modal from '../../components/Modal/Modal';

const MyProfile = () => {
  const [isModalLoginOpen, setIsModalLoginOpen] = useState(false);
  const [isModalSignUpOpen, setIsModalSignUpOpen] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [modalContent, setModalContent] = useState({});
  
  const { user, updateUser } = useAuthContext();

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
      message: 'Bạn có chắc chắn muốn lưu các thay đổi này?',
      onConfirm: () => {
        updateUser(username, password, name, avatar);
        closeModal();
      },
      onCancel: () => {
        if (user) {
          setUsername(user.username);
          setPassword(user.password);
          setName(user.name);
          setAvatar(user.avatar);
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
              <label htmlFor="avatar">
                <img
                  src={`data:image/jpeg;base64,${avatar}`} 
                  alt="Hình đại diện của người dùng"
                  className={styles.avatar}
                />
              </label>
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
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye-slash" viewBox="0 0 16 16">
                          <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z"/>
                          <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829"/>
                          <path d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z"/>
                        </svg>
                      :
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16">
                          <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/>
                          <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
                        </svg>
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
          <div className={styles.content}>
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
    </div>
  )
}

export default MyProfile;