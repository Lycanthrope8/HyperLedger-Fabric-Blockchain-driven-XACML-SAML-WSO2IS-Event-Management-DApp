import React, { useState } from 'react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

function Post({ content }) {
  const [upVotes, setUpVotes] = useState(0);
  const [downVotes, setDownVotes] = useState(0);

  const handleUpVote = () => setUpVotes(upVotes + 1);
  const handleDownVote = () => setDownVotes(downVotes + 1);

  return (
    <div className="bg-[#2a2438] p-4 rounded-lg mb-4 shadow-md">
      <p className="text-zinc-50 mb-2">{content}</p>
      <div className="flex items-center justify-between">
        <button 
          onClick={handleUpVote} 
          className="flex items-center bg-[#5c5470] py-1 px-3 rounded-full hover:brightness-105">
          <FaArrowUp className="text-zinc-50" />
          <span className="text-zinc-50 ml-2">{upVotes}</span>
        </button>
        <button 
          onClick={handleDownVote} 
          className="flex items-center bg-[#5c5470] py-1 px-3 rounded-full hover:brightness-105">
          <FaArrowDown className="text-zinc-50" />
          <span className="text-zinc-50 ml-2">{downVotes}</span>
        </button>
      </div>
    </div>
  );
}

export default Post;
