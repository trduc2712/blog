import styles from './Login.module.scss';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../../components/Header/Header';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Đăng nhập';
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      username: username,
      password: password
    }

    if (username == '' || password == '') {
      setError('Vui lòng điền đầy đủ thông tin vào tất cả các trường bắt buộc.');
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/login`, data, { withCredentials: true });
      navigate('/');
    } catch (err) {
      if (err.response && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        console.log(err.message);
      }
    }
  }

  return (
    <div>
      {/* <Header isDashboard={false} /> */}
      <h1>Đăng nhập</h1>
      <form onSubmit={handleSubmit}>
        <input type='text' placeholder='Tên người dùng' value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type='password' placeholder='Mật khẩu' value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type='submit'>Đăng nhập</button>
      </form>
      {error && (<p style={{ color: 'red' }}>{error}</p>)}
      <Link to='/sign-up'>Đăng ký</Link>
    </div>
  )
}

export default Login;