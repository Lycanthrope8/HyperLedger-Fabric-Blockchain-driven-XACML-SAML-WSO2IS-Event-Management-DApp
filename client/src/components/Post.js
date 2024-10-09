import React from "react";
import { TbArrowBigDownFilled, TbArrowBigUpFilled } from "react-icons/tb";
import { FaCalendarDays, FaLocationDot } from "react-icons/fa6";
import { Link } from "react-router-dom";

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
    <div className="bg-[#eeeeee] rounded-lg mb-4 shadow-md text-zinc-700">
      <div onClick={onClick} className="cursor-pointer">
        <img
          src={image}
          alt={title}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <div className="flex justify-between mt-4 p-2">
          <h2 className="h-full text-2xl font-bold mt-2 align-top">
            {title}
          </h2>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <FaCalendarDays className="text-xl " />
              <p className="">{date}</p>
            </div>
            <div className="flex gap-2">
              <FaLocationDot className="text-xl " />
              <p className="">{venue}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex m-2 items-center justify-between w-max border-2 border-[#e74b2d] rounded-lg">
        <button
          onClick={onUpvote}
          className="flex items-center py-1 pl-3 pr-2 hover:bg-[#e74b2d]/40"
        >
          <TbArrowBigUpFilled className="text-xl " />
          <span className="pr-1 ml-2">{upvotes}</span>
        </button>
        <div className="w-px h-6 bg-zinc-500"></div>
        <button
          onClick={onDownvote}
          className="flex items-center py-1 pl-2 pr-3 hover:bg-[#e74b2d]/40 transition-all"
        >
          <TbArrowBigDownFilled className="text-xl " />
          <span className="pr-1 ml-2">{downvotes}</span>
        </button>
      </div>
    </div>
  );
}

export default Post;
