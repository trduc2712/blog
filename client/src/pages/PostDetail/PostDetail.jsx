import styles from './PostDetail.module.scss';
import Header from '../../components/Header/Header';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Login from '../../components/Login/Login';
import SignUp from '../../components/SignUp/SignUp';
import { formatFullDate } from '../../utils/date';
import { useAuthContext } from '../../contexts/AuthContext';
import { getPost as getPostService } from '../../services/postService';

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
    const getPost = async (slug) => {
      try {
        const post = await getPostService(slug);
        setPost(post);
      } catch (err) {
        console.log(err);
      }
    };

    getPost(slug);
  }, []);

  useEffect(() => {
    if (post) {
      document.title = post.title + ' | Blog';
    }
  }, [post]);

  if (!post)
    return (
      <div
        style={{
          height: '100vh',
          weight: '100vw',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <p>Đang tải bài viết...</p>
      </div>
    );

  return (
    <div className={styles.container}>
      <Header
        isDashboard={false}
        openModalLogin={openModalLogin}
        openModalSignUp={openModalSignUp}
      />
      <div className={styles.contentWrapper}>
        <div className={styles.content}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <p>{post.category_name}</p>
            <p>Cập nhật lần cuối: {formatFullDate(post.updated_at)}</p>
          </div>
          <h2>{post.title}</h2>
          <p
            dangerouslySetInnerHTML={{ __html: post.content }}
            className={styles.postContent}
          />
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <strong>{post.user_name}</strong>
          </div>
        </div>
        <Login
          isOpen={isModalLoginOpen}
          onClose={closeModalLogin}
          login={login}
        />
        <SignUp
          isOpen={isModalSignUpOpen}
          onClose={closeModalSignUp}
          signUp={signUp}
        />
      </div>
    </div>
  );
};

export default PostDetail;
