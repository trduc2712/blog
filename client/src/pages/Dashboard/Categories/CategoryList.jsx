import styles from './CategoryList.module.scss';
import Table from '@components/Table/Table';
import Pagination from '@components/Pagination/Pagination';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getCategoryCount as getCategoryCountService,
  getCategoriesWithPagination as getCategoriesWithPaginationService,
} from '@services/categoryService';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const categoriesPerPage = 10;

  const navigate = useNavigate();

  const columnLabels = ['ID', 'Tên', 'Slug'];

  useEffect(() => {
    const getCategoriesWithPagination = async () => {
      try {
        const categoriesWithPagination =
          await getCategoriesWithPaginationService(
            currentPage,
            categoriesPerPage
          );

        const categoryCount = await getCategoryCountService();

        if (categoriesWithPagination == null) {
          setCategories([]);
        } else {
          setCategories(categoriesWithPagination);
          setTotalPages(Math.ceil(categoryCount / categoriesPerPage));
        }
      } catch (err) {
        console.log(err);
      }
    };

    getCategoriesWithPagination();
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    console.log('Trang hiện tại: ', currentPage);
  };

  return (
    <div className={styles.container}>
      <h2>Danh sách danh mục</h2>
      <button
        className={`${styles.addButton} primary-btn`}
        onClick={() => navigate('/dashboard/categories/create')}
      >
        Thêm danh mục
      </button>
      <Table columnLabels={columnLabels} initialData={categories} />
      <div className={styles.pagination}>
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default Categories;
