import styles from './Home.module.scss';
import { useEffect } from 'react';
import Header from '@components/Header';
import PostCardList from '@components/PostCardList';
import ToastList from '@components/ToastList';
import Footer from '@components/Footer';

const Home = () => {
  useEffect(() => {
    document.title = 'Trang chủ | Blog';
  }, []);

  if (Footer) {
    console.log('Footer!');
  }

  return (
    <>
      <div className={styles.container}>
        <Header isDashboard={false} />
        <div className={styles.content}>
          <PostCardList />
        </div>
        <ToastList />
      </div>
      <Footer />
    </>
  );
};

export default Home;
