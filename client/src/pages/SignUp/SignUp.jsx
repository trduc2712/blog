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

  const { error, signUp } = useAuthContext();
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

    if (username == '' || password == '') {
      if (username == '') console.log('Vui lòng điền tên người dùng.');
      if (password == '') console.log('Vui lòng điền mật khẩu.');
      if (name == '') console.log('Vui lòng điền tên.');
      return;
    }

    const validUsernamePattern = /^[a-zA-Z0-9]*$/;
    const validNamePattern = /^[a-zA-ZÀ-ỹà-ý ]*$/;
    const validPasswordPattern = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;

    if (!validUsernamePattern.test(username)) {
      console.log('Tên người dùng không được chứa ký tự đặc biệt.');
      return;
    }

    if (!validNamePattern.test(name)) {
      console.log('Tên không được chứa ký tự đặc biệt.');
      return;
    }

    if (!validPasswordPattern.test(password)) {
      console.log(
        'Mật khẩu phải có ít nhất 8 ký tự và bao gồm cả chữ cái và số.'
      );
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
    } else return;
  };

  return (
    <>
      <Header isDashboard={false} />
      <div className={styles.container}>
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
              {error && <p className={styles.error}>{error}</p>}
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
