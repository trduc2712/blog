import styles from './UserList.module.scss';
import Table from '../../../components/Table/Table';
import Pagination from '../../../components/Pagination/Pagination';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getUsersWithPagination as getUsersWithPaginationService,
  getUserCount as getUserCountService
} from '../../../services/userService';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const usersPerPage = 10;

  const columnLabels = ['ID', 'Tên người dùng', 'Tên', 'Vai trò'];

  const navigate = useNavigate();

  const removeProperties = (obj, propertiesToRemove) => {
    let result = { ...obj };
    propertiesToRemove.forEach(prop => delete result[prop]);
    return result;
  };

  useEffect(() => {
    const getUsersWithPagination = async () => {
      try {
        const usersWithPagination = await getUsersWithPaginationService(currentPage, usersPerPage);
        const userCount = await getUserCountService();
        
        if (usersWithPagination == null) {
          setUsers([]);
        } else {
          const newUsers = usersWithPagination.map(user => removeProperties(user, ['password', 'avatar']));
          setUsers(newUsers);
          setTotalPages(Math.ceil(userCount / usersPerPage));
        }
      } catch (err) {
      }
    };

    getUsersWithPagination();
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  }

  return (
    <div className={styles.container}>
      <h2>Danh sách người dùng</h2>
      <button className={styles.addButton} onClick={() => navigate('/dashboard/users/create')}>Thêm người dùng</button>
      <Table columnLabels={columnLabels} initialData={users} />
      <div className={styles.pagination}>
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  )
}

export default Users;