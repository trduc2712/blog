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
  searchPost as searchPostService,
  getFoundPostsCount as getFoundPostsCountService,
  getPostsCountByCategory as getPostsCountByCategoryService,
} from '@services/postService';
import { getAllCategories as getAllCategoriesService } from '@services/categoryService';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToastContext } from '@contexts/ToastContext';
import { toLowerCaseFirstLetter } from '@utils/string';
import Modal from '@components/Modal';
import useModal from '@hooks/useModal';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [filter, setFilter] = useState('');
  const [categorySlug, setCategorySlug] = useState('');
  const [categories, setCategories] = useState('');
  const [categoryName, setCategoryName] = useState('');

  const [modal, setModal] = useState({
    title: '',
    cancelLabel: '',
    confirmLabel: '',
    message: '',
    type: 'destructive',
    onConfirm: () => {},
    onCancel: () => {},
  });
  const postsPerPage = 6;

  const navigate = useNavigate();

  const { createToast } = useToastContext();

  const { isOpen, openModal, closeModal } = useModal();

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

    const getAllCategories = async () => {
      try {
        const categories = await getAllCategoriesService();
        setCategories(categories);
      } catch (err) {
        console.log(err);
      }
    };

    getAllCategories();
  }, []);

  useEffect(() => {
    if (categories && categorySlug) {
      const categoryMatched = categories.find(
        (category) => category.slug === categorySlug
      );

      setCategoryName(categoryMatched.name);
    }
  }, [categorySlug]);

  useEffect(() => {
    const getPosts = async () => {
      const urlParams = new URLSearchParams(location.search);
      const newKeyword = urlParams.get('keyword') || '';
      const newFilter = urlParams.get('filter') || '';
      const newCategorySlug = urlParams.get('categorySlug') || '';

      setKeyword(newKeyword);
      setFilter(newFilter);
      setCategorySlug(newCategorySlug);

      if (newKeyword) {
        await searchPost(newKeyword, newFilter);
      } else {
        await getPostsWithPagination(newFilter, newCategorySlug);
      }
    };

    getPosts();
  }, [location.search, currentPage]);

  const searchPost = async (keyword, filter) => {
    window.scrollTo(0, 0);

    try {
      setLoading(true);

      const foundPosts = await searchPostService(
        keyword,
        currentPage,
        postsPerPage,
        filter
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

  const getPostsWithPagination = async (filter, categorySlug) => {
    window.scrollTo(0, 0);

    try {
      setLoading(true);

      const postCount = categorySlug
        ? await getPostsCountByCategoryService(
            categorySlug,
            currentPage,
            postsPerPage
          )
        : await getPostsCountService();

      const postsWithPagination = await getPostsWithPaginationService(
        currentPage,
        postsPerPage,
        filter,
        categorySlug
      );

      if (postsWithPagination == null) {
        setPosts([]);
      } else {
        setPosts(postsWithPagination);
        const totalPages = Math.ceil(postCount / postsPerPage);
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
                      <div className={styles.notFound}>
                        Không có kết quả phù hợp.
                      </div>
                    )}
                  </div>
                </div>
                <div className="card-footer center">
                  <div className={styles.pagination}>
                    <Pagination
                      totalPages={totalPages}
                      currentPage={currentPage}
                      onPageChange={handlePageChange}
                    />
                  </div>
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
      <Modal
        title={modal.title}
        isOpen={isOpen}
        onClose={closeModal}
        cancelLabel={modal.cancelLabel}
        confirmLabel={modal.confirmLabel}
        onConfirm={modal.onConfirm}
        onCancel={modal.onCancel}
        message={modal.message}
        buttonLabel={modal.buttonLabel}
        type={modal.type}
      />
    </>
  );
};

export default Home;
