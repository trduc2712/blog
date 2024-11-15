import styles from './Login.module.scss';
import { useState } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';
import { useToastContext } from '../../contexts/ToastContext';

const Login = ({ isOpen, onClose }) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const { error, setError, login } = useAuthContext();
  const { addToast } = useToastContext();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (username == '' || password == '') {
      setError('Vui lòng điền đầy đủ thông tin vào tất cả các trường bắt buộc.');
      return;
    }

    await login(username, password);

    addToast({
      title: "Thông báo",
      message: "Đăng nhập thành công",
    });

    setUsername('');
    setPassword('');
    setError('');
    onClose();
  }

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  }

  if (!isOpen) return null;

  return (
    <div
      className={styles.overlay}
      onClick={() => {
        setUsername('');
        setPassword('');
        setError('');
        onClose();
      }}
    >
      <div className={styles.container} onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => {
            setUsername('');
            setPassword('');
            setError('');
            onClose();
          }}
          className={styles.closeButton}
        >
          <i className="bi bi-x"></i>
        </button>
        <h2>Đăng nhập</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroups}>
            <div className={styles.formGroup}>
              <label htmlFor='username'>Tên người dùng</label>
              <input
                type='text'
                placeholder='Tên người dùng'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onClick={() => setError('')}
                id='username'
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor='password'>Mật khẩu</label>
              <div className={styles.inputPasswordWrapper}>
                <input
                  type={isPasswordVisible ? 'text' : 'password'}
                  placeholder='Mật khẩu'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onClick={() => setError('')}
                  id='password'
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
          </div>
          <button type='submit'>Đăng nhập</button>
        </form>
        {error && (<p style={{ color: 'red', marginTop: '20px', textAlign: 'center' }}>{error}</p>)}
      </div>
    </div>
  )
}

export default Login;