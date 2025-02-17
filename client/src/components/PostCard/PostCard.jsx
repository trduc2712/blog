import styles from './PostCard.module.scss';
import { Link, useNavigate } from 'react-router-dom';
import { formatShortDate } from '@utils/date';
import { useAuthContext } from '@contexts/AuthContext';

const PostCard = ({
  id,
  title,
  thumbnail,
  slug,
  userName,
  userAvatar,
  categoryName,
  createdAt,
  username,
  categorySlug,
  onDeletePost,
}) => {
  const navigate = useNavigate();

  const { user } = useAuthContext();

  const pathname = window.location.pathname;

  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}>
          <img
            src={`data:image/jpeg;base64,${thumbnail}`}
            alt="Hình đại diện của bài viết."
            className={styles.thumbnail}
            onClick={() => navigate(`/posts/${slug}`)}
          />
        </div>
        <div className={styles.body}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Link
              className={styles.categoryName}
              to={`/?categorySlug=${categorySlug}`}
            >
              <p>{categoryName}</p>
            </Link>
            <p className={styles.createdAt}>{formatShortDate(createdAt)}</p>
          </div>
          <h3 className={styles.title}>
            <Link to={`/posts/${slug}`}>{title}</Link>
          </h3>
        </div>
        <div className={styles.footer}>
          {pathname != '/' ? (
            user.username != username ? (
              <div className={styles.actions}>
                <div
                  className={styles.action}
                  onClick={() => navigate(`/posts/${slug}`)}
                >
                  <i className="bi bi-eye"></i>
                </div>
              </div>
            ) : (
              <div className={styles.actions}>
                <div
                  className={styles.action}
                  onClick={() => navigate(`/posts/${slug}`)}
                >
                  <i className="bi bi-eye"></i>
                </div>
                <div
                  className={styles.action}
                  onClick={() => navigate(`posts/edit/${id}`)}
                >
                  <i className="bi bi-pen"></i>
                </div>
                <div
                  className={styles.action}
                  onClick={() => {
                    onDeletePost(id);
                  }}
                >
                  <i className="bi bi-trash"></i>
                </div>
              </div>
            )
          ) : (
            <div
              style={{ display: 'flex', alignItems: 'center' }}
              onClick={() => navigate(`/profile/${username}`)}
            >
              {userAvatar.length > 0 ? (
                <img
                  src={`data:image/jpeg;base64,${userAvatar}`}
                  alt="Hình đại diện của tác giả bài viết."
                  className={styles.userAvatar}
                />
              ) : (
                <img
                  src="data:image/png;base64,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"
                  className={styles.userAvatar}
                />
              )}
              <p className={styles.userName}>{userName}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PostCard;
