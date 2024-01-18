import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { MdDownloadForOffline } from 'react-icons/md';
import { FaTags } from 'react-icons/fa';
import { FiLink } from 'react-icons/fi';
import { v4 as uuidv4 } from 'uuid';

import { client, urlFor } from '../SanityClient';
import { pinDetailQuery, morePinsLikeThisQuery } from '../utils/SanityQueries';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';

export default function PinDetail({ user }) {
  const [pins, setPins] = useState(null);
  const [pinDetail, setPinDetail] = useState(null);
  const [comment, setComment] = useState('');
  const [loading, setloading] = useState(false);
  const { pinId } = useParams(); //PinId is obtained as a Dynamic param, (Home.jsx)

  const fetchPinDetails = () => {
    setloading(true);

    let query = pinDetailQuery(pinId);
    client.fetch(query).then((data) => {
      setloading(false);
      setPinDetail(data[0]);

      //to get more pins like this, maybe with similar category etc
      if (data[0]) {
        query = morePinsLikeThisQuery(data[0]);
        client.fetch(query).then((resp) => setPins(resp));
      }
    });
  };

  useEffect(() => {
    fetchPinDetails();
  }, [pinId]);

  if (loading) return <Spinner message='Hold tight..!' />;

  return (
    pinDetail && (
      <div
        className='flex xl:flex-row gap-5 flex-col m-auto bg-white'
        style={{ maxWidth: '1500px', borderRadius: '32px' }}
      >
        <div className='flex justify-center items-center md:items-start flex-initial'>
          <img
            src={pinDetail?.image && urlFor(pinDetail.image).url()}
            alt='pin detail photo'
            className='rounded-t-3xl rounded-b-lg'
          />
        </div>
        <div className='flex flex-1 flex-col gap-5 p-5'>
          <div>
            <h1 className='text-2xl font-bold break-words'>{pinDetail?.title}</h1>
            <p className='text-sm font-light mt-2'>{pinDetail?.about}</p>
          </div>
          <div className='w-full flex flex xl:min-w-620 justify-between items-center'>
            <a
              href={`${pinDetail?.image?.asset.url}?dl=`}
              download
              onClick={(e) => {
                e.stopPropagation();
              }}
              className='bg-red-600 p-2 rounded-full flex gap-2 items-center justify-center text-white text-xl font-semibold opacity-75 hover:opacity-100 hover:shadow-md outline-none'
            >
              <span>
                <MdDownloadForOffline />
              </span>
              <span className='font-semibold capitalize'>Download</span>
            </a>
            <div className='flex gap-1 items-center justify-center '>
              <a
                href={`/category/${pinDetail.category}`}
                className='bg-red-600 p-2 rounded-full flex gap-2 items-center justify-center text-white text-xl font-semibold opacity-75 hover:opacity-100 hover:shadow-md outline-none'
              >
                <FaTags />
                <span className='capitalize px-2'>{pinDetail.category}</span>
              </a>
            </div>
          </div>
          {pinDetail?.postedBy && (
            <Link
              to={`user-profile/${pinDetail?.postedBy._id}`}
              className='flex items-center mt-2 gap-2 bg-white rounded-lg'
            >
              <img
                src={pinDetail?.postedBy?.image}
                alt='user-profile'
                className='w-10 h-10 rounded-full'
              />
              <p>{pinDetail?.postedBy.userName}</p>
            </Link>
          )}
          {pinDetail?.src && (
            <a
              href={pinDetail.src}
              target='_blank'
              rel='noreferrer'
              className='bg-white flex items-center gap-2 text-black font-thin p-2 rounded-full optacity-70 hover:optacity-100 hover:font-medium hover:outline'
              onClick={(e) => e.stopPropagation()}
            >
              <FiLink />
              {pinDetail.src.length > 30 ? `${pinDetail.src.slice(8, 18)}..` : pinDetail.src.slice(8)}
            </a>
          )}
        </div>
      </div>
    )
  );
}
