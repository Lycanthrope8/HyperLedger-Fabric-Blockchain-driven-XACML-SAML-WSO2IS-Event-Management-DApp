// NotAuthorized.js
import React from 'react';
import { IoWarning } from "react-icons/io5";


const NotAuthorized = () => {
  return (
    <div className='w-full min-h-screen flex flex-col justify-center items-center'>
      <IoWarning className='text-zinc-700 text-6xl' />
      <h1 className='text-xl text-zinc-700 font-bold'>You are not authorized to see this page.</h1>
    </div>
  );
}

export default NotAuthorized;
