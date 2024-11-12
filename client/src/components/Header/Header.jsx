import styles from './Header.module.scss';
import { Link, useNavigate } from 'react-router-dom';
import Dropdown from '../Dropdown/Dropdown';
import { useAuthContext } from '../../contexts/AuthContext';

const Header = ({ isDashboard, openModalLogin, openModalSignUp }) => {
  const { user, logout } = useAuthContext();

  const navigate = useNavigate();

  const dropdownChildren = [
    { label: 'Hồ sơ của tôi', onClick: () => { navigate('/my-profile'); } },
    { label: 'Bài viết của tôi', onClick: () => { navigate('my-posts'); } },
    { label: 'Đăng xuất', onClick: logout }
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
            <button className={styles.createPostButton} onClick={() => navigate('/create-post')}>Tạo bài viết mới</button>
            <Dropdown trigger={<img src={`data:image/jpeg;base64,${user.avatar}`} alt='Hình đại diện của người dùng' className={styles.avatar} />} children={dropdownChildren} />
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