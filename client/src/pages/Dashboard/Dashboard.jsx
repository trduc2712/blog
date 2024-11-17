import styles from './Dashboard.module.scss';
import Header from '../../components/Header/Header';
import { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Login from '../../components/Login/Login';
import SignUp from '../../components/SignUp/SignUp';
import ToastList from '../../components/ToastList/ToastList';

const Dashboard = () => {
  const [isModalLoginOpen, setIsModalLoginOpen] = useState(false);
  const [isModalSignUpOpen, setIsModalSignUpOpen] = useState(false);
  const [currentRoute, setCurrentRoute] = useState('');

  const openModalLogin = () => setIsModalLoginOpen(true);
  const closeModalLogin = () => setIsModalLoginOpen(false);
  const openModalSignUp = () => setIsModalSignUpOpen(true);
  const closeModalSignUp = () => setIsModalSignUpOpen(false);

  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    if (location.pathname.includes('posts')) {
      setCurrentRoute('posts');
    } else if (location.pathname.includes('users')) {
      setCurrentRoute('users');
    } else if (location.pathname.includes('categories')) {
      setCurrentRoute('categories');
    } else setCurrentRoute('overview');
  }, [location.pathname]);

  useEffect(() => {
    document.title = 'Trang quản trị | Blog';
  }, []);

  return (
    <div className={styles.container}>
      <Header
        isDashboard={true}
        openModalLogin={openModalLogin}
        openModalSignUp={openModalSignUp}
      />
      <div className={styles.main}>
        <div className={styles.sidebar}>
          <ul className={styles.sidebarItems}>
            <li 
              className={`${styles.sidebarItem} ${currentRoute == 'overview' ? styles.active : ''}`} 
              onClick={() => navigate('/dashboard')}
            >
              <p>Tổng quan</p>
            </li>
            <li 
              className={`${styles.sidebarItem} ${currentRoute == 'posts' ? styles.active : ''}`} 
              onClick={() => navigate('/dashboard/posts')}
            >
              <p>Bài viết</p>
            </li>
            <li 
              className={`${styles.sidebarItem} ${currentRoute == 'users' ? styles.active : ''}`} 
              onClick={() => navigate('/dashboard/users')}
            >
              <p>Người dùng</p>
            </li>
            <li 
              className={`${styles.sidebarItem} ${currentRoute == 'categories' ? styles.active : ''}`} 
              onClick={() => navigate('/dashboard/categories')}
            >
              <p>Danh mục</p>
            </li>
          </ul>
        </div>
        <div className={styles.content}>
          <Outlet />
        </div>
      </div>
      <Login isOpen={isModalLoginOpen} onClose={closeModalLogin} />
      <SignUp isOpen={isModalSignUpOpen} onClose={closeModalSignUp} />
      <ToastList />
    </div>
  )
}

export default Dashboard;