import React, { useState } from 'react';
import { TbArrowBigDownFilled, TbArrowBigUpFilled } from "react-icons/tb";

function Post({ image, title, content, date, venue, onClick }) {
  const [upVotes, setUpVotes] = useState(0);
  const [downVotes, setDownVotes] = useState(0);

  const handleUpVote = () => setUpVotes(upVotes + 1);
  const handleDownVote = () => setDownVotes(downVotes + 1);

  return (
    <div className="bg-[#2a2438] p-4 rounded-lg mb-4 shadow-md">
      <div onClick={onClick}>
        <img src={image} alt={title} className="w-full h-48 object-cover rounded-lg" />
        <h2 className="text-2xl text-zinc-50 font-bold mt-2">{title}</h2>
        <p className="text-zinc-50 mb-2">{content}</p>
      </div>
      <div className="flex items-center w-max border-2 border-[#5c5470] rounded-lg">
        <button
          onClick={handleUpVote}
          className="flex items-center py-1 pl-3 pr-2 hover:bg-[#5c5470]">
          <TbArrowBigUpFilled className="text-xl text-zinc-50" />
          <span className="text-zinc-50 pr-1 ml-2">{upVotes}</span>
        </button>
        <div className="w-px h-6 bg-[#5c5470]"></div>
        <button
          onClick={handleDownVote}
          className="flex items-center py-1 pl-2 pr-3 hover:bg-[#5c5470]">
          <TbArrowBigDownFilled className="text-xl text-zinc-50" />
          {/* <span className="text-zinc-50 ml-2">{downVotes}</span> */}
        </button>
      </div>
    </div>
  );
}

export default Post;
