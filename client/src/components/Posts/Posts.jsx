import styles from './Posts.module.scss';
import Post from '../Post/Post';
import { useEffect, useState } from 'react';
import axios from 'axios';

const Posts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/posts`, { withCredentials: true });
        setPosts(response.data.posts);
      } catch(err) {
          if (err.response && err.response.data.error) {
            console.log(err.response.data.error);
          } else {
            console.log(err.message);
          }
        }
      };

    fetchPosts();
    posts.map((post) => {
      console.log(post.userAvatar);
    })
  }, []);

  return (
    <div className={styles.container}>
      {posts.map((post, index) => (
        <div key={index} className={styles.post}>
          <Post
            title={post.title}
            postImage={post.post_image}
            userAvatar={post.user_avatar}
            slug={post.slug}
            userName={post.user_name}
            categoryName={post.category_name}
            createdAt={post.created_at}
          />
        </div>
      ))}
    </div>
  )
}

export default Posts;