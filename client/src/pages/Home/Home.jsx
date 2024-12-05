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

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectItems, setSelectItems] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [filter, setFilter] = useState('');
  const [categorySlug, setCategorySlug] = useState('');
  const [categories, setCategories] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [selectLabel, setSelectLabel] = useState('Lọc bài viết');
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
    user ? '' : navigate('/login');

    document.title = 'Trang chủ | Blog';
    window.scrollTo(0, 0);

    const items = [
      {
        label: 'Từ A đến Z',
        onClick: () => {
          addParam('filter', 'alphaAsc');
        },
      },
      {
        label: 'Từ Z đến A',
        onClick: () => {
          addParam('filter', 'alphaDesc');
        },
      },
      {
        label: 'Mới nhất',
        onClick: () => {
          addParam('filter', 'newest');
        },
      },
      {
        label: 'Cũ nhất',
        onClick: () => {
          addParam('filter', 'oldest');
        },
      },
      {
        label: 'Xóa lọc',
        onClick: () => {
          removeParam('filter');
        },
      },
    ];

    setSelectItems(items);

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
      console.log(categories);
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

      switch (newFilter) {
        case 'alphaAsc':
          setSelectLabel('Từ A đến Z');
          break;
        case 'alphaDesc':
          setSelectLabel('Từ Z đến A');
          break;
        case 'newest':
          setSelectLabel('Mới nhất');
          break;
        case 'oldest':
          setSelectLabel('Cũ nhất');
          break;
        default:
          setSelectLabel('Lọc bài viết');
          break;
      }

      if (newKeyword) {
        await searchPost(newKeyword, newFilter);
      } else {
        await getPostsWithPagination(newFilter, newCategorySlug);
      }
    };

    getPosts();
  }, [location.search, currentPage]);

  const searchPost = async (keyword, filter) => {
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
    try {
      setLoading(true);

      const postsWithPagination = await getPostsWithPaginationService(
        currentPage,
        postsPerPage,
        filter,
        categorySlug
      );

      let postCount;
      categorySlug
        ? (postCount = await getPostsCountByCategoryService(
            categorySlug,
            currentPage,
            postsPerPage
          ))
        : (postCount = await getPostsCountService());

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

  return (
    <>
      <div className={styles.container}>
        <Header isDashboard={false} />
        <div className={styles.content}>
          {user ? (
            !loading ? (
              <>
                <div className={styles.postCardList}>
                  {keyword && filter && (
                    <p className={styles.title}>
                      Kết quả khi tìm kiếm với từ khóa: '{keyword}' được sắp xếp
                      theo thứ tự {toLowerCaseFirstLetter(selectLabel)}
                    </p>
                  )}
                  {keyword && !filter && (
                    <p className={styles.title}>
                      Kết quả tìm kiếm với từ khóa: '{keyword}'
                    </p>
                  )}
                  {filter && !keyword && !categorySlug && (
                    <p className={styles.title}>
                      Kết quả lọc với lựa chọn:{' '}
                      {toLowerCaseFirstLetter(selectLabel)}
                    </p>
                  )}
                  {categorySlug && filter && (
                    <p className={styles.title}>
                      Các bài viết thuộc chủ đề{' '}
                      {toLowerCaseFirstLetter(categoryName)} được sắp xếp theo
                      thứ tự {toLowerCaseFirstLetter(selectLabel)}
                    </p>
                  )}
                  {categorySlug && !filter && (
                    <p className={styles.title}>
                      Các bài viết thuộc chủ đề{' '}
                      {toLowerCaseFirstLetter(categoryName)}
                    </p>
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
                      Không có kết quả phù hợp. ☹️
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
                    <Select label={selectLabel} items={selectItems} />
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
        <Footer />
      </div>
      <ToastList />
    </>
  );
};

export default Home;
