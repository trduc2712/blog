import styles from './PostCardList.module.scss';
import PostCard from '../PostCard/PostCard';
import { useEffect, useState } from 'react';
import { getAllPosts as getAllPostsService } from '../../services/postService';

const PostCartList = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const getAllPosts = async () => {
      try {
        const posts = await getAllPostsService();
        setPosts(posts);
      } catch (err) {
        console.log(err);
      }
    };

    getAllPosts();
  }, []);

  return (
    <div className={styles.container}>
      {posts.map((post, index) => (
        <div key={index} className={styles.post}>
          <PostCard
            title={post.title}
            thumbnail={post.thumbnail}
            userAvatar={post.user_avatar}
            slug={post.slug}
            userName={post.user_name}
            categoryName={post.category_name}
            createdAt={post.created_at}
            username={post.username}
          />
        </div>
      ))}
    </div>
  )
}

export default PostCartList;