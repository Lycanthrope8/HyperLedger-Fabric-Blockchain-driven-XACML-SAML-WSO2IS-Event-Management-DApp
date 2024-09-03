import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Navbar from "../components/Navbar";
import Post from "../components/Post";
import { useUser } from '../contexts/UserContext';

function Home() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userProfile } = useUser();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('https://localhost:3000/events');
        setPosts(response.data);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // console.log(posts.map(post => `https://localhost:3000/${post.image.path.slice(30)}`));

  const handleCreateEvent = () => {
    navigate("/eventcreate");
  };

  const handlePostClick = (id) => {
    navigate(`/events/${id}`);
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col w-full h-full">
        <div className="w-full flex justify-end pt-4 pr-8">
          <button
            className="text-zinc-50 bg-[#5c5470] w-48 py-4 px-4 rounded-lg hover:brightness-105"
            onClick={handleCreateEvent}
          >
            Create Event
          </button>
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-full">Loading...</div>
        ) : (
          <div className="grid grid-cols-3 gap-4 w-full p-8 pt-4">
            {posts.map((post) => (
              <Post
                key={post._id}
                image={`https://localhost:3000/${post.image.path.slice(30)}`}
                title={post.title}
                content={post.description}
                date={new Date(post.date).toLocaleDateString()}
                venue={post.location}
                onClick={() => handlePostClick(post._id)}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Home;
