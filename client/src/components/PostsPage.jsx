import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import Post from './Post';

const PostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [nextUrl, setNextUrl] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mediaType, setMediaType] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [comments, setComments] = useState({});
  const location = useLocation();
  const isFetching = useRef(false);

  useEffect(() => {
    if (isFetching.current) return;
    if (location.state?.refresh) {
      setPosts([]);
      setNextUrl(null);
    }
    fetchPosts();
  }, [location.state]);

  const fetchPosts = async (url = 'http://localhost:5000/api/posts') => {
    if (isFetching.current) return;
    isFetching.current = true;
    setLoading(true);
    try {
      const response = await axios.get(url);
      const newPosts = response.data.posts || [];
      setPosts((prev) => {
        const existingIds = new Set(prev.map((post) => post.id));
        const uniqueNewPosts = newPosts.filter((post) => !existingIds.has(post.id));
        return [...prev, ...uniqueNewPosts];
      });
      setNextUrl(response.data.next);
    } catch (err) {
      setError('Failed to load posts');
      console.error(err);
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  };

  const fetchComments = async (mediaId) => {
    if (comments[mediaId]) {
      setComments({ ...comments, [mediaId]: null });
      return;
    }
    try {
      const response = await axios.get(`https://instaposts-8r5m.vercel.app/api/comments/${mediaId}`);
      setComments({ ...comments, [mediaId]: response.data.comments });
    } catch (err) {
      setError('Failed to load comments');
      console.error(err);
    }
  };

  const loadMore = () => {
    if (nextUrl && !loading) {
      fetchPosts(nextUrl);
    }
  };

  const filteredPosts = posts.filter((post) => {
    const matchesMediaType = mediaType === 'ALL' || post.media_type === mediaType;
    const matchesSearch = !searchQuery || post.caption?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesMediaType && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <select
            value={mediaType}
            onChange={(e) => setMediaType(e.target.value)}
            className="w-full p-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 transition"
          >
            <option value="ALL">All Media Types</option>
            <option value="IMAGE">Images</option>
            <option value="VIDEO">Videos</option>
            <option value="CAROUSEL_ALBUM">Carousel Albums</option>
          </select>
        </div>
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search by caption..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 transition pl-10"
          />
          <svg
            className="absolute left-3 top-3.5 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>
      {error && (
        <p className="text-rose-500 bg-rose-50 p-3 rounded-lg animate-pulse">
          {error}
        </p>
      )}
      {filteredPosts.length === 0 && !loading ? (
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
          No posts match your criteria
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <Link to={`/post/${post.id}`} key={post.id}>
              <Post post={post} comments={comments[post.id]} onToggleComments={() => fetchComments(post.id)} />
            </Link>
          ))}
        </div>
      )}
      {nextUrl && (
        <div className="mt-8 text-center">
          <button
            onClick={loadMore}
            disabled={loading}
            className="gradient-bg text-white px-6 py-3 rounded-full hover:scale-105 transform transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
};

export default PostsPage;