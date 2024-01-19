import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AiOutlineLogout } from 'react-icons/ai';
import { googleLogout } from '@react-oauth/google';

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

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [pins, setPins] = useState([]);
  const [text, setText] = useState('Created');
  const [activeBtn, setActiveBtn] = useState('created');
  const { userId } = useParams();

  useEffect(() => {
    const query = getUserQuery(userId);
    client.fetch(query).then((data) => setUser(data[0]));
  }, [userId]);

  const loadCreatedPins = () => {
    const query = userCreatedPinsQuery(userId);

    client.fetch(query).then((data) => {
      if (data?.length > 0) setPins([...data]);
    });
  };

  const loadSavedPins = () => {
    const query = userSavedPinsQuery(userId);

    client.fetch(query).then((data) => {
      if (data?.length > 0) setPins([...data]);
    });
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
            <img src={user?.image} alt="user-photo" className='rounded-full w-20 h-20 -mt-10 shadow-xml object-cover'/>
          </div>
          <h1 className='font-bold text-3xl text-center mt-3'>{user?.userName}</h1>
        </div>
      </div>
    </div>
  );
}
