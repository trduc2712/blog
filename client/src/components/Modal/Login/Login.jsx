import styles from './Login.module.scss';
import { useState } from 'react';
import { useAuthContext } from '../../../contexts/AuthContext';

const Login = ({ isOpen, onClose }) => {
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
        <button onClick={onClose} className={styles.closeButton}>
          <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="#000" className="bi bi-x" viewBox="0 0 16 16">
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
          </svg>
        </button>
        <h2>Đăng nhập</h2>
        <form onSubmit={handleSubmit}>
          <input
            type='text'
            placeholder='Tên người dùng'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onClick={() => setError('')} 
          />
          <input
            type='password'
            placeholder='Mật khẩu'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onClick={() => setError('')}
          />
          <button type='submit'>Đăng nhập</button>
        </form>
        {error && (<p style={{ color: 'red', marginTop: '20px', textAlign: 'center' }}>{error}</p>)}
      </div>
    </div>
  )
}

export default Login;