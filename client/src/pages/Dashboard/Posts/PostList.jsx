import styles from './PostList.module.scss';
import Table from '@components/Table/Table';
import Pagination from '@components/Pagination/Pagination';
import { useState, useEffect } from 'react';
import {
  getPostsCount as getPostsCountService,
  getPostsWithPagination as getPostsWithPaginationService,
} from '@services/postService';

const PostList = () => {
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const postsPerPage = 10;

  const columnLabels = ['ID', 'Tiêu đề', 'Tác giả', 'Chủ đề'];

  const removeProperties = (obj, propertiesToRemove) => {
    let result = { ...obj };
    propertiesToRemove.forEach((prop) => delete result[prop]);
    return result;
  };

  useEffect(() => {
    setLoading(true);

    const getPostsWithPagination = async () => {
      try {
        const postsWithPagination = await getPostsWithPaginationService(
          currentPage,
          postsPerPage
        );
        const postsCount = await getPostsCountService(
          currentPage,
          postsPerPage
        );

        if (postsWithPagination == null) {
          setPosts([]);
        } else {
          const newPosts = postsWithPagination.map((post) =>
            removeProperties(post, [
              'thumbnail',
              'slug',
              'content',
              'summary',
              'user_avatar',
              'created_at',
              'category_slug',
              'user_username',
            ])
          );
          setPosts(newPosts);
          setTotalPages(Math.ceil(postsCount / postsPerPage));
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    getPostsWithPagination();
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className={styles.container}>
      <div className="card">
        <div className="card-header">
          <h3>Danh sách bài viết</h3>
        </div>
        {loading ? (
          <div className="loading">Đang tải...</div>
        ) : (
          <>
            <div className="card-body">
              <Table columnLabels={columnLabels} initialData={posts} />
            </div>
            <div className="card-footer-center">
              <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PostList;
