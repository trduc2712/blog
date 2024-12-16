import styles from './Login.module.scss';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@contexts/AuthContext';
import { useToastContext } from '@contexts/ToastContext';
import Header from '@components/Header';
import ToastList from '@components/ToastList';
import Footer from '@components/Footer';
import Input from '@components/Input';

const Login = () => {
  const [isRememberMe, setIsRememberMe] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const { error, login } = useAuthContext();
  const { createToast } = useToastContext();

  const handleToggleRememberMe = () => {
    setIsRememberMe(!isRememberMe);
  };

  const handleChangeUsername = (username) => {
    setUsername(username);
  };

  const handleChangePassword = (password) => {
    setPassword(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isSuccess = await login(username, password);
    if (isSuccess) {
      createToast({
        type: 'success',
        title: 'Thành công',
        message: 'Đăng nhập thành công.',
      });
      navigate('/');
    } else return;
  };

  return (
    <>
      <Header isDashborad={false} />
      <div className={styles.container}>
        <div className="card">
          <div className="card-header">
            <h3>Đăng nhập</h3>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Tên người dùng</label>
                <Input
                  variant="text"
                  placeholder="Tên người dùng"
                  value={username}
                  onChangeValue={(e) => handleChangeUsername(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Mật khẩu</label>
                <Input
                  variant="password"
                  placeholder="Mật khẩu"
                  value={password}
                  onChangeValue={(e) => handleChangePassword(e.target.value)}
                />
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
              <button className="primary-btn" type="submit">
                Đăng nhập
              </button>
            </form>
            {error && <p className={styles.error}>{error}</p>}
          </div>
        </div>
      </div>
      <ToastList />
      <Footer />
    </>
  );
};

export default Login;
