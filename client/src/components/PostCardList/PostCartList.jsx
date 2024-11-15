import styles from './PostCardList.module.scss';
import PostCard from '../PostCard/PostCard';
import { useEffect, useState } from 'react';
import { getPostCount as getPostCountService, getPostsWithPagination as getPostsWithPaginationService } from '../../services/postService';
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
        const postsWithPagination = await getPostsWithPaginationService(currentPage, postsPerPage);
        const postCount = await getPostCountService();
        
        if (postsWithPagination == null) {
          setPosts([]);
        } else {
          setPosts(postsWithPagination);
          setTotalPages(Math.ceil(postCount / postsPerPage));
        }
      } catch (err) {
        console.log(err);
      }
    };

    getPostsWithPagination();
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (posts == null) return <div className={styles.content}>Không có bài viết nào</div>

  return (
    <div className={`${user ? styles.container : styles.notLoggedIn}`}>
      <div className={styles.content}>
        {user ? (
          posts.length > 0 ? (
            posts.map((post, index) => (
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
            )
          )) : (
            <div className={styles.notPosts}>Không có bài viết nào</div>
          )
        ) : (
          'Chưa đăng nhập'
        )}
      </div>
      {posts.length > 0 && (
        <div className={styles.pagination}>
          <Pagination
            currentPage={currentPage}
            onPageChange={handlePageChange}
            totalPages={totalPages}
          />
        </div>
      )}
    </div>
  )
}

export default PostCardList;