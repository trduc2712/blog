import styles from './MyPosts.module.scss';
import Header from '@components/Header/Header';
import UserPosts from '@components/UserPosts/UserPosts';

const MyPosts = () => {
  return (
    <>
      <Header isDashboard={false} />
      <div className={styles.container}>
        <h2>Bài viết của tôi</h2>
        <UserPosts />
      </div>
    </>
  );
};

export default MyPosts;
