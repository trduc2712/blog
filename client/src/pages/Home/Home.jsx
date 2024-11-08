import './Home.scss';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Trang chủ';

    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/user', { withCredentials: true });
        setUser(response.data.user);
      } catch(err) {
          if (err.response && err.response.data.error) {
            console.log(err.response.data.error);
          } else {
            console.log(err.message);
          }
        }
      };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/logout', { withCredentials: true });
      console.log(response.data.message);
      navigate('/login');
    } catch (err) {
      console.log(err.message);
    }
  }

  return (
    <div>
      <h1>Home</h1>
      {user ? (
        <>
          <p>Xin chào {user.name}</p>
          <button onClick={handleLogout}>Đăng xuất</button>
        </>
      ) : (
        <p>Chưa đăng nhập</p>
      )}
    </div>
  )
}

export default Home;