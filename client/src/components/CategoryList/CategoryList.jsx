import { useEffect } from 'react';
import styles from './CategoryList.module.scss';
import { getAllCategories as getAllCategoriesService } from '@services/categoryService';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);

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

  return (
    <div className={styles.container}>
      {categories.map((category, index) => (
        <div
          key={index}
          className={styles.category}
          onClick={() => {
            navigate(`?categorySlug=${category.slug}`);
            console.log('hihi');
          }}
        >
          {category.name}
        </div>
      ))}
    </div>
  );
};

export default CategoryList;
