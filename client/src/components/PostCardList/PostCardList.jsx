import styles from './PostCardList.module.scss';
import PostCard from '@components/PostCard/PostCard';
import { useAuthContext } from '@contexts/AuthContext';

const PostCardList = ({ posts, onDeletePost }) => {
  const { user } = useAuthContext();

  if (posts == null)
    return <div className={styles.content}>Không có bài viết nào</div>;

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.body}>
          {posts.map((post) => (
            <div key={post.id} className={styles.post}>
              <PostCard
                id={post.id}
                title={post.title}
                thumbnail={post.thumbnail}
                userAvatar={post.user_avatar}
                summary={post.summary}
                slug={post.slug}
                userName={post.user_name}
                categoryName={post.category_name}
                categorySlug={post.category_slug}
                createdAt={post.created_at}
                username={post.user_username}
                onDeletePost={onDeletePost}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostCardList;
