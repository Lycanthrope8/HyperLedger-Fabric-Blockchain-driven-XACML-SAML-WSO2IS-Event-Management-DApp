import React, { useState } from "react";
import { useDropzone } from "react-dropzone";

function PostForm({ onAddPost }) {
  const [text, setText] = useState("");
  const [date, setDate] = useState("");
  const [eventName, setEventName] = useState("");
  const [location, setLocation] = useState("");
  const [files, setFiles] = useState([]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text && date && eventName && location && files.length > 0) {
      const postContent = `Event: ${eventName}\nDate: ${date}\nLocation: ${location}\n\n${text}`;
      onAddPost(postContent);
      setText("");
      setDate("");
      setEventName("");
      setLocation("");
      setFiles([]);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col bg-[#2a2438] p-4 rounded-lg shadow-md"
    >
      <h2 className="text-4xl text-center text-zinc-50 mb-8">Create a Post</h2>

      <div className="grid grid-cols-2 gap-24">
        <div
          {...getRootProps()}
          className="border-dashed border-2 border-zinc-600 bg-[#3b3a3a] p-4 rounded-lg mb-4 cursor-pointer"
        >
          <input {...getInputProps()} />
          {files.length > 0 ? (
            <div className="flex flex-wrap justify-center items-center space-x-2">
              {files.map((file) => (
                <div key={file.name} className="m-1">
                  <img
                    src={file.preview}
                    alt="preview"
                    className="w-full h-96"
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-zinc-50 text-center">
              {isDragActive
                ? "Drop the images here ..."
                : "Drag 'n' drop some images here, or click to select images"}
            </p>
          )}
        </div>
        <div>
          <div className="mb-4">
            <label className="block text-zinc-50 mb-1">Event Name:</label>
            <input
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              className="w-full p-2 rounded border border-zinc-600 bg-[#3b3a3a] text-zinc-50"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-zinc-50 mb-1">Date:</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2 rounded border border-zinc-600 bg-[#3b3a3a] text-zinc-50"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-zinc-50 mb-1">Location:</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-2 rounded border border-zinc-600 bg-[#3b3a3a] text-zinc-50"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-zinc-50 mb-1">Post Content:</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows="4"
              className="w-full p-2 rounded border border-zinc-600 bg-[#3b3a3a] text-zinc-50"
              required
            />
          </div>
        </div>
      </div>
      <button
        type="submit"
        className="w-full text-2xl bg-[#5c5470] p-4 rounded-lg hover:brightness-105 text-zinc-50"
      >
        Post
      </button>
    </form>
  );
}

export default PostForm;
