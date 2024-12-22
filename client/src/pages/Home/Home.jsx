import styles from './Home.module.scss';
import { useEffect, useState } from 'react';
import Header from '@components/Header';
import PostCardList from '@components/PostCardList';
import ToastList from '@components/ToastList';
import Footer from '@components/Footer';
import Pagination from '@components/Pagination';
import SearchBox from '@components/SearchBox';
import {
  getPostsWithPagination as getPostsWithPaginationService,
  getPostsCount as getPostsCountService,
} from '@services/postService';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToastContext } from '@contexts/ToastContext';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const postsPerPage = 6;
  const navigate = useNavigate();
  const { createToast } = useToastContext();
  const location = useLocation();

  useEffect(() => {
    document.title = 'Trang chủ | Blog';
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const getPosts = async () => {
      const urlParams = new URLSearchParams(location.search);
      const keyword = urlParams.get('keyword') || '';
      const time = urlParams.get('time') || '';
      const alphabet = urlParams.get('alphabet') || '';
      const categorySlug = urlParams.get('category') || '';

      await getPostsWithPagination(keyword, time, alphabet, categorySlug);
    };

    getPosts();
  }, [location.search, currentPage]);

  const getPostsWithPagination = async (
    keyword,
    time,
    alphabet,
    categorySlug
  ) => {
    window.scrollTo(0, 0);

    try {
      setLoading(true);

      const postsCount = await getPostsCountService(
        currentPage,
        postsPerPage,
        keyword,
        time,
        alphabet,
        categorySlug
      );

      const postsWithPagination = await getPostsWithPaginationService(
        currentPage,
        postsPerPage,
        keyword,
        time,
        alphabet,
        categorySlug
      );

      if (postsWithPagination == null) {
        setPosts([]);
      } else {
        setPosts(postsWithPagination);
        const totalPages = Math.ceil(postsCount / postsPerPage);
        setTotalPages(totalPages);
        if (totalPages == 1) setCurrentPage(1);
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

  return (
    <>
      <div>
        <Header isDashboard={false} />
        <div className="container">
          {!loading ? (
            <>
              <div className="card">
                <div className="card-header">
                  <h3>Danh sách bài viết</h3>
                </div>
                <div className="card-body">
                  <div className={styles.searchBox}>
                    <SearchBox
                      placeholder="Tìm kiếm bài viết"
                      onSearch={handleSearch}
                    />
                  </div>
                  <div className={styles.postCardList}>
                    {posts.length > 0 ? (
                      <>
                        <PostCardList posts={posts} />
                      </>
                    ) : (
                      <div className="not-found">Không có kết quả phù hợp.</div>
                    )}
                  </div>
                </div>
                <div className="card-footer-center">
                  <Pagination
                    totalPages={totalPages}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="loading">Đang tải...</div>
          )}
        </div>
        <Footer />
      </div>
      <ToastList />
    </>
  );
};

export default Home;
