import React, { useState } from 'react';

function PostForm({ onAddPost }) {
  const [text, setText] = useState('');
  const [date, setDate] = useState('');
  const [eventName, setEventName] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text && date && eventName && location) {
      const postContent = `Event: ${eventName}\nDate: ${date}\nLocation: ${location}\n\n${text}`;
      onAddPost(postContent);
      setText('');
      setDate('');
      setEventName('');
      setLocation('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#2a2438] p-4 rounded-lg shadow-md">
      <h2 className="text-xl text-zinc-50 mb-4">Create a Post</h2>
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
      <button
        type="submit"
        className="w-full bg-[#5c5470] py-2 px-4 rounded-full hover:brightness-105 text-zinc-50"
      >
        Post
      </button>
    </form>
  );
}

export default PostForm;
