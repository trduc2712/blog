import styles from './MyProfile.module.scss';
import Header from '../../components/Header/Header';
import { useEffect, useState } from 'react';
import Login from '../../components/Modal/Login/Login';
import SignUp from '../../components/Modal/SignUp/SignUp';
import { useAuthContext } from '../../contexts/AuthContext';
import { createImageObjectURL } from '../../utils/imageUtils';

const MyProfile = () => {
  const [isModalLoginOpen, setIsModalLoginOpen] = useState(false);
  const [isModalSignUpOpen, setIsModalSignUpOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [avatarSource, setAvatarSource] = useState(null);

  const { user } = useAuthContext();

  const openModalLogin = () => setIsModalLoginOpen(true);
  const openModalSignUp = () => setIsModalSignUpOpen(true);
  const closeModalLogin = () => setIsModalLoginOpen(false);
  const closeModalSignUp = () => setIsModalSignUpOpen(false);

  useEffect(() => {
    document.title = 'Hồ sơ của tôi | Blog';

    if (user) {
      setUsername(user.username);
      setPassword(user.password);
      setName(user.name);
      setAvatar(user.avatar);
    }
  }, [user]);

  useEffect(() => {
    setAvatarSource(createImageObjectURL(avatar?.data));
  }, [avatar]);

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log('Username: ', username);
    console.log('Password: ', password);
    console.log('Name: ', name);
    console.log('Avatar: ', avatar);
  }

  const handleCancel = (e) => {
    e.preventDefault();

    if (user) {
      setUsername(user.username);
      setPassword(user.password);
      setName(user.name);
      setAvatar(user.avatar);
    }
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
              />
              <label htmlFor="avatar">
                <img
                  src={avatarSource} 
                  alt='Hình đại diện của người dùng' 
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
                    <input 
                    id='password' 
                    type='password' 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />                 
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
                <button className={styles.cancelButton} onClick={handleCancel}>Hủy</button>
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
    </div>
  )
}

export default MyProfile;