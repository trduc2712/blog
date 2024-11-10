import styles from './Header.module.scss';
import { Link, useNavigate } from 'react-router-dom';
import Dropdown from '../Dropdown/Dropdown';
import { useAuthContext } from '../../contexts/AuthContext';
import { createImageObjectURL } from '../../utils/imageUtils';
import { useState, useEffect } from 'react';

const Header = ({ isDashboard, openModalLogin, openModalSignUp }) => {
  const [userAvatarSource, setUserAvatarSource] = useState(null);

  const { user, handleLogout } = useAuthContext();

  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.avatar) {
      setUserAvatarSource(createImageObjectURL(user.avatar.data))
    }
  }, [user]);

  const dropdownChildren = [
    { label: 'Hồ sơ của tôi', onClick: () => { navigate('/my-profile'); } },
    { label: 'Đăng xuất', onClick: handleLogout }
  ];

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
            <button className={styles.createPostButton}>Tạo bài viết mới</button>
            <Dropdown trigger={<img src={userAvatarSource} alt='Hình đại diện của người dùng' className={styles.avatar} />} children={dropdownChildren} />
          </>
        ) : (
          <>
            <button onClick={openModalSignUp} className={styles.signUpButton}>Đăng ký</button>
            <button onClick={openModalLogin} className={styles.loginButton}>Đăng nhập</button>
          </>
        )}
      </div>
    </div>
  )
}

export default Header;