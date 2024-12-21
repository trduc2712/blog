import styles from './Dashboard.module.scss';
import Header from '@components/Header/Header';
import { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import ToastList from '@components/ToastList/ToastList';

const Dashboard = () => {
  const [currentRoute, setCurrentRoute] = useState('');
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

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

  const handleToggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  return (
    <>
      <Header isDashboard={true} />
      <div className={styles.container}>
        <div className={styles.main}>
          <div
            className={`${styles.sidebar} ${isSidebarExpanded ? styles.w20 : styles.wAuto}`}
          >
            <ul className={styles.sidebarItems}>
              <li
                className={`${styles.sidebarItem} ${currentRoute == 'overview' ? styles.active : ''}`}
                onClick={() => navigate('/dashboard')}
              >
                <i className="bi bi-bar-chart"></i>
                {isSidebarExpanded && <p>Tổng quan</p>}
              </li>
              <li
                className={`${styles.sidebarItem} ${currentRoute == 'posts' ? styles.active : ''}`}
                onClick={() => navigate('/dashboard/posts')}
              >
                <i className="bi bi-journal-text"></i>
                {isSidebarExpanded && <p>Bài viết</p>}
              </li>
              <li
                className={`${styles.sidebarItem} ${currentRoute == 'users' ? styles.active : ''}`}
                onClick={() => navigate('/dashboard/users')}
              >
                <i className="bi bi-people"></i>
                {isSidebarExpanded && <p>Người dùng</p>}
              </li>
              <li
                className={`${styles.sidebarItem} ${currentRoute == 'categories' ? styles.active : ''}`}
                onClick={() => navigate('/dashboard/categories')}
              >
                <i className="bi bi-tags"></i>
                {isSidebarExpanded && <p>Chủ đề</p>}
              </li>
            </ul>
            <div className={styles.sidebarFooter}>
              <div className={styles.toggleMenu} onClick={handleToggleSidebar}>
                <i className="bi bi-list-ul"></i>
              </div>
            </div>
          </div>
          <div
            className={`${styles.content} ${isSidebarExpanded ? styles.w80 : styles.w100} `}
          >
            <Outlet />
          </div>
        </div>
      </div>
      <ToastList />
    </>
  );
};

export default Dashboard;
