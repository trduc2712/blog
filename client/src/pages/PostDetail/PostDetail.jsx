import styles from './PostDetail.module.scss';
import Header from '@components/Header/Header';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { formatFullDate } from '@utils/date';
import { useAuthContext } from '@contexts/AuthContext';
import { getPost as getPostService } from '@services/postService';

const PostDetail = () => {
  const { slug } = useParams();

  const [post, setPost] = useState(null);

  const { login, signUp } = useAuthContext();

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

  if (!post) return null;

  return (
    <div className={styles.container}>
      <Header isDashboard={false} />
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
      </div>
    </div>
  );
};

export default PostDetail;
