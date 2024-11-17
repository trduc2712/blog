import styles from './CreateUser.module.scss';
import { useState } from 'react';
import { fileToBase64 } from '../../../../utils/file';
import { useToastContext } from '../../../../contexts/ToastContext';
import ToastList from '../../../../components/ToastList/ToastList';
import useModal from '../../../../hooks/useModal';
import Modal from '../../../../components/Modal/Modal';
import { useNavigate } from 'react-router-dom';
import { signUp } from '../../../../services/authService';

const CreateUser = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [role, setRole] = useState('USER');
  const [modalContent, setModalContent] = useState('');

  const { addToast } = useToastContext();
  
  const { isOpen, openModal, closeModal } = useModal();

  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  }

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];

    if (!file) {
      console.log('Vui lòng chọn ảnh');
      return;
    }

    const base64 = await fileToBase64(file);
    setAvatar(base64);
  };

  const openConfirmCreateModal = () => {
    if (!username || !password || !name || !avatar) {
      addToast({
        type: 'success',
        title: 'Thông báo',
        message: 'Vui lòng điền đầy đủ thông tin yêu cầu'
      });
      return;
    }
    setModalContent({
      title: 'Thông báo',
      cancelLabel: 'Không',
      confirmLabel: 'Có',
      message: 'Bạn có chắc chắn muốn tạo người dùng mới này không?',
      onConfirm: () => {
        handleCreate();
        closeModal();
        addToast({
          type: 'success',
          title: 'Thông báo',
          message: 'Tạo mới người dùng thành công'
        });
        navigate('/dashboard/users');
      },
      onCancel: () => {
        closeModal();
      }
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

  return (
    <div className={styles.container}>
      <h2>Thêm người dùng</h2>
      <div className={styles.avatarWrapper}>
        <label htmlFor="avatar">
          <img className={styles.avatar} 
            src={`data:image/jpeg;base64,${avatar}`} 
            alt="Hình đại diện của người dùng"
          />
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
      <div className={styles.createButtonWrapper}>
        <button className={styles.createButton} onClick={openConfirmCreateModal}>Thêm</button>
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

export default CreateUser;