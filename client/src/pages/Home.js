// Home.js
import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Post from "../components/Post";
import { Link } from "react-router-dom";
function Home() {
  const [posts, setPosts] = useState([
    { id: 1, content: "This is the first post" },
    { id: 2, content: "This is the second post" },
    // Add more posts here
  ]);

  const addPost = (content) => {
    const newPost = { id: posts.length + 1, content };
    setPosts([...posts, newPost]);
  };

  return (
    <div className="App flex flex-col h-screen bg-gradient-linear pt-16">
      <Navbar /><br/><br/>
      <Link to="/create-event">
            <button className="bg-[#5c5470] py-2 px-4 rounded-full hover:brightness-105 text-zinc-50">
              + Create Event
            </button>
          </Link>
      <div className="flex flex-col flex-grow w-full p-4 overflow-y-auto">
        
        <div className="w-full max-w-3xl mx-auto">
          {posts.map((post) => (
            <Post key={post.id} content={post.content} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
