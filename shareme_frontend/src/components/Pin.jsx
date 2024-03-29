import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { MdDownloadForOffline } from 'react-icons/md';
import { AiTwotoneDelete } from 'react-icons/ai';
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs';

import { client, urlFor } from '../SanityClient';
import { fetchUser } from '../utils/fetchUser';

export default function Pin({ pin }) {
  const [postHovered, setPostHovered] = useState(false);
  const navigate = useNavigate();

  const { postedBy, image, _id, title, src, save } = pin;
  const userInfo = fetchUser();

  const alreadySaved = !!save?.filter(
    (saveItem) => saveItem.postedBy._id == userInfo?.sub
  )?.length;

  const savePin = (pinId) => {
    if (alreadySaved) return;

    client
      .patch(pinId)
      .setIfMissing({ save: [] })
      .insert('after', 'save[-1]', [
        {
          _key: uuidv4(), //unique key
          userId: userInfo?.sub,
          postedBy: {
            _type: 'postedBy',
            _ref: userInfo?.sub,
          },
        },
      ])
      .commit()
      .then(() => {
        window.location.reload();
      });
  };

  const deletePin = (pinId) => {
    client.delete(pinId).then(() => window.location.reload());
  };

  return (
    <div className='m-2'>
      <div
        onMouseEnter={() => setPostHovered(true)}
        onMouseLeave={() => setPostHovered(false)}
        onClick={() => navigate(`/pin-detail/${_id}`)}
        className='relative cursor-pointer w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out'
      >
        <img
          src={urlFor(image).width(250).url()}
          alt='user-post'
          className='rounded-lg w-full'
        />
        {postHovered && (
          <div
            className='absolute top-0 bg-blackOverlay w-full h-full flex flex-col justify-between p-1 pr-2 py-2 z-50'
            style={{ height: '100%' }}
          >
            {/* DOWNLOAD & SAVE */}
            <div className='flex items-center justify-between'>
              {/* DOWNLOAD btn*/}
              <div className='flex gap-2'>
                <a
                  href={`${image?.asset?.url}?dl=`}
                  download
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className='bg-white w-9 h-9 p-2 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none'
                >
                  <MdDownloadForOffline />
                </a>
              </div>
              {/* SAVE btn */}
              {alreadySaved ? (
                <button
                  type='button'
                  className='bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md'
                >
                  {save && save.length} Saved
                </button>
              ) : (
                <button
                  type='button'
                  className='bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md'
                  onClick={(e) => {
                    e.stopPropagation();
                    savePin(_id);
                  }}
                >
                  Save
                </button>
              )}
            </div>

            {/* LINK */}
            <div className='flex justify-between items-center gap-2 w-full'>
              {src && (
                <a
                  href={src}
                  target='_blank'
                  rel='noreferrer'
                  className='bg-white flex items-center gap-2 text-black font-bold p-2 px-4 rounded-full optacity-70 hover:optacity-100 hover:shadow-md'
                  onClick={(e) => e.stopPropagation()}
                >
                  <BsFillArrowUpRightCircleFill />
                  {src.length > 20 ? `${src.slice(8, 18)}..` : src.slice(8)}
                </a>
              )}
              {/* Conditional DELETE button if current user posted this pin*/}
              {postedBy?._id === userInfo?.sub && (
                <button
                  type='button'
                  className='bg-white p-2 opacity-70 hover:opacity-100 font-bold text-dark text-base rounded-3xl hover:shadow-md'
                  onClick={(e) => {
                    e.stopPropagation();
                    deletePin(_id);
                  }}
                >
                  <AiTwotoneDelete />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      <div className='flex flex-col justify-center items-center mt-2'>
        <span className='h1 text-gray-400 text-center font-semibold'>{title}</span>
        <Link
          to={`/user-profile/${postedBy?._id}`}
          className='flex gap-2 mt-2 items-center'
        >
          <img
            src={postedBy?.image}
            alt='user-profile'
            className='w-8 h-8 rounded-full object-cover'
          />
          <p className='text-sm font-thin capitalize'>{postedBy?.userName}</p>
        </Link>
      </div>
    </div>
  );
}
