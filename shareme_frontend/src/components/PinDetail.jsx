import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { MdDownloadForOffline } from 'react-icons/md';
import { FaTags } from 'react-icons/fa';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { FiLink } from 'react-icons/fi';
import { v4 as uuidv4 } from 'uuid';

import { client, urlFor } from '../SanityClient';
import { pinDetailQuery, morePinsLikeThisQuery } from '../utils/SanityQueries';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';

export default function PinDetail({ user }) {
  const [pins, setPins] = useState([]);
  const [pinDetail, setPinDetail] = useState(null);
  const [comment, setComment] = useState('');
  const [addingComment, setAddingComment] = useState(false);
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

  const handleAddComment = (e) => {
    setAddingComment(true);
    client
      .patch(pinId)
      .setIfMissing({ comments: [] })
      .insert('after', 'comments[-1]', [
        {
          comment,
          _key: uuidv4(),
          postedBy: {
            _type: 'postedBy',
            _ref: user._id,
          },
        },
      ])
      .commit()
      .then(() => {
        fetchPinDetails();
        setComment('');
        setAddingComment(false);
      });
  };

  if (loading) return <Spinner message='Hold tight..!' />;

  return (
    <>
      {pinDetail && (
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
              <h1 className='text-2xl font-bold break-words'>
                {pinDetail?.title}
              </h1>
              <p className='text-sm font-light mt-2'>{pinDetail?.about}</p>
            </div>
            {/* DOWNLOAD & TAG links */}
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
            {/* Posted By USER */}
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
            {/* Link Associated with post */}
            {pinDetail?.src && (
              <a
                href={pinDetail.src}
                target='_blank'
                rel='noreferrer'
                className='bg-white flex items-center gap-2 text-black font-thin p-2 rounded-full optacity-70 hover:optacity-100 hover:font-medium hover:outline'
                onClick={(e) => e.stopPropagation()}
              >
                <FaExternalLinkAlt />
                {pinDetail.src.length > 30
                  ? `${pinDetail.src.slice(18)}..`
                  : pinDetail.src}
              </a>
            )}
            <h2 className='text-xl font-bold'>Comments</h2>
            <div className='max-h-370 overflow-y-auto'>
              {pinDetail.comments?.map((comment, i) => {
                return (
                  <div
                    className='flex items-center mt-5 gap-2 bg-white rounded-lg'
                    key={i}
                  >
                    <img
                      src={comment.postedBy?.image}
                      alt='commentor-profile'
                      className='w-10 h-10 rounded-full'
                    />
                    <div className='flex flex-col justify-between'>
                      <p className='font-semibold capitalize'>
                        {comment.postedBy.userName}
                      </p>
                      <p className='font-medium'>{comment.comment}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className='flex flex-wrap gap-2 justify-between items-center rounded-lg bg-white'>
              <Link to={`user-profile/${user?._id}`}>
                <img
                  src={user?.image}
                  alt='user-profile'
                  className='w-10 h-10 rounded-full'
                />
              </Link>
              <input
                type='text'
                placeholder='Add a comment'
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className='flex-1 rounded-xl outline-none border-2 p-2 border-gray-200 focus:border-gray-400'
              />
              <button
                type='button'
                className='bg-red-600 p-2 px-4 rounded-full text-white text-xl font-semibold opacity-75 hover:opacity-100 hover:shadow-md outline-none'
                onClick={handleAddComment}
              >
                {addingComment ? 'Posting..' : 'Post!'}
              </button>
            </div>
          </div>
        </div>
      )}
      {pins.length > 0 && (
        <>
          <h2 className='flex text-center justify-center items-center gap-2 font-bold text-2xl mt-8 mb-4'>
            <span>More from category :</span>
            <Link
              to={`/category/${pinDetail?.category}`}
              className='flex gap-2 items-center justify-between rounded-lg'
            >
              <span className='capitalize text-red-600'>
                {pinDetail?.category}
              </span>
              <FiLink />
            </Link>
          </h2>
          <MasonryLayout pins={pins} />
        </>
      )}
    </>
  );
}
