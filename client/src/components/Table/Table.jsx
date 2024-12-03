import styles from './Table.module.scss';
import { Link, useLocation } from 'react-router-dom';
import useModal from '@hooks/useModal';
import { useState, useEffect } from 'react';
import { useToastContext } from '@contexts/ToastContext';
import ToastList from '@components/ToastList/ToastList';
import Modal from '@components/Modal/Modal';
import { deletePostById as deletePostByIdService } from '@services/postService';
import { deleteUserById as deleteUserByIdService } from '@services/userService';
import { deleteCategoryById as deleteCategoryByIdService } from '@services/categoryService';

const Table = ({ columnLabels, initialData }) => {
  const [data, setData] = useState([]);
  const [modalContent, setModalContent] = useState({});
  const [currentRoute, setCurrentRoute] = useState('');
  const [entityName, setEntityName] = useState('');
  const location = useLocation();
  const columnCounts = Object.keys(columnLabels).length + 1;

  const { isOpen, openModal, closeModal } = useModal();

  const { createToast } = useToastContext();

  useEffect(() => {
    if (location.pathname.includes('posts')) {
      setCurrentRoute('posts');
      setEntityName('bài viết');
    } else if (location.pathname.includes('users')) {
      setCurrentRoute('users');
      setEntityName(' người dùng');
    } else if (location.pathname.includes('categories')) {
      setCurrentRoute('categories');
      setEntityName('danh mục');
    }
  }, []);

  useEffect(() => {
    if (initialData) {
      setData(initialData);
    }
  }, [initialData]);

  const deletePostById = async (id) => {
    try {
      await deletePostByIdService(id);
      setData((prevData) => prevData.filter((item) => item.id != id));
      createToast({
        type: 'success',
        title: 'Thông báo',
        message: `Xóa ${entityName} thành công`,
      });
    } catch (err) {
      createToast({
        type: 'success',
        title: 'Thông báo',
        message: `Xóa ${entityName} thất bại`,
      });
    }
  };

  const deleteUserById = async (id) => {
    try {
      await deleteUserByIdService(id);
      setData((prevData) => prevData.filter((item) => item.id != id));
      createToast({
        type: 'success',
        title: 'Thông báo',
        message: `Xóa ${entityName} thành công`,
      });
    } catch (err) {
      createToast({
        type: 'success',
        title: 'Thông báo',
        message: `Xóa ${entityName} thất bại`,
      });
    }
  };

  const deleteCategoryById = async (id) => {
    try {
      await deleteCategoryByIdService(id);
      setData((prevData) => prevData.filter((item) => item.id != id));
      createToast({
        type: 'success',
        title: 'Thông báo',
        message: `Xóa ${entityName} thành công`,
      });
    } catch (err) {
      createToast({
        type: 'success',
        title: 'Thông báo',
        message: `Xóa ${entityName} thất bại`,
      });
    }
  };

  const openConfirmDeleteModal = (rowId) => {
    setModalContent({
      title: 'Thông báo',
      cancelLabel: 'Không',
      confirmLabel: 'Có',
      message: `Bạn có chắc chắn muốn xóa ${entityName} này không?`,
      type: 'destructive',
      onConfirm: () => {
        if (currentRoute == 'posts') {
          deletePostById(rowId);
        } else if (currentRoute == 'users') {
          deleteUserById(rowId);
        } else if (currentRoute == 'categories') {
          deleteCategoryById(rowId);
        }
        closeModal();
      },
      onCancel: () => {
        closeModal();
      },
    });
    openModal();
  };

  const handleDeleteRow = (rowId) => {
    openConfirmDeleteModal(rowId);
  };

  return (
    <div className={styles.container}>
      <table>
        <thead>
          <tr>
            {columnLabels.map((columnLabel, index) => (
              <th key={index}>{columnLabel}</th>
            ))}
            <th colSpan={2}>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {data &&
            (data.length > 0 ? (
              data.map((row, index) => (
                <tr key={index}>
                  {Object.values(row).map((cell, index) => (
                    <td key={index}>
                      {cell == 'ADMIN'
                        ? 'Quản trị viên'
                        : cell == 'USER'
                          ? 'Người dùng'
                          : cell}
                    </td>
                  ))}
                  <td>
                    <Link to={`${location.pathname}/edit/${row.id}`}>Sửa</Link>
                  </td>
                  <td>
                    <Link to="" onClick={() => handleDeleteRow(row.id)}>
                      Xóa
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columnCounts}>Đang tải...</td>
              </tr>
            ))}
        </tbody>
      </table>
      <Modal
        title={modalContent.title}
        isOpen={isOpen}
        onClose={closeModal}
        cancelLabel={modalContent.cancelLabel}
        confirmLabel={modalContent.confirmLabel}
        onConfirm={modalContent.onConfirm}
        onCancel={modalContent.onCancel}
        message={modalContent.message}
        buttonLabel={modalContent.buttonLabel}
        type={modalContent.type}
      />
      <ToastList />
    </div>
  );
};

export default Table;
