import styles from './Posts.module.scss';
import Table from '../../../components/Table/Table';
import Pagination from '../../../components/Pagination/Pagination';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  getPostCount as getPostCountService,
  getPostsWithPagination as getPostsWithPaginationService
} from '../../../services/postService';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const postsPerPage = 10;

  const columnLabels = ['ID', 'Tiêu đề', 'Tác giả', 'Tên người dùng'];

  const removeProperties = (obj, propertiesToRemove) => {
    let result = { ...obj };
    propertiesToRemove.forEach(prop => delete result[prop]);
    return result;
  };

  useEffect(() => {
    const getPostsWithPagination = async () => {
      try {
        const postsWithPagination = await getPostsWithPaginationService(currentPage, postsPerPage);
        const postCount = await getPostCountService();
        
        if (postsWithPagination == null) {
          setPosts([]);
        } else {
          const newPosts = postsWithPagination.map(post => removeProperties(post, ['thumbnail', 'slug','user_avatar', 'created_at', 'category_name', 'category_slug']));
          setPosts(newPosts);
          setTotalPages(Math.ceil(postCount / postsPerPage));
        }
      } catch (err) {
        console.log(err);
      }
    };

    getPostsWithPagination();
    console.log(posts);
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  }

  return (
    <div className={styles.container}>
      <Link className={styles.addButton} to='/dashboard/posts/add'>Thêm bài viết</Link>
      <Table columnLabels={columnLabels} initialData={posts} />
      <div className={styles.pagination}>
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  )
}

export default Posts;