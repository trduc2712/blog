import styles from './SignUp.module.scss';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@contexts/AuthContext';
import { useToastContext } from '@contexts/ToastContext';
import Header from '@components/Header';
import ToastList from '@components/ToastList';
import Footer from '@components/Footer';
import Input from '@components/Input';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const navigate = useNavigate();

  const { error, setError, signUp } = useAuthContext();
  const { createToast } = useToastContext();

  const handleChangeUsername = (username) => {
    setUsername(username);
  };

  const handleChangePassword = (password) => {
    setPassword(password);
  };

  const handleChangeName = (name) => {
    setName(name);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password || !name) {
      createToast({
        type: 'warning',
        title: 'Cảnh báo',
        message: 'Vui lòng điền đầy đủ thông tin.',
      });
      return;
    }

    const validUsernamePattern = /^[a-zA-Z0-9]*$/;
    const validNamePattern = /^[a-zA-ZÀ-ỹà-ý ]*$/;
    const validPasswordPattern = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;

    if (!validUsernamePattern.test(username)) {
      createToast({
        type: 'warning',
        title: 'Cảnh báo',
        message: 'Tên người dùng không được chứa ký tự đặc biệt.',
      });
      return;
    }

    if (!validNamePattern.test(name)) {
      createToast({
        type: 'warning',
        title: 'Cảnh báo',
        message: 'Tên không được chứa ký tự đặc biệt.',
      });
      return;
    }

    if (!validPasswordPattern.test(password)) {
      createToast({
        type: 'warning',
        title: 'Cảnh báo',
        message:
          'Mật khẩu phải có ít nhất 8 ký tự và bao gồm cả chữ cái và số.',
      });
      return;
    }

    const avatar = '';
    const role = '';
    const isSuccess = await signUp(username, password, name, avatar, role);
    if (isSuccess) {
      createToast({
        type: 'success',
        title: 'Thông báo',
        message: 'Đăng ký thành công',
      });
      navigate('/login');
    } else {
      createToast({
        type: 'error',
        title: 'Lỗi',
        message: error,
      });
    }
  };

  return (
    <>
      <Header isDashboard={false} />
      <div className="container">
        <div className="card">
          <div className="card-header">
            <h3>Đăng ký</h3>
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
              <div className="form-group">
                <label>Tên</label>
                <Input
                  variant="text"
                  placeholder="Tên"
                  value={name}
                  onChangeValue={(e) => handleChangeName(e.target.value)}
                />
              </div>
              <button type="submit" className="primary-btn">
                Đăng ký
              </button>
            </form>
          </div>
        </div>
      </div>
      <ToastList />
      <Footer />
    </>
  );
};

export default SignUp;
