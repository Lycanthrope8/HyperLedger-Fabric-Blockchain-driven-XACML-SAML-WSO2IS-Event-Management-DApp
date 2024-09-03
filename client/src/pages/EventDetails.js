import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from 'axios';
import { TbStar, TbStarFilled } from "react-icons/tb";
import { PiShareFatBold, PiShareFatFill } from "react-icons/pi";
import { IoTicketSharp } from "react-icons/io5";
import { FaCalendarDays, FaLocationDot } from "react-icons/fa6";

function EventDetails() {
  const [interested, setInterested] = useState(false);
  const [going, setGoing] = useState(false);
  const [post, setPost] = useState(null);

  const { id } = useParams();

  useEffect(() => {
    const fetchEventDetails = async () => {
      const response = await axios.get(`https://localhost:3000/events/${id}`);
      setPost(response.data);
    };

    fetchEventDetails();
  }, [id]);

  // console.log("https://localhost:3000" + post.image.slice(7));

  if (!post) {
    return (
      <div className="text-center text-zinc-50 text-xl">Event not found</div>
    );
  }

  const handleInterested = () => {
    setInterested(!interested);
    alert("You've marked yourself as interested in this event!");
  };

  const handleGoing = () => {
    setGoing(!going);
    alert("You're going to this event!");
  };

  const handleBuyTicket = () => {
    alert("Redirecting to ticket purchase page...");
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center w-full p-8">
        <div className="relative w-1/2 h-auto">
          <img
            src={`https://localhost:3000/${post.image.slice(7)}`}
            alt={post.title}
            className="w-full h-auto object-cover rounded-lg shadow-md"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/60 to-transparent p-6 rounded-b-lg">
            <h1 className="text-center text-3xl font-bold text-white">
              {post.title}
            </h1>
          </div>
        </div>
        <div className="flex space-x-4 mt-4">
          <button
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            onClick={handleInterested}
          >
            {interested ? (
              <TbStarFilled className="text-xl" />
            ) : (
              <TbStar className="text-xl" />
            )}
            Interested
          </button>
          <button
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            onClick={handleGoing}
          >
            {going ? (
              <PiShareFatFill className="text-xl" />
            ) : (
              <PiShareFatBold className="text-xl" />
            )}
            Going
          </button>
          <button
            className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded"
            onClick={handleBuyTicket}
          >
            <IoTicketSharp className="text-xl" />
            Buy a Ticket
          </button>
        </div>
        <div className="w-full">
          <h1 className="text-xl text-zinc-50 mt-4">{post.description}</h1>
          <h1 className="flex items-center gap-2 text-lg text-zinc-50">
            <FaCalendarDays className="text-xl" />
            {new Date(post.date).toLocaleDateString()}
          </h1>
          <h1 className="flex items-center gap-2 text-lg text-zinc-50">
            <FaLocationDot className="text-xl" />
            {post.location}
          </h1>
        </div>
      </div>
    </>
  );
}

export default EventDetails;
