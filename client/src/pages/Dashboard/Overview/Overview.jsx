import styles from './Overview.module.scss';
import { getUserCount as getUserCountService } from '@services/userService';
import { getPostsCount as getPostsCountService } from '@services/postService';
import { getCategoryCount as getCategoryCountService } from '@services/categoryService';
import { useEffect, useState } from 'react';

const Overview = () => {
  const [userCount, setUserCount] = useState(0);
  const [postCount, setPostCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);

  useEffect(() => {
    const getCount = async () => {
      try {
        const userCount = await getUserCountService();
        const postCount = await getPostsCountService();
        const categoryCount = await getCategoryCountService();
        setUserCount(userCount);
        setPostCount(postCount);
        setCategoryCount(categoryCount);
      } catch (err) {
        console.log(err);
      }
    };

    getCount();
  }, []);

  return (
    <div className={styles.container}>
      <div className="card">
        <div className="card-header">
          <h3>Tổng quan</h3>
        </div>
        <div className="card-body">
          <div className={styles.statisticCards}>
            <div className="card">
              <div className="card-body">
                <h3>Số lượng người dùng</h3>
                <p className={styles.statistic}>
                  {userCount == 0 ? 'Đang tải...' : userCount}
                </p>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <h3>Số lượng bài viết</h3>
                <p className={styles.statistic}>
                  {postCount == 0 ? 'Đang tải...' : postCount}
                </p>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <h3>Số lượng chủ đề</h3>
                <p className={styles.statistic}>
                  {categoryCount == 0 ? 'Đang tải...' : categoryCount}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
