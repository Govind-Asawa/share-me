import React, { useState, useRef, useEffect } from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import { HiMenu } from 'react-icons/hi';
import { AiFillCloseCircle } from 'react-icons/ai';

import { Sidebar, UserProfile } from '../components';
import { client } from '../SanityClient';
import { getUserQuery } from '../utils/SanityQueries';
import logo from '../assets/logo.png';

export default function Home() {
  const [user, setUser] = useState(undefined);
  const [toggleSidebar, setToggleSidebar] = useState(false);

  const userInfo =
    localStorage.getItem('user') !== undefined
      ? JSON.parse(localStorage.getItem('user'))
      : localStorage.clear();

  useEffect(() => {
    client.fetch(getUserQuery(userInfo.sub)).then((data) => setUser(data[0]));
  }, []);

  return (
    <div className='flex bg-gray-50 md:flex-row flex-col h-screen transition-height duration-75 ease-out'>
      <div className='hidden md:flex h-screen flex-initial'>
        <Sidebar />
      </div>
      <div className='flex md:hidden flex-row justify-between items-center p-2'>
        <HiMenu
          fontSize={40}
          className='cursor-pointer'
          onClick={() => setToggleSidebar(true)}
        />
        <Link to='/'>
          <img src={logo} alt='logo' className='w-28' />
        </Link>
        <Link to={`user-profile/${user?._id}`}>
          <img
            src={user?.image}
            alt='profile photo'
            className='w-12 rounded-lg'
          />
        </Link>
      </div>
      {toggleSidebar && (
        <div className='fixed w-4/5 bg-white h-screen overflow-y-auto z-10 animate-slide-in'>
          <div className='absolute w-full flex justify-end items-center p-2'>
            <AiFillCloseCircle
              fontSize={30}
              className='cursor-pointer'
              onClick={() => setToggleSidebar(false)}
            />
          </div>
          <Sidebar />
        </div>
      )}
    </div>
  );
}
