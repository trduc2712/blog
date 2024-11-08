import './Login.scss';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Đăng nhập";
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      username: username,
      password: password
    }

    try {
      response = await axios.post('http://localhost:3000/api/login', data, { withCredentials: true });
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
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder='Tên người dùng' value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="password" placeholder='Mật khẩu' value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Đăng nhập</button>
      </form>
      {error && (<p style={{ color: 'red' }}>{error}</p>)}
    </div>
  )
}

export default Login;