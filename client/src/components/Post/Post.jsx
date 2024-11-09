import styles from './Post.module.scss';
import { Link, useNavigate } from 'react-router-dom';

const Post = ({ title, postImage, slug, userName, userAvatar, categoryName, createdAt }) => {
  const navigate = useNavigate();
  
  function formatDate(dateString) {
    const date = new Date(dateString);
    
    let formattedDate = date.toLocaleDateString('vi-VN', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    });

    return formattedDate;
  }

  return (
    <div className={styles.container}>
      <img
        src={postImage} alt="Hình đại diện của bài viết"
        className={styles.postImage}
        onClick={() => navigate(`/posts/${slug}`)}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <p className={styles.categoryName} >{categoryName}</p>
        <p className={styles.createdAt}>{formatDate(createdAt)}</p>
      </div>
      <h3 className={styles.title} ><Link to={`/posts/${slug}`}>{title}</Link></h3>
      <div style={{ display: 'flex', alignItems: 'center', marginTop: 'auto' }}>
        <img src={userAvatar} alt="Hình đại diện của tác giả bài viết"  className={styles.userAvatar} />
        <p className={styles.userName} >{userName}</p>
      </div>
    </div>
  )
}

export default Post;