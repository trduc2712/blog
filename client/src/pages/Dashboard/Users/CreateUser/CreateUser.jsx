import { useEffect, useState } from 'react';
import { useToastContext } from '@contexts/ToastContext';
import ToastList from '@components/ToastList/ToastList';
import Upload from '@components/Upload';
import useModal from '@hooks/useModal';
import Modal from '@components/Modal/Modal';
import { useNavigate } from 'react-router-dom';
import { signUp } from '@services/authService';
import Select from '@components/Select';
import Input from '@components/Input';

const CreateUser = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [role, setRole] = useState('USER');
  const [modal, setModal] = useState('');
  const [selectRoleItems, setSelectRoleItems] = useState([]);

  const { createToast } = useToastContext();

  const { isOpen, openModal, closeModal } = useModal();

  const navigate = useNavigate();

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
  }, []);

  const openConfirmCreateModal = () => {
    if (!username || !password || !name || !avatar) {
      createToast({
        type: 'warning',
        title: 'Cảnh báo',
        message: 'Vui lòng điền đầy đủ thông tin yêu cầu',
      });
      return;
    }
    setModal({
      title: 'Xác nhận',
      cancelLabel: 'Hủy',
      confirmLabel: 'Tạo',
      message: 'Bạn có chắc chắn muốn tạo người dùng mới này không?',
      type: 'confirmation',
      onConfirm: () => {
        handleCreate();
        closeModal();
        createToast({
          type: 'success',
          title: 'Thông báo',
          message: 'Tạo mới người dùng thành công',
        });
        navigate('/dashboard/users');
      },
      onCancel: () => {
        closeModal();
      },
    });
    openModal();
  };

  const handleCreate = () => {
    const createUser = async (username, password, name, avatar, role) => {
      try {
        const user = await signUp(username, password, name, avatar, role);
        setUser(user);
      } catch (err) {
        console.log(err.error);
      }
    };

    createUser(username, password, name, avatar, role);
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
      <div className="card">
        <div className="card-header">
          <h3>Thêm người dùng</h3>
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
            <Select
              label={`${role == 'ADMIN' ? 'Quản trị viên' : 'Người dùng'}`}
              items={selectRoleItems}
              isShowCheckIcon={true}
            />
          </div>
        </div>
        <div className="card-footer end">
          <button className="primary-btn" onClick={openConfirmCreateModal}>
            Thêm
          </button>
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

export default CreateUser;
