import styles from './Login.module.scss';
import { useAuthContext } from '../../contexts/AuthContext';
import { useToastContext } from '../../contexts/ToastContext';

import { useState } from 'react';

const Login = ({ isOpen, onClose }) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [checked, setChecked] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const { error, setError, login } = useAuthContext();

  const { addToast } = useToastContext();

  const handleReset = () => {
    setUsername('');
    setPassword('');
    setError('');
    setUsernameError('');
    setPasswordError('');
    onClose();
  };

  const handleResetUsernameError = () => {
    setUsernameError('');
  };

  const handleResetPasswordError = () => {
    setPasswordError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (username == '' || password == '') {
      if (username == '') setUsernameError('Vui lòng điền tên người dùng.');
      if (password == '') setPasswordError('Vui lòng điền mật khẩu.');
      return;
    }

    const isSuccess = await login(username, password);
    if (isSuccess) {
      addToast({
        type: 'success',
        title: 'Thành công',
        message: 'Đăng nhập thành công.',
      });
      handleReset();
    } else return;
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleCheckboxChange = () => {
    setChecked(!checked);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={handleReset}>
      <div className={styles.container} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Đăng nhập</h2>
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
          <label className={styles.rememberMe}>
            <input
              type="checkbox"
              checked={checked}
              onChange={handleCheckboxChange}
            />
            <span
              className={`${styles.checkMark} ${checked && styles.checked}`}
            >
              {checked && <i className="bi bi-check"></i>}
            </span>
            <p>Nhớ tôi</p>
          </label>
          <button className={styles.submit} type="submit">
            Đăng nhập
          </button>
        </form>
        {error && <p className={styles.error}>{error}</p>}
      </div>
    </div>
  );
};

export default Login;
