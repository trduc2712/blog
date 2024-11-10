import styles from './SignUp.module.scss';
import { useState } from 'react';
import { useAuthContext } from '../../../contexts/AuthContext';

const SignUp = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const { error, setError, handleSignUp } = useAuthContext();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validUsernamePattern = /^[a-zA-Z0-9]*$/;
    const validNamePattern = /^[a-zA-ZÀ-ỹà-ý ]*$/;
    const validPasswordPattern = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;

    if (username == '' || password == '' || name == '') {
      setError('Vui lòng điền đầy đủ thông tin vào tất cả các trường bắt buộc.');
      return;
    }
    if (!validUsernamePattern.test(username)) {
      setError('Tên người dùng không được chứa ký tự đặc biệt.');
      return;
    }
    if (!validNamePattern.test(name)) {
      setError('Tên không dược chứa ký tự đặc biệt');
      return;
    }
    if (!validPasswordPattern.test(password)) {
      setError('Mật khẩu phải có ít nhất 6 ký tự và bao gồm chữ cái và số.');
      return;
    }

    await handleSignUp(username, password, name);

    setUsername('');
    setPassword('');
    setName('');
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
        setName('');
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
        <h2>Đăng ký</h2>
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
          <input 
            type='text'
            placeholder='Tên'
            value={name}
            onChange={(e) => setName(e.target.value)}
            onClick={() => setError('')}
          />
          <button type='submit'>Đăng ký</button>
        </form>
        {error && (<p style={{ color: 'red', marginTop: '20px', textAlign: 'center' }}>{error}</p>)}
      </div>
    </div>
  )
}

export default SignUp;