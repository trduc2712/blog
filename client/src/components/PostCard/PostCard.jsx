import styles from './PostCard.module.scss';
import { Link, useNavigate } from 'react-router-dom';
import { formatShortDate } from '../../utils/date';

const PostCard = ({ title, thumbnail, slug, userName, userAvatar, categoryName, createdAt, username, categorySlug }) => {
  const navigate = useNavigate()
  
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <img
          src={`data:image/jpeg;base64,${thumbnail}`} alt='Hình đại diện của bài viết.'
          className={styles.thumbnail}
          onClick={() => navigate(`/post/${slug}`)}
        />
      </div>
      <div className={styles.body}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Link className={styles.categoryName} to={`/category/${categorySlug}`}><p>{categoryName}</p></Link>
          <p className={styles.createdAt}>{formatShortDate(createdAt)}</p>
        </div>
        <h3 className={styles.title} ><Link to={`/post/${slug}`}>{title}</Link></h3>
      </div>
      <div className={styles.footer}>
        <div style={{ display: 'flex', alignItems: 'center' }} onClick={() => navigate(`/user/${username}`)}>
          <img
            src={`data:image/jpeg;base64,${userAvatar}`}
            alt='Hình đại diện của tác giả bài viết.'
            className={styles.userAvatar}
          />
          <p className={styles.userName} >{userName}</p>
        </div>
      </div>
    </div>
  )
}

export default PostCard;