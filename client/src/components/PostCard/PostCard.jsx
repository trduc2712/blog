import styles from './PostCard.module.scss';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { formatShortDate } from '../../utils/dateUtils';
import { createImageObjectURL } from '../../utils/imageUtils';

const PostCard = ({ title, postImage, slug, userName, userAvatar, categoryName, createdAt, username }) => {
  const [imageSource, setImageSource] = useState(null);
  const [userAvatarSource, setUserAvatarSource] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    setImageSource(createImageObjectURL(postImage?.data));
    setUserAvatarSource(createImageObjectURL(userAvatar?.data))
  }, [postImage, userAvatar]);

  return (
    <div className={styles.container}>
      <img
        src={imageSource} alt="Hình đại diện của bài viết"
        className={styles.postImage}
        onClick={() => navigate(`/post/${slug}`)}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <p className={styles.categoryName} >{categoryName}</p>
        <p className={styles.createdAt}>{formatShortDate(createdAt)}</p>
      </div>
      <h3 className={styles.title} ><Link to={`/post/${slug}`}>{title}</Link></h3>
      <div style={{ display: 'flex', alignItems: 'center', marginTop: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center' }} onClick={() => navigate(`/user/${username}`)}>
          <img
            src={userAvatarSource}
            alt="Hình đại diện của tác giả bài viết"
            className={styles.userAvatar}
          />
          <p className={styles.userName} >{userName}</p>
        </div>
      </div>
    </div>
  )
}

export default PostCard;