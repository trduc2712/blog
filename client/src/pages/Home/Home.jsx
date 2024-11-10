import styles from './Home.module.scss';
import { useEffect, useState } from 'react';
import Header from '../../components/Header/Header';
import Posts from '../../components/PostCardList/PostCartList';
import Login from '../../components/Modal/Login/Login';
import SignUp from '../../components/Modal/SignUp/SignUp';

const Home = () => {
  const [isModalLoginOpen, setIsModalLoginOpen] = useState(false);
  const [isModalSignUpOpen, setIsModalSignUpOpen] = useState(false);

  const openModalLogin = () => setIsModalLoginOpen(true);
  const openModalSignUp = () => setIsModalSignUpOpen(true);
  const closeModalLogin = () => setIsModalLoginOpen(false);
  const closeModalSignUp = () => setIsModalSignUpOpen(false);

  useEffect(() => {
    document.title = 'Trang chủ | Blog';
  }, []);
 
  return (
    <div className={styles.container}>
      <Header
        isDashboard={false}
        openModalLogin={openModalLogin}
        openModalSignUp={openModalSignUp}
      />
      <div className={styles.content}>
        <Posts />
      </div>
      <Login isOpen={isModalLoginOpen} onClose={closeModalLogin} />
      <SignUp isOpen={isModalSignUpOpen} onClose={closeModalSignUp} />
    </div>
  )
}

export default Home;