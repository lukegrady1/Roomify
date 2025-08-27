import React, { useState } from 'react';

const Forum: React.FC = () => {
  const [posts, setPosts] = useState<string[]>([]);
  const [newPost, setNewPost] = useState('');

  const handleAddPost = () => {
    setPosts([...posts, newPost]);
    setNewPost('');
  };

  return (
    <div>
      <h3>Discussion Forum</h3>
      <div>
        {posts.map((post, index) => (
          <div key={index}>{post}</div>
        ))}
      </div>
      <input
        type="text"
        value={newPost}
        onChange={(e) => setNewPost(e.target.value)}
        placeholder="Add a new post"
      />
      <button onClick={handleAddPost}>Post</button>
    </div>
  );
};

export default Forum; 