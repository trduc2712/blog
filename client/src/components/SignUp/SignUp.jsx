import styles from './SignUp.module.scss';
import { useState } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';
import { useToastContext } from '../../contexts/ToastContext';

const SignUp = ({ isOpen, onClose }) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const { error, setError, signUp } = useAuthContext();
  const { addToast } = useToastContext();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validUsernamePattern = /^[a-zA-Z0-9]*$/;
    const validNamePattern = /^[a-zA-ZÀ-ỹà-ý ]*$/;
    const validPasswordPattern = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;

    if (username == '' || password == '' || name == '') {
      setError('Vui lòng điền đầy đủ thông tin vào tất cả các trường bắt buộc');
      return;
    }
    if (!validUsernamePattern.test(username)) {
      setError('Tên người dùng không được chứa ký tự đặc biệt');
      return;
    }
    if (!validNamePattern.test(name)) {
      setError('Tên không dược chứa ký tự đặc biệt');
      return;
    }
    if (!validPasswordPattern.test(password)) {
      setError('Mật khẩu phải có ít nhất 6 ký tự và bao gồm chữ cái và số');
      return;
    }

    const avatar = '';
    const role = '';
    const isSuccess = await await signUp(username, password, name, avatar, role);
    if (isSuccess) {
      addToast({
        type: 'success',
        title: "Thông báo",
        message: "Đăng ký thành công",
      });
    } else return;

    setUsername('');
    setPassword('');
    setName('');
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
        setName('');
        setError('');
        onClose();
      }}
    >
      <div className={styles.container} onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => {
            setUsername('');
            setPassword('');
            setName('');
            setError('');
            onClose();
          }}
          className={styles.closeButton}
        >
          <i className="bi bi-x"></i>
        </button>
        <h2>Đăng ký</h2>
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
            <div className={styles.formGroup}>
              <label htmlFor='name'>Tên</label>
              <input 
                type='text'
                placeholder='Tên'
                value={name}
                onChange={(e) => setName(e.target.value)}
                onClick={() => setError('')}
                id='name'
              />
            </div>
          </div>
          <button type='submit'>Đăng ký</button>
        </form>
        {error && (<p style={{ color: 'red', marginTop: '20px', textAlign: 'center' }}>{error}</p>)}
      </div>
    </div>
  )
}

export default SignUp;