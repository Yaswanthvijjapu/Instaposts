import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const NewPostPage = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validateUrl = (url) => {
    const validFormats = ['.jpg', '.jpeg', '.png', '.mp4', '.mov'];
    const isValid = validFormats.some((ext) => url.toLowerCase().endsWith(ext)) && url.startsWith('https://');
    return isValid ? '' : 'Invalid URL. Use a publicly accessible JPEG, PNG, MP4, or MOV URL (e.g., https://example.com/image.jpg).';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!imageUrl || !caption) {
      setError('Please provide both a media URL and a caption.');
      return;
    }

    const urlError = validateUrl(imageUrl);
    if (urlError) {
      setError(urlError);
      return;
    }

    try {
      const response = await axios.post('https://instaposts-8r5m.vercel.app/api/publish', {
        imageUrl,
        caption,
      });
      if (response.data.success) {
        setImageUrl('');
        setCaption('');
        setError('');
        navigate('/', { state: { refresh: true } });
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to publish post';
      setError(errorMessage);
      console.error('Publish error:', err);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white dark:bg-gray-700 p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Add New Post</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Media URL
          </label>
          <input
            id="imageUrl"
            type="text"
            placeholder="e.g., https://example.com/image.jpg"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="mt-1 w-full p-3 bg-gray-50 dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
          />
        </div>
        <div>
          <label htmlFor="caption" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Caption
          </label>
          <input
            id="caption"
            type="text"
            placeholder="What's on your mind?"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="mt-1 w-full p-3 bg-gray-50 dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
          />
        </div>
        {error && (
          <p className="text-rose-500 bg-rose-50 p-3 rounded-lg animate-pulse">
            {error}
          </p>
        )}
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Ensure the URL is publicly accessible and in a supported format (JPEG, PNG, MP4, MOV).
        </p>
        <button
          type="submit"
          className="gradient-bg text-white w-full py-3 rounded-lg hover:scale-105 transform transition shadow-md"
        >
          Publish Post
        </button>
      </form>
    </div>
  );
};

export default NewPostPage;