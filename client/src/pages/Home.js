import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Post from "../components/Post";
import useAuthorization from "../hooks/useAuthorization";
import { useUser } from "../contexts/UserContext";
import { bouncy } from "ldrs";

function Home() {
  bouncy.register();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const { userProfile } = useUser();
  const username = userProfile?.username;

  // Authorization for creating events
  const { isAuthorized: canCreateEvent, loading: authzLoadingCreate } =
    useAuthorization(username, "write", "events");

  // Authorization for viewing events
  const { isAuthorized: canViewEvents, loading: authzLoadingView } =
    useAuthorization(username, "read", "events");

  // Fetch events from the API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("https://localhost:3000/events", {
          headers: {
            Authorization: `Bearer ${userProfile.username}`,
          },
          withCredentials: true, // Include credentials if necessary
        });
        setPosts(response.data);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleCreateEvent = () => {
    navigate("/eventcreate");
  };

  const handlePostClick = (id) => {
    navigate(`/events/${id}`);
  };

  const handleUpvote = async (postId) => {
    try {
      await axios.post(`https://localhost:3000/events/${postId}/upvote`);
      const updatedPosts = posts.map((post) =>
        post._id === postId
          ? { ...post, upvotes: (post.upvotes || 0) + 1 }
          : post
      );
      setPosts(updatedPosts);
    } catch (error) {
      console.error("Failed to upvote:", error);
    }
  };

  const handleDownvote = async (postId) => {
    try {
      await axios.post(`https://localhost:3000/events/${postId}/downvote`, {
        headers: {
          Authorization: `Bearer ${userProfile.username}`,
        },
        withCredentials: true, // Include credentials if necessary
      });
      const updatedPosts = posts.map((post) =>
        post._id === postId
          ? { ...post, downvotes: (post.downvotes || 0) + 1 }
          : post
      );
      setPosts(updatedPosts);
    } catch (error) {
      console.error("Failed to downvote:", error);
    }
  };

  // Display loading spinner while waiting for authorization checks
  if (loading || authzLoadingCreate || authzLoadingView) {
    return (
      <div className="h-screen w-screen flex justify-center items-center">
        <l-bouncy size="45" speed="1.75" color="black"></l-bouncy>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="flex flex-col w-full h-full">
        <div className="grid grid-cols-2 w-full h-[300px] px-8 font-bold border-b border-zinc-200">
          <div className="flex flex-col justify-center items-start text-left text-wrap">
            <h1 className="text-zinc-800 text-5xl">Create, Manage, Enjoy!</h1>
            <h1 className="text-5xl text-[#e74b2d]">
              Your Events, Our Platform
            </h1>
          </div>
          <img
            className="w-80 h-80 ml-auto rotate-[10deg]"
            src={require("../misc/images/318348555_60eb8b32-a15e-47d5-9f63-518a05b76acc.png")}
            alt="hero banner"
          />
        </div>


        <div className="w-full flex justify-end pt-4 pr-4">
          <button
            className="text-zinc-50 font-medium bg-[#e74b2d] w-48 py-4 px-4 rounded hover:brightness-110 transition-all"
            onClick={handleCreateEvent}
          >
            Create Event
          </button>
        </div>

        {canViewEvents ? (
          <div className="grid grid-cols-3 gap-4 w-full p-8 pt-4">
            {posts.map((post) => (
              <Post
                key={post._id}
                image={`https://localhost:3000/${post.image.path.slice(30)}`}
                title={post.title}
                content={post.description}
                date={new Date(post.date).toLocaleDateString()}
                venue={post.location}
                upvotes={post.upvotes}
                downvotes={post.downvotes}
                onUpvote={() => handleUpvote(post._id)}
                onDownvote={() => handleDownvote(post._id)}
                onClick={() => handlePostClick(post._id)}
              />
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center h-full text-xl font-semibold">
            You are not authorized to view events.
          </div>
        )}
      </div>
    </>
  );
}

export default Home;