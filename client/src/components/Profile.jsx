const Profile = ({ profile }) => {
  if (!profile) return <p className="text-gray-500 dark:text-gray-400 text-center py-4">Loading profile...</p>;
  return (
    <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-lg mb-6 border-l-4 border-rose-500">
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Profile</h2>
      <p className="text-gray-700 dark:text-gray-200"><strong>Username:</strong> {profile.username}</p>
      <p className="text-gray-700 dark:text-gray-200"><strong>Media Count:</strong> {profile.media_count}</p>
    </div>
  );
};

export default Profile;