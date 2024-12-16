import { useParams } from 'react-router-dom';
import styles from './EditUser.module.scss';
import { useEffect, useState } from 'react';
import {
  getUser as getUserService,
  updateUser as updateUserService,
} from '@services/userService';
import { useToastContext } from '@contexts/ToastContext';
import ToastList from '@components/ToastList';
import Upload from '@components/Upload';
import useModal from '@hooks/useModal';
import Modal from '@components/Modal';
import Select from '@components/Select';
import Input from '@components/Input';

const EditUser = () => {
  const { userId } = useParams();
  const [user, setUser] = useState();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [role, setRole] = useState('');
  const [modal, setModal] = useState('');
  const [selectRoleItems, setSelectRoleItems] = useState([]);

  const { createToast } = useToastContext();

  const { isOpen, openModal, closeModal } = useModal();

  useEffect(() => {
    const items = [
      {
        label: 'Quản trị viên',
        onClick: () => {
          setRole('ADMIN');
        },
      },
      {
        label: 'Người dùng',
        onClick: () => {
          setRole('ADMIN');
        },
      },
    ];
    setSelectRoleItems(items);

    const getUser = async (id) => {
      try {
        const user = await getUserService(id);
        setUser(user);
      } catch (err) {
        console.log(err);
      }
    };

    getUser(userId);
  }, []);

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setPassword(user.password);
      setAvatar(user.avatar);
      setName(user.name);
      setRole(user.role);
    }
  }, [user]);

  const openConfirmUpdateModal = () => {
    setModal({
      title: 'Xác nhận',
      cancelLabel: 'Không',
      confirmLabel: 'Có',
      message: 'Bạn có chắc chắn muốn lưu các thay đổi này không?',
      type: 'confirmation',
      onConfirm: () => {
        handleUpdate();
        closeModal();
        createToast({
          type: 'success',
          title: 'Thông báo',
          message: 'Cập nhật thông tin người dùng thành công.',
        });
      },
      onCancel: () => {
        closeModal();
      },
    });
    openModal();
  };

  const handleUpdate = () => {
    const updateUser = async (
      userId,
      username,
      password,
      name,
      avatar,
      role
    ) => {
      try {
        const updatedUser = await updateUserService(
          userId,
          username,
          password,
          name,
          avatar,
          role
        );
        setUser(updatedUser);
      } catch (err) {
        console.log(err.error);
      }
    };

    updateUser(userId, username, password, name, avatar, role);
  };

  const handleChangeUsername = (username) => {
    setUsername(username);
  };

  const handleChangePassword = (password) => {
    setPassword(password);
  };

  const handleChangeName = (name) => {
    setName(name);
  };

  return (
    <>
      <div className={styles.container}>
        <div className="card">
          <div className="card-header">
            <h3>Sửa người dùng</h3>
          </div>
          <div className="card-body">
            <Upload type="avatar" upload={avatar} setUpload={setAvatar} />
            <div className="form-group">
              <label>Tên người dùng</label>
              <Input
                value={username}
                variant="text"
                placeholder="Tên người dùng"
                onChangeValue={(e) => handleChangeUsername(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Mật khẩu</label>
              <Input
                value={password}
                variant="password"
                placeholder="Mật khẩu"
                onChangeValue={(e) => handleChangePassword(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Tên</label>
              <Input
                value={name}
                variant="text"
                placeholder="Tên"
                onChangeValue={(e) => handleChangeName(e.target.value)}
              />
            </div>
            <div className="select">
              <p>Vai trò</p>
              {role && (
                <Select
                  label={`${role == 'ADMIN' ? 'Quản trị viên' : 'Người dùng'}`}
                  items={selectRoleItems}
                />
              )}
            </div>
            <div className={styles.updateButtonWrapper}>
              <button className="primary-btn" onClick={openConfirmUpdateModal}>
                Cập nhật
              </button>
            </div>
          </div>
        </div>
      </div>
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
      <ToastList />
    </>
  );
};

export default EditUser;
