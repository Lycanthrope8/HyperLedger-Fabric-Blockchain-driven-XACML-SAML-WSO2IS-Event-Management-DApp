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

function EventDetails() {
  const [interested, setInterested] = useState(false);
  const [going, setGoing] = useState(false);
  const [post, setPost] = useState(null);
  const [editing, setEditing] = useState(false);
  const [files, setFiles] = useState([]);
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

  useEffect(() => {
    const fetchEventDetails = async () => {
      const response = await axios.get(`https://localhost:3000/events/${id}`);
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
      accept: "image/*",
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
        data
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
        await axios.delete(`https://localhost:3000/events/${id}`);
        navigate("/");
      } catch (error) {
        console.error("Failed to delete event:", error);
      }
    }
  };

  const handleInterested = async () => {
    if (interested) {
      setInterested(false);
    } else {
      setInterested(true);
    }
  };

  if (!post) {
    return (
      <div className="text-center text-zinc-50 text-xl">Event not found</div>
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
              className="border-dashed border-2 border-zinc-600 bg-[#3b3a3a] p-4 rounded-lg mb-4 cursor-pointer"
            >
              <input name="image" {...getInputProps()} />
              {files.length > 0 ? (
                <div className="flex justify-center items-center">
                  <img
                    src={files[0].preview}
                    alt="preview"
                    className="w-full h-96"
                  />
                </div>
              ) : (
                <p className="text-zinc-50 text-center">
                  {isDragActive
                    ? "Drop the image here ..."
                    : "Drag 'n' drop an image here, or click to select an image"}
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
            <div className="grow">
              <h1 className="text-5xl font-bold text-zinc-50 mb-2 text-pretty hyphens-auto">
                {editing ? (
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full bg-purple-900/40 px-4 py-2 mb-2 rounded text-zinc-50"
                  />
                ) : (
                  post.title
                )}
              </h1>
              <p className="flex gap-1 text-lg text-zinc-50 mb-8">
                by{" "}
                <span className="font-bold text-slate-400">{post.organizer}</span>
              </p>
              {!editing && (
                <button
                  className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-zinc-50 font-bold py-2 px-4 rounded mb-8 transition-all"
                  onClick={() => alert("Ticket purchased successfully.")}
                >
                  <IoTicketSharp className="text-xl" />
                  Buy a Ticket
                </button>
              )}

              <p className="text-lg text-zinc-50">
                {editing ? (
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full bg-purple-900/40 px-4 py-2 mb-2 rounded text-zinc-50"
                  />
                ) : (
                  <div className="flex items-center text-lg font-semibold">
                    <FaCalendarDays className="inline mr-2 text-purple-500" />
                    {moment(post.date).format("Do MMM YYYY, HH:mm a")}
                  </div>
                )}
              </p>
              <p className="text-lg text-zinc-50">
                {editing ? (
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full bg-purple-900/40 px-4 py-2 mb-2 rounded text-zinc-50"
                  />
                ) : (
                  <div className="flex items-center text-lg font-semibold">
                    <FaLocationDot className="inline mr-2 text-purple-500" />
                    {post.location}
                  </div>
                )}
              </p>
              <p className="text-lg text-zinc-50 mt-8">
                {editing ? (
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full bg-purple-900/40 px-4 py-2 mb-2 rounded text-zinc-50"
                  />
                ) : (
                  <div>
                    <p className="font-semibold text-xl text-purple-500 mb-2">
                      Description:
                    </p>
                    <span>{post.description}</span>
                  </div>
                )}
              </p>
              {editing && (
                <button
                  onClick={handleSave}
                  className="mt-4 py-2 px-4 bg-green-500 hover:bg-green-600 text-zinc-50 font-bold rounded"
                >
                  Save Changes
                </button>
              )}
            </div>
            <div className="flex gap-4 justify-center items-start">
              <button
                onClick={toggleEdit}
                className=" text-yellow-600 hover:text-yellow-700 transition-all"
                title="Edit Event"
              >
                <TbEdit size={32} />
              </button>
              <button
                onClick={handleDelete}
                className=" text-red-600 hover:text-red-700 transition-all"
                title="Delete Event"
              >
                <TbTrash size={32} />
              </button>
            </div>
          </div>
        </div>
        {!editing && (
          <div className="flex space-x-4 mt-4">
            <button
              className="flex items-center gap-2 bg-blue-700 hover:bg-blue-600 text-zinc-50 font-bold py-2 px-4 rounded transition-all"
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
              className="flex items-center gap-2 bg-green-700 hover:bg-green-600 text-zinc-50 font-bold py-2 px-4 rounded transition-all"
              onClick={() => setGoing(!going)}
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
    </>
  );
}

export default EventDetails;
