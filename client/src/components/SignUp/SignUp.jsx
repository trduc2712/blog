import styles from './SignUp.module.scss';
import { useState } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';
import { useToastContext } from '../../contexts/ToastContext';

const SignUp = ({ isOpen, onClose }) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [nameError, setNameError] = useState('');

  const { error, setError, signUp } = useAuthContext();
  const { addToast } = useToastContext();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (username == '' || password == '') {
      if (username == '') setUsernameError('Vui lòng điền tên người dùng.');
      if (password == '') setPasswordError('Vui lòng điền mật khẩu.');
      if (name == '') setNameError('Vui lòng điền tên.');
      return;
    }

    const validUsernamePattern = /^[a-zA-Z0-9]*$/;
    const validNamePattern = /^[a-zA-ZÀ-ỹà-ý ]*$/;
    const validPasswordPattern = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;

    if (!validUsernamePattern.test(username)) {
      setUsernameError('Tên người dùng không được chứa ký tự đặc biệt.');
      return;
    }
    if (!validNamePattern.test(name)) {
      setNameError('Tên không dược chứa ký tự đặc biệt.');
      return;
    }
    if (!validPasswordPattern.test(password)) {
      setPasswordError(
        'Mật khẩu phải có ít nhất 8 ký tự và bao gồm cả chữ cái và số.'
      );
      return;
    }

    const avatar = '';
    const role = '';
    const isSuccess = await signUp(username, password, name, avatar, role);
    if (isSuccess) {
      addToast({
        type: 'success',
        title: 'Thông báo',
        message: 'Đăng ký thành công',
      });
      handleReset();
    } else return;
  };

  const handleReset = () => {
    setUsername('');
    setPassword('');
    setName('');
    setError('');
    setUsernameError('');
    setPasswordError('');
    setNameError('');
    onClose();
  };

  const handleResetUsernameError = () => {
    setUsernameError('');
  };

  const handleResetPasswordError = () => {
    setPasswordError('');
  };

  const handleResetNameError = () => {
    setNameError('');
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={handleReset}>
      <div className={styles.container} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Đăng ký</h2>
          <div className={styles.close} onClick={handleReset}>
            <i className="bi bi-x"></i>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="username">
              <p>Tên người dùng</p>
            </label>
            <input
              id="username"
              className={usernameError ? styles.redBorder : ''}
              type="text"
              placeholder="Tên người dùng"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onFocus={handleResetUsernameError}
            />
            <p className={styles.usernameError}>{usernameError}</p>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password">
              <p>Mật khẩu</p>
            </label>
            <div className={styles.inputPasswordWrapper}>
              <input
                id="password"
                className={passwordError ? styles.redBorder : ''}
                type={isPasswordVisible ? 'text' : 'password'}
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={handleResetPasswordError}
              />
              <div
                className={styles.togglePassword}
                onClick={togglePasswordVisibility}
              >
                {isPasswordVisible ? (
                  <i className="bi bi-eye-slash"></i>
                ) : (
                  <i className="bi bi-eye"></i>
                )}
              </div>
            </div>
            <p className={styles.passwordError}>{passwordError}</p>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="name">
              <p>Tên</p>
            </label>
            <input
              id="name"
              className={nameError ? styles.redBorder : ''}
              type="text"
              placeholder="Tên"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onFocus={handleResetNameError}
            />
            <p className={styles.nameError}>{nameError}</p>
          </div>
          <button type="submit" className={styles.submit}>
            Đăng ký
          </button>
        </form>
        {error && (
          <p
            style={{
              color: 'red',
              marginTop: '20px',
              textAlign: 'center',
            }}
          >
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default SignUp;
