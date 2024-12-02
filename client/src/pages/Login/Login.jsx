import styles from './Login.module.scss';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@contexts/AuthContext';
import { useToastContext } from '@contexts/ToastContext';
import Header from '@components/Header/Header';
import ToastList from '@components/ToastList/ToastList';

const Login = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isRememberMe, setIsRememberMe] = useState(false);
  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const navigate = useNavigate();

  const { error, setError, login } = useAuthContext();
  const { createToast } = useToastContext();

  const handleReset = () => {
    setUsername('');
    setPassword('');
    setError('');
    setUsernameError('');
    setPasswordError('');
  };

  const handleResetUsernameError = () => {
    setUsernameError('');
  };

  const handleResetPasswordError = () => {
    setPasswordError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      if (!username) setUsernameError('Vui lòng điền tên người dùng.');
      if (!password) setPasswordError('Vui lòng điền mật khẩu.');
      return;
    }

    const isSuccess = await login(username, password);
    if (isSuccess) {
      createToast({
        type: 'success',
        title: 'Thành công',
        message: 'Đăng nhập thành công.',
      });
      handleReset();
      navigate('/');
    } else return;
  };

  const handleTogglePassword = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleToggleRememberMe = () => {
    setIsRememberMe(!isRememberMe);
  };

  return (
    <>
      <Header isDashborad={false} />
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.header}>
            <h2>Đăng nhập</h2>
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
                  onClick={handleTogglePassword}
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
                isRememberMe
                onChange={handleToggleRememberMe}
              />
              <span
                className={`${styles.checkMark} ${isRememberMe && styles.checked}`}
              >
                {isRememberMe && <i className="bi bi-check"></i>}
              </span>
              <p>Nhớ tôi</p>
            </label>
            <button className={`${styles.submit} primary-btn`} type="submit">
              Đăng nhập
            </button>
          </form>
          {error && <p className={styles.error}>{error}</p>}
        </div>
      </div>
      <ToastList />
    </>
  );
};

export default Login;
