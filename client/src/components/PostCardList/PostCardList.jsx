import styles from './PostCardList.module.scss';
import PostCard from '@components/PostCard/PostCard';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getPostCount as getPostCountService,
  getPostsWithPagination as getPostsWithPaginationService,
  searchPost as searchPostService,
  getFoundPostsCount as getFoundPostsCountService,
} from '@services/postService';
import { useAuthContext } from '@contexts/AuthContext';
import Pagination from '@components/Pagination/Pagination';
import SearchBox from '@components/SearchBox/SearchBox';
import Select from '@components/Select/Select';

const PostCardList = () => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectItems, setSelectItems] = useState([]);
  const postsPerPage = 6;

  const urlParams = new URLSearchParams(window.location.search);

  const navigate = useNavigate();

  const { user } = useAuthContext();

  useEffect(() => {
    const items = [
      { label: 'A - Z', onClick: () => {} },
      { label: 'Z - A', onClick: () => {} },
      { label: 'Mới nhất', onClick: () => {} },
      { label: 'Cũ nhất', onClick: () => {} },
    ];

    setSelectItems(items);
  }, []);

  useEffect(() => {
    const keyword = urlParams.get('keyword');
    if (keyword) {
      searchPost(keyword);
    } else {
      getPostsWithPagination();
    }
  }, [location.search]);

  useEffect(() => {
    getPostsWithPagination();
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = (keyword) => {
    navigate(`?keyword=${keyword}`);
    searchPost(keyword);
  };

  const getPostsWithPagination = async () => {
    try {
      const postsWithPagination = await getPostsWithPaginationService(
        currentPage,
        postsPerPage
      );

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

  const searchPost = async (keyword) => {
    setCurrentPage(1);

    try {
      const foundPosts = await searchPostService(
        keyword,
        currentPage,
        postsPerPage
      );

      const foundPostsCount = await getFoundPostsCountService(keyword);
      console.log('foundPostsCount: ', foundPostsCount);

      if (foundPosts == null) {
        setPosts([]);
      } else {
        setPosts(foundPosts);
        setTotalPages(Math.ceil(foundPostsCount / postsPerPage));
      }
    } catch (err) {
      console.log(err);
    }
  };

  if (posts == null)
    return <div className={styles.content}>Không có bài viết nào</div>;

  return (
    <div className={`${user ? styles.container : styles.notLoggedIn}`}>
      <div className={styles.content}>
        {user && (
          <div className={styles.header}>
            <SearchBox
              placeholder="Tìm kiếm bài viết"
              onSearch={handleSearch}
            />
            <Select icon="filter" label="Lọc bài viết" items={selectItems} />
          </div>
        )}
        <div className={styles.body}>
          {user ? (
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
                  username={post.user_username}
                />
              </div>
            ))
          ) : (
            <p>Chưa đăng nhập.</p>
          )}
        </div>
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
  );
};

export default PostCardList;
