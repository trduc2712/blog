import styles from './Login.module.scss';
import { useState } from 'react';
import { useAuthContext } from '../../../contexts/AuthContext';

const Login = ({ isOpen, onClose }) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const { error, setError, handleLogin } = useAuthContext();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (username == '' || password == '') {
      setError('Vui lòng điền đầy đủ thông tin vào tất cả các trường bắt buộc.');
      return;
    }

    await handleLogin(username, password);

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
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#000" className="bi bi-x" viewBox="0 0 16 16">
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
          </svg>
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
              <div className={styles.inputPassword}>
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
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye-slash" viewBox="0 0 16 16">
                      <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z"/>
                      <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829"/>
                      <path d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z"/>
                    </svg>
                  :
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16">
                      <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/>
                      <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
                    </svg>
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