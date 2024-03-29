import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { RiHomeFill } from 'react-icons/ri';
import { IoIosArrowForward } from 'react-icons/io';

import {categories} from '../utils/data'
import logo from '../assets/logo.png';

const isNotActiveStyle =
  'flex items-center px-5 gap-3 text-gray-500 hover:text-black transition-all duration-100 ease-in-out capitalize';
const isActiveStyle =
  'flex items-center px-5 gap-3 font-extrabold border-r-2 border-black transition-all duration-100 ease-in-out capitalize';

export default function Sidebar({ user, setToggleSidebar }) {
  const handleLogoClick = () => {
    if (setToggleSidebar) setToggleSidebar(false);
  };
  return (
    <div className='flex flex-col justify-between h-full bg-white overflow-y-scroll min-w-210 hide-scrollbar'>
      <div className='flex flex-col'>
        <Link
          to='/'
          className='flex px-5 gap-2 my-6 pt-1 w-190 items-center'
          onClick={handleLogoClick}
        >
          <img src={logo} alt='Logo' className='w-full' />
        </Link>
        <div className='flex flex-col gap-5'>
          <NavLink
            to='/'
            className={({ isActive }) =>
              isActive ? isActiveStyle : isNotActiveStyle
            }
            onClick={handleLogoClick}
          >
            <RiHomeFill />
            Home
          </NavLink>
          <h3 className='mt-2 mx-5 text-base 2xl:text-xl'>
            Discover Categories
          </h3>
          {categories.map((item) => {
            return (
            <NavLink
              to={`/category/${item.name}`}
              className={({ isActive }) =>
                isActive ? isActiveStyle : isNotActiveStyle
            }
            onClick={handleLogoClick}
            key={item.name}
            >
              <img src={item.image} alt="category image" className='w-8 h-8 rounded-full shadow-sm'/>
              {item.name}
            </NavLink>);
          })}
        </div>
      </div>
      {user && (
        <Link 
          to={`user-profile/${user._id}`}
          className='flex items-center my-5 mb-3 mx-3 p-2 gap-2 bg-white shadow-lg'
          onClick={handleLogoClick}
        >
          <img src={user.image} alt="user-profile" className='w-10 h-10 rounded-full'/>
          <p>{user.userName}</p>
        </Link>
      )}
    </div>
  );
}
