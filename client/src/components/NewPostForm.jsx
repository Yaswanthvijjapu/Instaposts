import { useState } from 'react';
import axios from 'axios';

const NewPostForm = ({ onPostSuccess }) => {
  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://instaposts-8r5m.vercel.app/api/publish', {
        imageUrl,
        caption,
      });
      if (response.data.success) {
        setImageUrl('');
        setCaption('');
        setError('');
        onPostSuccess();
      }
    } catch (err) {
      setError('Failed to publish post');
      console.error(err);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow mb-4">
      <h2 className="text-xl font-semibold mb-2">Add New Post</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Image URL (publicly accessible)"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="border p-2 w-full mb-2 rounded"
        />
        <input
          type="text"
          placeholder="Caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="border p-2 w-full mb-2 rounded"
        />
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Publish Post
        </button>
      </form>
    </div>
  );
};

export default NewPostForm;