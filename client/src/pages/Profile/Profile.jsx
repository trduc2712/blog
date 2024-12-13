import styles from './Profile.module.scss';
import Header from '@components/Header';
import ToastList from '@components/ToastList';
import { Outlet } from 'react-router-dom';
import Footer from '@components/Footer';

const MyProfile = () => {
  return (
    <div className={styles.container}>
      <Header isDashboard={false} />
      <div className={styles.contentWrapper}>
        <Outlet />
      </div>
      <ToastList />
      <Footer />
    </div>
  );
};

export default MyProfile;
