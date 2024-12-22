import styles from './UserList.module.scss';
import Table from '@components/Table/Table';
import Pagination from '@components/Pagination/Pagination';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getUsersWithPagination as getUsersWithPaginationService,
  getUserCount as getUserCountService,
} from '@services/userService';

const Users = () => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const usersPerPage = 10;

  const columnLabels = ['ID', 'Tên người dùng', 'Tên', 'Vai trò'];

  const navigate = useNavigate();

  const removeProperties = (obj, propertiesToRemove) => {
    let result = { ...obj };
    propertiesToRemove.forEach((prop) => delete result[prop]);
    return result;
  };

  const getUsersWithPagination = async () => {
    setLoading(true);

    try {
      const usersWithPagination = await getUsersWithPaginationService(
        currentPage,
        usersPerPage
      );
      const userCount = await getUserCountService();

      if (usersWithPagination == null) {
        setUsers([]);
      } else {
        const newUsers = usersWithPagination.map((user) =>
          removeProperties(user, ['password', 'avatar'])
        );
        setUsers(newUsers);
        setTotalPages(Math.ceil(userCount / usersPerPage));
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsersWithPagination();
  }, [currentPage]);

  useEffect(() => {
    getUsersWithPagination();
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className={styles.container}>
      <div className="card">
        <div className="card-header">
          <h3>Danh sách người dùng</h3>
        </div>
        {loading ? (
          <div className="loading">Đang tải...</div>
        ) : (
          <>
            <div className="card-body">
              <div className={styles.createContainer}>
                <button
                  className={`${styles.create} primary-btn`}
                  onClick={() => navigate('/dashboard/users/new')}
                >
                  <i className="bi bi-plus"></i>
                  Thêm người dùng
                </button>
              </div>
              <Table columnLabels={columnLabels} initialData={users} />
            </div>
            <div className="card-footer-center">
              <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Users;
