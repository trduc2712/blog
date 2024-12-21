import styles from './Navbar.module.scss';
import Select from '@components/Select';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '@contexts/AuthContext';
import { getAllCategories as getAllCategoriesService } from '@services/categoryService';
import { useEffect, useState } from 'react';
import Filter from '@components/Filter';

const Navbar = () => {
  const [categories, setCategories] = useState();
  const [selectCategoryItems, setSelectCategoryItems] = useState();
  const [filters, setFilters] = useState();

  const { user } = useAuthContext();

  const location = useLocation();

  const navigate = useNavigate();

  useEffect(() => {
    const getAllCategories = async () => {
      try {
        const categories = await getAllCategoriesService();
        setCategories(categories);
      } catch (err) {
        console.log(err);
      }
    };

    getAllCategories();

    setFilters([
      {
        title: 'Thời gian',
        type: 'time',
        options: [
          { label: 'Hôm nay', value: 'today' },
          { label: 'Tuần này', value: 'this-week' },
          { label: 'Tháng này', value: 'this-month' },
          // { label: 'Cũ nhất', value: 'oldest' },
          // { label: 'Mới nhất', value: 'newest' },
        ],
      },
      {
        title: 'Bảng chữ cái',
        type: 'alphabet',
        options: [
          {
            label: 'Theo bảng chữ cái',
            value: 'asc',
          },
          {
            label: 'Ngược bảng chữ cái',
            value: 'desc',
          },
        ],
      },
    ]);
  }, []);

  useEffect(() => {
    if (categories) {
      const items = categories.map((category) => ({
        label: category.name,
        onClick: () => {
          navigate(`/?category=${category.slug}`);
        },
      }));

      setSelectCategoryItems(items);
    }
  }, [categories]);

  const handleNavigate = (address) => {
    if (address) {
      navigate(address);
    }
  };

  return (
    <div className={styles.container}>
      <ul className={styles.items}>
        {user && user.role == 'ADMIN' && (
          <li
            className={`${styles.item} ${location.pathname == '/dashboard' ? styles.active : ''}`}
            onClick={() => handleNavigate('/dashboard')}
          >
            <p>Trang quản trị</p>
          </li>
        )}
        <li
          className={`${styles.item} ${location.pathname == '/' ? styles.active : ''}`}
          onClick={() => handleNavigate('/')}
        >
          <p>Trang chủ</p>
        </li>
        <Select
          label="Chủ đề"
          items={selectCategoryItems}
          trigger={<li className={styles.item}>Chủ đề</li>}
        />
        <Select
          label="Chủ đề"
          children={<Filter filters={filters} />}
          trigger={<li className={styles.item}>Lọc bài viết</li>}
        />
        <li
          className={`${styles.item} ${location.pathname == '/posts/new' ? styles.active : ''}`}
          onClick={() => handleNavigate('/posts/new')}
        >
          <p>Đăng bài</p>
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
