import styles from './Navbar.module.scss';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@contexts/AuthContext';
import { getAllCategories as getAllCategoriesService } from '@services/categoryService';
import { useEffect, useState } from 'react';

const Navbar = () => {
  const [categories, setCategories] = useState();

  const { user } = useAuthContext();

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
  }, []);

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
            className={styles.item}
            onClick={() => handleNavigate('/dashboard')}
          >
            <p>Trang quản trị</p>
          </li>
        )}
        <li className={styles.item} onClick={() => handleNavigate('/')}>
          <p>Trang chủ</p>
        </li>
        <li className={styles.item} onClick={() => handleNavigate()}>
          <p>Chủ đề</p>
          <div className={styles.subitemsWrapper}>
            <div className={styles.subitems}>
              {categories &&
                categories.map((category) => (
                  <button
                    key={category.id}
                    className={styles.subitem}
                    onClick={() =>
                      handleNavigate(`?categorySlug=${category.slug}`)
                    }
                  >
                    {category.name}
                  </button>
                ))}
            </div>
          </div>
        </li>
        <li className={styles.item} onClick={() => handleNavigate()}>
          <p>Lọc bài viết</p>
        </li>
        <li
          className={styles.item}
          onClick={() => handleNavigate('/posts/new')}
        >
          <p>Đăng bài</p>
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
