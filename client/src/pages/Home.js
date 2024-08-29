// Home.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import postsData from "../misc/posts";
import Navbar from "../components/Navbar";
import Post from "../components/Post";
function Home() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState(postsData);

  const addPost = (image, title, content, date) => {
    const newPost = { id: posts.length + 1, image, title, content, date };
    setPosts([...posts, newPost]);
  };

  const handleCreateEvent = () => {
    navigate("/create-event");
  };

  const handlePostClick = (id) => {
    navigate(`/event-details/${id}`);
  };

  return (
    <>
      <div className="flex flex-col w-full h-full">
        <Navbar />
        <div className="w-full flex justify-end pt-4 pr-8">
          <button
            className="text-zinc-50 bg-[#5c5470] w-48 py-4 px-4 rounded-lg hover:brightness-105"
            onClick={handleCreateEvent}
          >
            Create Event
          </button>
        </div>
        <div className="grid grid-cols-3 gap-4 w-full p-8 pt-4">
          {posts.map((post) => (
            <Post
              key={post.id}
              image={post.image}
              title={post.title}
              content={post.content}
              date={post.date}
              venue={post.venue}
              onClick={() => handlePostClick(post.id)}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default Home;
