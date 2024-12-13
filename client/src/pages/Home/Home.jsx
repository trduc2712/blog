import styles from './Home.module.scss';
import { useEffect, useState } from 'react';
import Header from '@components/Header';
import PostCardList from '@components/PostCardList';
import ToastList from '@components/ToastList';
import Footer from '@components/Footer';
import Pagination from '@components/Pagination';
import SearchBox from '@components/SearchBox';
import CategoryList from '@components/CategoryList';
import {
  getPostsWithPagination as getPostsWithPaginationService,
  getPostsCount as getPostsCountService,
  searchPost as searchPostService,
  getFoundPostsCount as getFoundPostsCountService,
  getPostsCountByCategory as getPostsCountByCategoryService,
} from '@services/postService';
import { getAllCategories as getAllCategoriesService } from '@services/categoryService';
import { useAuthContext } from '@contexts/AuthContext';
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
  const [filterLabel, setFilterLabel] = useState('');
  const [modal, setModal] = useState({
    title: '',
    cancelLabel: '',
    confirmLabel: '',
    message: '',
    type: 'destructive',
    onConfirm: () => {},
    onCancel: () => {},
  });
  const postsPerPage = 9;

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

  const addParam = (param, value) => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set(param, value);
    navigate(`${window.location.pathname}?${searchParams.toString()}`);
  };

  const removeParam = (param) => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.delete(param);
    navigate(`${window.location.pathname}?${searchParams.toString()}`);
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

  const openConfirmClearFilterModal = () => {
    setModal({
      title: 'Xác nhận',
      cancelLabel: 'Không',
      confirmLabel: 'Có',
      message: `Bạn có chắc chắn muốn xóa lọc không?`,
      type: 'confirmation',
      onConfirm: () => {
        removeParam('filter');
        closeModal();
      },
      onCancel: () => {
        closeModal();
      },
    });

    openModal();
  };

  useEffect(() => {
    if (filter) {
      switch (filter) {
        case 'alphaAsc':
          setFilterLabel('Tăng dần theo bảng chữ cái');
          break;
        case 'alphaDesc':
          setFilterLabel('Giảm dần theo bảng chữ cái');
          break;
        case 'oldest':
          setFilterLabel('Tăng dần theo thời gian');
          break;
        case 'newest':
          setFilterLabel('Giảm dần theo thời gian');
          break;
      }
    }
  }, [filter]);

  const handleClearFilter = () => {
    if (filter.length == 0) {
      createToast({
        type: 'warning',
        title: 'Cảnh báo',
        message: 'Chưa có bộ lọc nào được áp dụng.',
      });
      return;
    }
    openConfirmClearFilterModal();
  };

  return (
    <>
      <div className={styles.container}>
        <Header isDashboard={false} />
        <div className={styles.content}>
          {!loading ? (
            <>
              <div className={styles.postCardList}>
                {keyword && filter && (
                  <h3 className={styles.title}>
                    Kết quả khi tìm kiếm với từ khóa: '{keyword}' được sắp xếp
                    theo thứ tự {toLowerCaseFirstLetter(filterLabel)}
                  </h3>
                )}
                {keyword && !filter && (
                  <h3 className={styles.title}>
                    Kết quả tìm kiếm với từ khóa: '{keyword}'
                  </h3>
                )}
                {filter && !keyword && !categorySlug && (
                  <h3 className={styles.title}>
                    Danh sách bài viết được sắp xếp theo thứ tự{' '}
                    {toLowerCaseFirstLetter(filterLabel)}
                  </h3>
                )}
                {categorySlug && filter && (
                  <h3 className={styles.title}>
                    Danh sách bài viết thuộc chủ đề{' '}
                    {categoryName && toLowerCaseFirstLetter(categoryName)} được
                    sắp xếp theo thứ tự {toLowerCaseFirstLetter(filterLabel)}
                  </h3>
                )}
                {categorySlug && !filter && (
                  <h3 className={styles.title}>
                    Danh sách bài viết thuộc chủ đề{' '}
                    {categoryName && toLowerCaseFirstLetter(categoryName)}
                  </h3>
                )}
                {!categorySlug && !filter && !keyword && (
                  <h3 className={styles.title}>Danh sách bài viết</h3>
                )}
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
                  <div className={styles.notFound}>
                    Không có kết quả phù hợp.
                  </div>
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
                  <div className={styles.filterTop}>
                    <div className={styles.title}>
                      <h3>Lọc bài viết</h3>
                    </div>
                  </div>
                  <div className={styles.filterBody}>
                    <div className={styles.filterOption}>
                      <input
                        type="radio"
                        name="filter"
                        id="alphaAsc"
                        value="alphaAsc"
                        checked={filter == 'alphaAsc'}
                        onChange={(e) => {
                          setFilter(e.target.value);
                          addParam('filter', 'alphaAsc');
                        }}
                      />
                      <label htmlFor="alphaAsc">
                        Tăng dần theo bảng chữ cái
                      </label>
                    </div>
                    <div className={styles.filterOption}>
                      <input
                        type="radio"
                        name="filter"
                        id="alphaDesc"
                        value="alphaDesc"
                        checked={filter == 'alphaDesc'}
                        onChange={(e) => {
                          setFilter(e.target.value);
                          addParam('filter', 'alphaDesc');
                        }}
                      />
                      <label htmlFor="alphaDesc">
                        Giảm dần theo bảng chữ cái
                      </label>
                    </div>
                    <div className={styles.filterOption}>
                      <input
                        type="radio"
                        name="filter"
                        id="oldest"
                        value="oldest"
                        checked={filter == 'oldest'}
                        onChange={(e) => {
                          setFilter(e.target.value);
                          addParam('filter', 'oldest');
                        }}
                      />
                      <label htmlFor="oldest">Tăng dần theo thời gian</label>
                    </div>
                    <div className={styles.filterOption}>
                      <input
                        type="radio"
                        name="filter"
                        id="newest"
                        value="newest"
                        checked={filter == 'newest'}
                        onChange={(e) => {
                          setFilter(e.target.value);
                          addParam('filter', 'newest');
                        }}
                      />
                      <label htmlFor="newest">Giảm dần theo thời gian</label>
                    </div>
                  </div>
                  <div className={styles.filterBottom}>
                    <div className="secondary-btn" onClick={handleClearFilter}>
                      Xóa lọc
                    </div>
                  </div>
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
