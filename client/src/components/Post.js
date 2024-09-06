import React from "react";
import { TbArrowBigDownFilled, TbArrowBigUpFilled } from "react-icons/tb";
import { FaCalendarDays, FaLocationDot } from "react-icons/fa6";

function Post({
  image,
  title,
  content,
  date,
  venue,
  onClick,
  upvotes,
  downvotes,
  onUpvote,
  onDownvote,
}) {
  return (
    <div className="bg-[#2a2438] p-4 rounded-lg mb-4 shadow-md">
      <div onClick={onClick} style={{ cursor: "pointer" }}>
        <img
          src={image}
          alt={title}
          className="w-full h-48 object-cover rounded-lg"
        />
        <div className="flex justify-between mt-4">
          <h2 className="h-full text-2xl text-zinc-50 font-bold mt-2 align-top">
            {title}
          </h2>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <FaCalendarDays className="text-xl text-zinc-50" />
              <p className="text-zinc-50">{date}</p>
            </div>
            <div className="flex gap-2">
              <FaLocationDot className="text-xl text-zinc-50" />
              <p className="text-zinc-50">{venue}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between w-max border-2 border-[#5c5470] rounded-lg">
        <button
          onClick={onUpvote}
          className="flex items-center py-1 pl-3 pr-2 hover:bg-[#5c5470]"
        >
          <TbArrowBigUpFilled className="text-xl text-zinc-50" />
          <span className="text-zinc-50 pr-1 ml-2">{upvotes}</span>
        </button>
        <div className="w-px h-6 bg-[#5c5470]"></div>
        <button
          onClick={onDownvote}
          className="flex items-center py-1 pl-2 pr-3 hover:bg-[#5c5470]"
        >
          <TbArrowBigDownFilled className="text-xl text-zinc-50" />
          <span className="text-zinc-50 pr-1 ml-2">{downvotes}</span>
        </button>
      </div>
    </div>
  );
}

export default Post;
