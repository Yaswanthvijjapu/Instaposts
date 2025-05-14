import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Post from './Post';

const ViewPostPage = () => {
  const { mediaId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get('https://instaposts-8r5m.vercel.app/api/posts');
        const foundPost = response.data.posts.find((p) => p.id === mediaId);
        if (!foundPost) throw new Error('Post not found');
        setPost(foundPost);

        const commentsResponse = await axios.get(`https://instaposts-8r5m.vercel.app/api/comments/${mediaId}`);
        setComments(commentsResponse.data.comments);
      } catch (err) {
        setError('Failed to load post or comments');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [mediaId]);

  if (loading) return <p className="text-gray-500 dark:text-gray-400 text-center py-8">Loading...</p>;
  if (error) return <p className="text-rose-500 bg-rose-50 p-3 rounded-lg text-center">{error}</p>;
  if (!post) return <p className="text-gray-500 dark:text-gray-400 text-center py-8">Post not found</p>;

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={() => navigate('/')}
        className="mb-4 text-emerald-500 hover:text-emerald-400 flex items-center gap-2 transition"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to Posts
      </button>
      <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-lg">
        <Post post={post} comments={comments} onToggleComments={() => {}} showCommentsByDefault />
      </div>
    </div>
  );
};

export default ViewPostPage;