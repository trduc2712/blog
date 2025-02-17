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
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const categoriesPerPage = 10;

  const navigate = useNavigate();

  const columnLabels = ['ID', 'Tên', 'Slug'];

  const getCategoriesWithPagination = async () => {
    setLoading(true);

    try {
      const categoriesWithPagination = await getCategoriesWithPaginationService(
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCategoriesWithPagination();
  }, []);

  useEffect(() => {
    getCategoriesWithPagination();
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className={styles.container}>
      <div className="card">
        <div className="card-header">
          <h3>Danh sách chủ đề</h3>
        </div>
        {!loading ? (
          <>
            <div className="card-body">
              <div className={styles.createContainer}>
                <button
                  className="primary-btn"
                  onClick={() => navigate('/dashboard/categories/new')}
                >
                  <i className="bi bi-plus"></i>
                  Thêm chủ đề
                </button>
              </div>
              <Table columnLabels={columnLabels} initialData={categories} />
            </div>
            <div className="card-footer-center">
              <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
            </div>
          </>
        ) : (
          <>
            <div className="card-body">
              <div className="loading">Đang tải...</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Categories;
