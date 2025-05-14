import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import Profile from './components/Profile';
import PostsPage from './components/PostsPage';
import NewPostPage from './components/NewPostPage';
import ViewPostPage from './components/ViewPostPage';

const App = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [showProfile, setShowProfile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/profile');
        setProfile(response.data);
      } catch (err) {
        setError('Failed to load profile');
        console.error(err);
      }
    };
    fetchProfile();
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-yellow-50 dark:bg-gray-800 transition-colors duration-300">
        <nav className="gradient-bg text-white p-4 shadow-lg">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold tracking-tight">InstaDash</h1>
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/" className="hover:text-emerald-300 transition-colors">Posts</Link>
              <Link to="/new-post" className="hover:text-emerald-300 transition-colors">New Post</Link>
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="p-2 rounded-full hover:bg-emerald-500/20 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </button>
            </div>
            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>
          {isMenuOpen && (
            <div className="md:hidden mt-4 bg-amber-600 rounded-lg p-4 animate-slide-in">
              <Link
                to="/"
                className="block py-2 hover:text-emerald-300 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Posts
              </Link>
              <Link
                to="/new-post"
                className="block py-2 hover:text-emerald-300 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                New Post
              </Link>
              <button
                onClick={() => {
                  setShowProfile(!showProfile);
                  setIsMenuOpen(false);
                }}
                className="block py-2 text-left hover:text-emerald-300 transition-colors"
              >
                Profile
              </button>
            </div>
          )}
        </nav>
        <div className="container mx-auto p-4">
          {error && (
            <p className="text-rose-500 bg-rose-50 p-3 rounded-lg mb-4 animate-pulse">
              {error}
            </p>
          )}
          {showProfile && (
            <div className="animate-slide-in">
              <Profile profile={profile} />
            </div>
          )}
          <Routes>
            <Route path="/" element={<PostsPage />} />
            <Route path="/new-post" element={<NewPostPage />} />
            <Route path="/post/:mediaId" element={<ViewPostPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;