import styles from './PostCardList.module.scss';
import PostCard from '../PostCard/PostCard';
import { useEffect, useState } from 'react';
import { getPostCount as getPostCountService, getPostWithPagination as getPostWithPaginationService } from '../../services/postService';
import { useAuthContext } from '../../contexts/AuthContext';
import Pagination from '../../components/Pagination/Pagination';

const PostCardList = () => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const postsPerPage = 6;

  const { user } = useAuthContext();

  useEffect(() => {
    const getPostsWithPagination = async () => {
      try {
        const response = await getPostWithPaginationService(currentPage, postsPerPage);
        const postCount = await getPostCountService();
        setTotalPages(Math.ceil(postCount / postsPerPage));
        setPosts(response);
      } catch (err) {
        console.log(err);
      }
    };

    getPostsWithPagination();
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className={`${user ? styles.container : styles.notLoggedIn}`}>
      <div className={styles.content}>
        {user ? posts.map((post, index) => (
          <div key={index} className={styles.post}>
            <PostCard
              title={post.title}
              thumbnail={post.thumbnail}
              userAvatar={post.user_avatar}
              slug={post.slug}
              userName={post.user_name}
              categoryName={post.category_name}
              categorySlug={post.category_slug}
              createdAt={post.created_at}
              username={post.username}
            />
          </div>
        )) : (
          'Chưa đăng nhập'
        )}
      </div>
      <div className={styles.pagination}>
        <Pagination
          currentPage={currentPage}
          onPageChange={handlePageChange}
          totalPages={totalPages}
        />
      </div>
    </div>
  )
}

export default PostCardList;