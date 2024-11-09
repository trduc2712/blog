import styles from './Home.module.scss';
import { useEffect } from 'react';
import Header from '../../components/Header/Header';
import Posts from '../../components/Posts/Posts';

const Home = () => {
  
  useEffect(() => {
    document.title = 'Trang chủ';
  }, []);
 
  return (
    <div className={styles.container}>
      <Header isDashboard={false}/>
      <div className={styles.content}>
        <Posts />
      </div>
    </div>
  )
}

export default Home;