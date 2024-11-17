import styles from './PostDetail.module.scss';
import Header from '../../components/Header/Header';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Login from '../../components/Login/Login';
import SignUp from '../../components/SignUp/SignUp';
import { formatFullDate } from '../../utils/date';
import { useAuthContext } from '../../contexts/AuthContext';

const PostDetail = () => {
  const { slug } = useParams();

  const [post, setPost] = useState(null);
  const [isModalLoginOpen, setIsModalLoginOpen] = useState(false);
  const [isModalSignUpOpen, setIsModalSignUpOpen] = useState(false);

  const { login, signUp } = useAuthContext();

  const openModalLogin = () => setIsModalLoginOpen(true);
  const openModalSignUp = () => setIsModalSignUpOpen(true);
  const closeModalLogin = () => setIsModalLoginOpen(false);
  const closeModalSignUp = () => setIsModalSignUpOpen(false);

  useEffect(() => {
    const fetchPostBySlug = async (slug) => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/posts/slug/${slug}`, { withCredentials: true });
        setPost(response.data.post);
      } catch(err) {
        if (err.response && err.response.data.error) {
          console.log(err.response.data.error);
        } else {
          console.log(err.message);
        }
      }
    };

    fetchPostBySlug(slug);
  }, []);

  useEffect(() => {
    if (post) {
      document.title = post.title + " | Blog";
    }
  }, [post]);

  if (!post) return <div style={{ height: '100vh', weight: '100vw', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Đang tải bài viết...</div>;

  return (
    <div className={styles.container}>
      <Header
          isDashboard={false}
          openModalLogin={openModalLogin}
          openModalSignUp={openModalSignUp}
        />
      <div className={styles.contentWrapper}>
        <div className={styles.content}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <p>{post.category_name}</p>
            <p>Cập nhật lần cuối: {formatFullDate(post.updated_at)}</p>
          </div>
          <h2>{post.title}</h2>
          <p dangerouslySetInnerHTML={{ __html: post.content }} className={styles.postContent} />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
            <strong>{post.user_name}</strong>
          </div>
        </div>
        <Login isOpen={isModalLoginOpen} onClose={closeModalLogin} login={login} />
        <SignUp isOpen={isModalSignUpOpen} onClose={closeModalSignUp} signUp={signUp} />
      </div>
    </div>
  );
};

export default PostDetail;
