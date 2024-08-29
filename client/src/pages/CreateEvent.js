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
    <>
      <Navbar />
      <div className="flex flex-col pt-8">
        <div className="flex flex-col flex-grow w-full py-4 px-8">
          <PostForm onAddPost={handleAddPost} />
        </div>
      </div></>
  );
}

export default CreateEvent;
