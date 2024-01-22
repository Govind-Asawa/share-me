import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AiOutlineLogout } from 'react-icons/ai';
import { IoIosLogOut } from 'react-icons/io';
import { IoMdAdd } from 'react-icons/io';
import { GoogleOAuthProvider, googleLogout } from '@react-oauth/google';

import { client } from '../SanityClient';
import {
  userCreatedPinsQuery,
  userSavedPinsQuery,
  getUserQuery,
} from '../utils/SanityQueries';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';

const randomImage =
  'https://source.unsplash.com/1600x900/?nature,landscape,beauty';

const activeBtnStyles =
  'bg-red-500 text-white font-bold p-2 rounded-full w-20 outline-none';
const notActiveBtnStyles =
  'bg-primary mr-4 text-black font-bold p-2 rounded-full w-20 outline-none';

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [pins, setPins] = useState([]);
  const [text, setText] = useState('Created');
  const [activeBtn, setActiveBtn] = useState('created');
  const { userId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const query = getUserQuery(userId);
    client.fetch(query).then((data) => setUser(data[0]));
  }, [userId]);

  useEffect(() => {
    let query = '';
    
    if (text === 'Created') query = userCreatedPinsQuery(userId);
    else query = userSavedPinsQuery(userId);

    client.fetch(query).then((data) => {
      if (data?.length > 0) setPins([...data]);
    });
  }, [text, userId]);

  const logout = () => {
    localStorage.clear();
    googleLogout();
    navigate('/login');
  };

  if (!user) return <Spinner message='Fetching your content..' />;
  return (
    <div className='relative pb-2 h-full justify-center items-center'>
      <div className='flex flex-col pb-5'>
        <div className='relative flex flex-col mb-7'>
          <div className='flex flex-col justify-center items-center'>
            <img
              src={randomImage}
              alt='random-cover'
              className='w-full h-370 2xl:h-510 shadow-lg object-cover'
            />
            <img
              src={user?.image}
              alt='user-photo'
              className='rounded-full w-20 h-20 -mt-10 shadow-xml object-cover'
            />
          </div>
          <h1 className='font-bold text-3xl text-center mt-3'>
            {user?.userName}
          </h1>
          <div className='absolute top-0 z-1 right-0 p-2'>
            {userId === user._id && (
              <GoogleOAuthProvider
                clientId={process.env.REACT_APP_GOOGLE_TOKEN}
              >
                <button
                  type='button'
                  className='bg-white p-1 rounded-full opacity-75 hover:opacity-100 cursor-pointer outline-none'
                  onClick={logout}
                >
                  <AiOutlineLogout color='red' fontSize={21} />
                </button>
              </GoogleOAuthProvider>
            )}
          </div>
        </div>
        {/* CREATED & SAVED Btns */}
        <div className='text-center mb-7'>
          <button
            type='button'
            onClick={(e) => {
              setText('Created');
              setActiveBtn('created');
            }}
            className={
              activeBtn === 'created' ? activeBtnStyles : notActiveBtnStyles
            }
          >
            Created
          </button>
          <button
            type='button'
            onClick={(e) => {
              setText('Saved');
              setActiveBtn('saved');
            }}
            className={
              activeBtn === 'saved' ? activeBtnStyles : notActiveBtnStyles
            }
          >
            Saved
          </button>
        </div>
        {pins?.length ? (
          <div className='px-2'>
            <MasonryLayout pins={pins} />
          </div>
        ) : (
          <div className='flex flex-col gap-3 justify-center items-center w-full mt-2'>
             <Link
              to='/create-pin'
              className='bg-black text-white flex items-center justify-center w-12 md:w-14 h-12 rounded-lg'
            >
              <IoMdAdd />
            </Link>
            <p className='font-bold text-xl'>
              Go ahead and create your first pin!
            </p>
           
          </div>
        )}
      </div>
    </div>
  );
}
