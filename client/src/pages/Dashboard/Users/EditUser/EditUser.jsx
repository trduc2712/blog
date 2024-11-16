import { useParams } from 'react-router-dom';
import styles from './EditUser.module.scss';
import { useEffect, useState } from 'react';
import { 
  getUserById as getUserByIdService,
  updateUser as updateUserService,
} from '../../../../services/userService';
import { fileToBase64 } from '../../../../utils/file';
import { useToastContext } from '../../../../contexts/ToastContext';
import ToastList from '../../../../components/ToastList/ToastList';
import useModal from '../../../../hooks/useModal';
import Modal from '../../../../components/Modal/Modal';


const EditUser = () => {
  const { userId } = useParams();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [user, setUser] = useState();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [role, setRole] = useState('');
  const [modalContent, setModalContent] = useState('');

  const { addToast } = useToastContext();
  
  const { isOpen, openModal, closeModal } = useModal();

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  }

  useEffect(() => {
    const getUserById = async (id) => {
      try {
        const user = await getUserByIdService(id);
        setUser(user);
      } catch (err) {
        console.log(err);
      }
    }

    getUserById(userId);
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

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];

    if (!file) {
      console.log('Vui lòng chọn ảnh');
      return;
    }

    const base64 = await fileToBase64(file);
    setAvatar(base64);
  };

  const openConfirmUpdateModal = () => {
    setModalContent({
      title: 'Thông báo',
      cancelLabel: 'Không',
      confirmLabel: 'Có',
      message: 'Bạn có chắc chắn muốn lưu các thay đổi này không?',
      onConfirm: () => {
        handleUpdate();
        closeModal();
        addToast({
          title: 'Thông báo',
          message: 'Cập nhật người dùng thành công'
        })
      },
      onCancel: () => {
        closeModal();
      }
    });
    openModal();
  };

  const handleUpdate = () => {
    const updateUser = async (userId, username, password, name, avatar, role) => {
      try {
        const updatedUser = await updateUserService(userId, username, password, name, avatar, role);
        setUser(updatedUser);
      } catch (err) {
        console.log(err.error);
      }
    };

    updateUser(userId, username, password, name, avatar, role);
  };

  if (!user) return (<div className={styles.container}>Đang tải...</div>);

  return (
    <div className={styles.container}>
      <h2>Sửa người dùng</h2>
      <div className={styles.avatarWrapper}>
        <label htmlFor="avatar">
          <img className={styles.avatar} src={`data:image/jpeg;base64,${avatar}`} alt="Hình đại diện của người dùng" />
          <input 
            type="file" 
            name="avatar" 
            id="avatar" 
            style={{ display: 'none' }} 
            onChange={handleAvatarChange} 
          />
        </label>
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="username">Tên người dùng</label>
        <input type="text" name="username" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor='password'>Mật khẩu</label>
          <div className={styles.inputPasswordWrapper}>
            <input 
              id='password' 
              type={isPasswordVisible ? 'text' : 'password'}
              value={password} onChange={(e) => setPassword(e.target.value)} 
            />
            <div className={styles.togglePassword} onClick={togglePasswordVisibility}>
              {isPasswordVisible ?
                <i className="bi bi-eye-slash"></i>
              :
                <i className="bi bi-eye"></i>
              }
            </div>
          </div>
        </div>
      <div className={styles.formGroup}>
        <label htmlFor="name">Tên</label>
        <input type="text" name="name" id="name"  value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className={styles.rolePicker}>
        <label htmlFor='role' onClick={() => setIsDropdownOpen(!isDropdownOpen)}>Vai trò</label>
        <div className={styles.roleList} onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
          {role == 'ADMIN' ? 'Quản trị viên' : 'Người dùng'}
        </div>
        {isDropdownOpen && (
          <div className={styles.roles}>
            <li 
              className={styles.role} 
              onClick={() => {
                  setRole('USER');
                  setIsDropdownOpen(!isDropdownOpen)
                }
              }
            >
              Người dùng
            </li>
            <li 
              className={styles.role} 
              onClick={() => {
                  setRole('ADMIN');
                  setIsDropdownOpen(!isDropdownOpen)
                }
              }
            >
              Quản trị viên
            </li>
          </div>
        )}
      </div>
      <div className={styles.updateButtonWrapper}>
        <button className={styles.updateButton} onClick={openConfirmUpdateModal}>Cập nhật</button>
      </div>
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
      />
      <ToastList />
    </div>
  )
}

export default EditUser;