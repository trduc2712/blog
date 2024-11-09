import styles from './Header.module.scss';
import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Dropdown from '../Dropdown/Dropdown';

const Header = ({ isDashboard }) => {
  const [user, setUser] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() =>  {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/user`, { withCredentials: true });
        setUser(response.data.user);
      } catch(err) {
          if (err.response && err.response.data.error) {
            console.log(err.response.data.error);
          } else {
            console.log(err.message);
          }
        }
      };

    fetchUser();
  }, []);

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
            <Dropdown trigger={<img src={user.avatar} alt='Hình đại diện của người dùng' className={styles.avatar} />}/>
          </>
        ) : (
          <>
            <button onClick={() => navigate('/sign-up')} className={styles.signUpButton}>Đăng ký</button>
            <button onClick={() => navigate('/login')} className={styles.loginButton}>Đăng nhập</button>
          </>
        )}
      </div>
    </div>
  )
}

export default Header;