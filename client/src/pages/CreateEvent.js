// CreateEvent.js
import React from 'react';
import PostForm from '../components/PostForm';
import Navbar from '../components/Navbar';

function CreateEvent() {
  const handleAddPost = (postContent) => {
    // Logic to handle the new post, e.g., save to the server or update state
    console.log('New Post:', postContent);
  };

  return (
    <div className="App flex flex-col h-screen bg-gradient-linear pt-16">
      <Navbar />
      <div className="flex flex-col flex-grow w-full p-4 overflow-y-auto">
        <div className="w-full max-w-3xl mx-auto mb-8">
          <PostForm onAddPost={handleAddPost} />
        </div>
      </div>
    </div>
  );
}

export default CreateEvent;
