import styles from './Dropdown.module.scss';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dropdown = ({ trigger }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    }
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  }

  const handleLogout = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/logout`, { withCredentials: true });
      console.log(response.data.message);
      navigate('/login');
    } catch (err) {
      console.log(err.message);
    }
  }

  return (
    <div className={styles.container} ref={dropdownRef}>
      <div className={styles.trigger} onClick={handleToggle}>
        {trigger}
      </div>
      {isOpen && (
        <ul className={styles.children}>
          <button className={styles.child}>Hồ sơ của bạn</button>
          <button onClick={handleLogout} className={styles.child}>Đăng xuất</button>
        </ul>
      )}
    </div>
  )
}

export default Dropdown;