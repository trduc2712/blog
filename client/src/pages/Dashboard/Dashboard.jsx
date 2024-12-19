import styles from './Dashboard.module.scss';
import Header from '@components/Header/Header';
import { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import ToastList from '@components/ToastList/ToastList';

const Dashboard = () => {
  const [isModalLoginOpen, setIsModalLoginOpen] = useState(false);
  const [isModalSignUpOpen, setIsModalSignUpOpen] = useState(false);
  const [currentRoute, setCurrentRoute] = useState('');

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
      <Header isDashboard={true} />
      <div className={styles.main}>
        <div className={styles.sidebar}>
          <ul className={styles.sidebarItems}>
            <li
              className={`${styles.sidebarItem} ${currentRoute == 'overview' ? styles.active : ''}`}
              onClick={() => navigate('/dashboard')}
            >
              <i className="bi bi-bar-chart"></i>
              <p>Tổng quan</p>
            </li>
            <li
              className={`${styles.sidebarItem} ${currentRoute == 'posts' ? styles.active : ''}`}
              onClick={() => navigate('/dashboard/posts')}
            >
              <i className="bi bi-journal-text"></i>
              <p>Bài viết</p>
            </li>
            <li
              className={`${styles.sidebarItem} ${currentRoute == 'users' ? styles.active : ''}`}
              onClick={() => navigate('/dashboard/users')}
            >
              <i className="bi bi-people"></i>
              <p>Người dùng</p>
            </li>
            <li
              className={`${styles.sidebarItem} ${currentRoute == 'categories' ? styles.active : ''}`}
              onClick={() => navigate('/dashboard/categories')}
            >
              <i className="bi bi-tags"></i>
              <p>Chủ đề</p>
            </li>
          </ul>
        </div>
        <div className={styles.content}>
          <Outlet />
        </div>
      </div>
      <ToastList />
    </div>
  );
};

export default Dashboard;
