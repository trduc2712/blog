import styles from './Home.module.scss';
import { useEffect, useState } from 'react';
import Header from '@components/Header';
import PostCardList from '@components/PostCardList';
import ToastList from '@components/ToastList';
import Footer from '@components/Footer';
import Pagination from '@components/Pagination';
import SearchBox from '@components/SearchBox';
import CategoryList from '@components/CategoryList';
import Select from '@components/Select';
import {
  getPostsWithPagination as getPostsWithPaginationService,
  getPostCount as getPostCountService,
  searchPost as searchPostService,
  getFoundPostsCount as getFoundPostsCountService,
} from '@services/postService';
import { useAuthContext } from '@contexts/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToastContext } from '@contexts/ToastContext';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectItems, setSelectItems] = useState([]);
  const [keyword, setKeyword] = useState('');
  const postsPerPage = 9;

  const { user } = useAuthContext();

  const navigate = useNavigate();

  const { createToast } = useToastContext();

  const location = useLocation();

  const handleSearch = (keyword) => {
    if (keyword.length == 0) {
      createToast({
        type: 'warning',
        title: 'Cảnh báo',
        message: 'Vui lòng nhập từ khóa.',
      });
      return;
    }

    setCurrentPage(1);
    navigate(`?keyword=${keyword}`);
  };

  useEffect(() => {
    document.title = 'Trang chủ | Blog';
    window.scrollTo(0, 0);

    const items = [
      { label: 'A - Z', onClick: () => {} },
      { label: 'Z - A', onClick: () => {} },
      { label: 'Mới nhất', onClick: () => {} },
      { label: 'Cũ nhất', onClick: () => {} },
    ];

    setSelectItems(items);
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const newKeyword = urlParams.get('keyword');
    setKeyword(newKeyword);

    if (newKeyword) {
      searchPost(newKeyword);
    } else {
      getPostsWithPagination();
    }
  }, [location.search, currentPage]);

  const searchPost = async (keyword) => {
    try {
      setLoading(true);

      const foundPosts = await searchPostService(
        keyword,
        currentPage,
        postsPerPage
      );

      const foundPostsCount = await getFoundPostsCountService(
        keyword,
        currentPage,
        postsPerPage
      );

      if (!foundPosts || foundPosts.length === 0) {
        setPosts([]);
        setTotalPages(0);
      } else {
        setPosts(foundPosts);
        setTotalPages(Math.ceil(foundPostsCount / postsPerPage));
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const getPostsWithPagination = async () => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    console.log('Keyword: ', keyword);
    console.log('Posts: ', posts);
  }, [posts]);

  return (
    <>
      <div className={styles.container}>
        <Header isDashboard={false} />
        <div className={styles.content}>
          {user ? (
            !loading ? (
              <>
                <div className={styles.postCardList}>
                  {posts.length > 0 ? (
                    <>
                      <PostCardList posts={posts} />
                      <div className={styles.pagination}>
                        <Pagination
                          totalPages={totalPages}
                          currentPage={currentPage}
                          onPageChange={handlePageChange}
                        />
                      </div>
                    </>
                  ) : (
                    'Không tìm thấy bài viết. ☹️'
                  )}
                </div>
                <div className={styles.sidebar}>
                  <div className={styles.searchBox}>
                    <SearchBox
                      placeholder="Tìm kiếm bài viết"
                      onSearch={handleSearch}
                    />
                  </div>

                  <div className={styles.filter}>
                    <Select label="Lọc bài viết" items={selectItems} />
                  </div>

                  <div className={styles.categoryList}>
                    <div className={styles.categoryListTop}>
                      <div className={styles.title}>
                        <h3>Chủ đề</h3>
                      </div>
                    </div>
                    <div className={styles.categoryBottom}>
                      <CategoryList />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className={styles.loading}>Đang tải...</div>
            )
          ) : (
            <div className={styles.notLoggedIn}>Chưa đăng nhập.</div>
          )}
        </div>
      </div>
      <Footer />
      <ToastList />
    </>
  );
};

export default Home;
