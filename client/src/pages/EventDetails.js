import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { TbStar, TbStarFilled, TbEdit, TbTrash } from "react-icons/tb";
import { PiShareFatBold, PiShareFatFill } from "react-icons/pi";
import { IoTicketSharp } from "react-icons/io5";
import { FaCalendarDays, FaLocationDot } from "react-icons/fa6";
import { useUser } from "../contexts/UserContext";
import moment from "moment";
import { useDropzone } from "react-dropzone";
import useAuthorization from "../hooks/useAuthorization";

function EventDetails() {
  const [interested, setInterested] = useState(false);
  const [going, setGoing] = useState(false);
  const [booked, setBooked] = useState(false);
  const [post, setPost] = useState(null);
  const [editing, setEditing] = useState(false);
  const [files, setFiles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    image: null,
  });

  const navigate = useNavigate();
  const { userProfile } = useUser();
  const { id } = useParams();
  const username = userProfile?.username; 
  const { isAuthorized: canEdit } = useAuthorization(
    username,
    "update",
    "events"
  );
  useEffect(() => {
    const fetchEventDetails = async () => {
      const response = await axios.get(`https://localhost:3000/events/${id}`, {
        headers: {
          Authorization: `Bearer ${userProfile.username}`,
        },
        withCredentials: true, // Include credentials if necessary
      });
      setPost(response.data);
      setFormData({
        title: response.data.title,
        description: response.data.description,
        date: response.data.date.split("T")[0],
        location: response.data.location,
        image: response.data.image,
      });
    };

    fetchEventDetails();
  }, [id]);

  const toggleEdit = () => {
    setEditing(!editing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
    useDropzone({
      accept: {
        'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.svg'],
      },
      onDrop: (acceptedFiles) => {
        setFiles(
          acceptedFiles.map((file) =>
            Object.assign(file, {
              preview: URL.createObjectURL(file),
            })
          )
        );
      },
    });

  const handleSave = async () => {
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("date", formData.date);
    data.append("location", formData.location);
    data.append("image", files[0]);

    try {
      const response = await axios.put(
        `https://localhost:3000/events/${id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${userProfile.username}`,
          },
          withCredentials: true, // Include credentials if necessary
        }
      );
      setPost({ ...post, ...formData });
      setEditing(false);
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await axios.delete(`https://localhost:3000/events/${id}`, {
          headers: {
            Authorization: `Bearer ${userProfile.username}`,
          },
          withCredentials: true, // Include credentials if necessary
        });
        navigate("/");
      } catch (error) {
        console.error("Failed to delete event:", error);
      }
    }
  };

  const handleInterested = async () => {
    try {
      const response = await axios.post(
        `https://localhost:3000/events/${id}/interested`,
        { username: userProfile.username }
      );
      setInterested(response.data.interested.includes(userProfile.username));
    } catch (error) {
      console.error("Error updating interested:", error);
    }
  };

  const handleGoing = async () => {
    try {
      const response = await axios.post(
        `https://localhost:3000/events/${id}/going`,
        { username: userProfile.username }
      );
      setGoing(response.data.going.includes(userProfile.username));
    } catch (error) {
      console.error("Error updating going:", error);
    }
  };

  const handleBooking = async () => {
    try {
      await axios.post(
        `https://localhost:3000/events/${id}/book`,
        { username: userProfile.username }
      );
      setBooked(true);
    } catch (error) {
      console.error("Failed to book ticket:", error);
    }
  };


  if (!post) {
    return (
      <div className="text-center text-zinc-700 text-xl">Event not found</div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="flex flex-col min-h-screen px-8 py-4 rounded-lg shadow-md">
        {/* <h2 onClick={() => navigate('/')} className="text-4xl text-center text-zinc-50 mb-8 cursor-pointer">
          {editing ? "Edit Event" : "Event Details"}
        </h2> */}

        <div className="grid grid-cols-2 gap-4">
          {editing ? (
            <div
              {...getRootProps()}
              className="border-dashed border-2 border-zinc-600 bg-zinc-300 p-4 rounded-lg cursor-pointer"
            >
              <input name="image" {...getInputProps()} />
              {files.length > 0 ? (
                <div className="flex justify-center items-center">
                  <img
                    src={files[0].preview}
                    alt="preview"
                    className="w-full h-96 rounded-lg"
                  />
                </div>
              ) : (
                <p className="h-full flex justify-center items-center text-zinc-700">
                  {isDragActive
                    ? "Drop the image here ..."
                    : "Drag n drop an image here, or click to select an image"}
                </p>
              )}
            </div>
          ) : (
            <img
              src={`https://localhost:3000/${post.image.slice(7)}`}
              alt={post.title}
              className="w-full object-cover rounded-lg"
            />
          )}
          <div className="flex">
            <div className="grow mr-2">
              <h1 className="text-5xl font-bold text-zinc-700 mb-2 text-pretty hyphens-auto">
                {editing ? (
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full bg-zinc-300 px-4 py-2 mb-2 rounded text-zinc-700"
                  />
                ) : (
                  post.title
                )}
              </h1>
              <p className="flex gap-1 text-lg text-zinc-700 mb-8">
                by{" "}
                <span className="font-bold text-slate-500">
                  {post.organizer}
                </span>
              </p>
              {!editing && (
                <button
                  className={`flex items-center gap-2 ${
                    booked ? "bg-[#58e72d]/50" : "bg-[#e74b2d]/50"
                  } hover:brightness-90 text-zinc-700 font-bold py-2 px-4 rounded mb-8 transition-all`}
                  onClick={() => handleBooking()}
                >
                  <IoTicketSharp className="text-xl" />
                  {booked ? "Booked!" : "Buy A Ticket"}
                </button>
              )}

              <div className="text-lg text-zinc-700">
                {editing ? (
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full bg-zinc-300 px-4 py-2 mb-2 rounded text-zinc-700"
                  />
                ) : (
                  <div className="flex items-center text-lg font-semibold">
                    <FaCalendarDays className="inline mr-2 text-[#e74b2d]/80" />
                    {moment(post.date).format("Do MMM YYYY, HH:mm a")}
                  </div>
                )}
              </div>
              <div className="text-lg text-zinc-700">
                {editing ? (
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full bg-zinc-300 px-4 py-2 mb-2 rounded text-zinc-700"
                  />
                ) : (
                  <div className="flex items-center text-lg font-semibold">
                    <FaLocationDot className="inline mr-2 text-[#e74b2d]/80" />
                    {post.location}
                  </div>
                )}
              </div>
              <div className="text-lg text-zinc-700 mt-8">
                {editing ? (
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full bg-zinc-300 px-4 py-2 mb-2 rounded text-zinc-700"
                  />
                ) : (
                  <div>
                    <p className="font-semibold text-xl text-slate-500 mb-2">
                      Description:
                    </p>
                    <span>{post.description}</span>
                  </div>
                )}
              </div>
              {editing && (
                <button
                  onClick={handleSave}
                  className="mt-4 py-2 px-4 bg-zinc-300 hover:bg-zinc-400 text-zinc-700 font-bold rounded transition-all"
                >
                  Save Changes
                </button>
              )}
            </div>
            {(userProfile?.username === post.organizer || canEdit) && (
              <div className="flex gap-4 justify-center items-start">
                <button
                  onClick={toggleEdit}
                  className=" text-zinc-700 hover:text-yellow-600 rounded p-1 shadow-md transition-all"
                  title="Edit Event"
                >
                  <TbEdit size={32} />
                </button>
                {userProfile?.username ===
                  post.organizer &&(
                    <button
                      onClick={() => setShowModal(true)}
                      className=" text-zinc-700 hover:text-red-600 rounded p-1 shadow-md transition-all"
                      title="Delete Event"
                    >
                      <TbTrash size={32} />
                    </button>
                  )}
              </div>
            )}
          </div>
        </div>
        {!editing && (
          <div className="flex space-x-4 mt-4">
            <button
              className={`flex items-center gap-2 border ${
                !interested
                  ? "border-[#e74b2d]/80 text-[#e74b2d]"
                  : "bg-[#e74b2d]/80 text-zinc-50"
              } hover:bg-[#e74b2d]/10 font-bold py-2 px-4 rounded transition-all`}
              onClick={() => handleInterested()}
            >
              {interested ? (
                <TbStarFilled className="text-xl" />
              ) : (
                <TbStar className="text-xl" />
              )}
              Interested
            </button>
            <button
              className={`flex items-center gap-2 border ${
                !going
                  ? "border-[#e74b2d]/80 text-[#e74b2d]"
                  : "bg-[#e74b2d]/80 text-zinc-50"
              } hover:bg-[#e74b2d]/10 font-bold py-2 px-4 rounded transition-all`}
              onClick={() => handleGoing()}
            >
              {going ? (
                <PiShareFatFill className="text-xl" />
              ) : (
                <PiShareFatBold className="text-xl" />
              )}
              Going
            </button>
          </div>
        )}
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center">
          <div className="bg-zinc-300 p-6 rounded-lg text-center text-zinc-700 shadow-lg">
            <h2 className="text-lg font-bold mb-3">Confirm Delete</h2>
            <p className="mb-6">Are you sure you want to delete this event?</p>
            <div className="flex justify-around">
              <button
                onClick={() => setShowModal(false)}
                className="border-2 border-zinc-200  text-zinc-700 py-2 px-4 rounded hover:brightness-110 shadow-md transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="border-2 border-zinc-200 text-zinc-700 py-2 px-4 rounded hover:border-red-400 hover:brightness-110 shadow-md transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default EventDetails;
