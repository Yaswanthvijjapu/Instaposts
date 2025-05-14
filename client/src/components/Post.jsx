const Post = ({ post, comments, onToggleComments, showCommentsByDefault = false }) => {
  return (
    <div className="bg-white dark:bg-gray-700 p-4 rounded-xl shadow-md hover:shadow-xl hover:scale-105 transform transition duration-300">
      {post.media_type === 'VIDEO' ? (
        <video
          src={post.media_url}
          controls
          className="w-full h-64 object-cover rounded-lg mb-4"
        />
      ) : (
        <img
          src={post.media_url}
          alt={post.caption || 'Instagram post'}
          className="w-full h-64 object-cover rounded-lg mb-4"
        />
      )}
      <p className="text-gray-700 dark:text-gray-200 mb-2">{post.caption || 'No caption'}</p>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
        {new Date(post.timestamp).toLocaleDateString()} | {post.media_type} | {post.like_count} Likes
      </p>
      <a
        href={post.permalink}
        target="_blank"
        rel="noopener noreferrer"
        className="text-amber-500 hover:text-amber-400 transition"
      >
        View on Instagram
      </a>
      <div className="mt-2">
        {!showCommentsByDefault && (
          <button
            onClick={onToggleComments}
            className="text-emerald-500 hover:text-emerald-400 transition"
          >
            {comments ? 'Hide Comments' : 'Show Comments'}
          </button>
        )}
        {(comments || showCommentsByDefault) && (
          <div className="mt-2 space-y-2">
            {comments && comments.length > 0 ? (
              comments.map((comment) => (
                <p key={comment.id} className="text-gray-600 dark:text-gray-300">
                  <strong>{comment.username}</strong>: {comment.text}
                </p>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No comments</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Post;