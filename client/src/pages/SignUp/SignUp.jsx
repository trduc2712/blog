import styles from './SignUp.module.scss';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Đăng ký';
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      username: username,
      password: password,
      name: name
    }

    if (username == '' || password == '' || name == '') {
      setError('Vui lòng điền đầy đủ thông tin vào tất cả các trường bắt buộc.');
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/sign-up`, data, { withCredentials: true });
      navigate('/login');
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
      <h1>Đăng ký</h1>
      <form onSubmit={handleSubmit}>
        <input type='text' placeholder='Tên người dùng' value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type='password' placeholder='Mật khẩu' value={password} onChange={(e) => setPassword(e.target.value)} />
        <input type='text' placeholder='Tên' value={name} onChange={(e) => setName(e.target.value)} />
        <button type='submit'>Đăng ký</button>
      </form>
      {error && (<p style={{ color: 'red' }}>{error}</p>)}
      <Link to='/login'>Đăng nhập</Link>
    </div>
  )
}

export default SignUp;