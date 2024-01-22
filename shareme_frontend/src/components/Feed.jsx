import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { client } from '../SanityClient';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';

import { feedQuery, searchQuery } from '../utils/SanityQueries';

export default function Feed() {
  const [loading, setLoading] = useState(false);
  const [pins, setPins] = useState(undefined);
  const { categoryId } = useParams(); //gets our parameter passed in the url

  useEffect(() => {
    setLoading(true);
    if (categoryId) {
      const query = searchQuery(categoryId);
      client.fetch(query).then((data) => {
        setPins(data);
        setLoading(false);
      });
    } else {
      client.fetch(feedQuery).then((data) => {
        setPins(data);
        setLoading(false);
      });
    }
  }, [categoryId]);

  if (loading)
    return (
        <Spinner message='Hold tight..!' />
    );

  if (pins?.length === 0) {
    return (
      <div className='justify-center text-center'>
        <h1 className='text-center text-3xl text-red-500'>
          Category : <span className='text-black capitalize'> {categoryId}</span>
        </h1>
        <p className='m-5 text-center text-2xl'>No pins found</p>
      </div>
    );
  } else {
    return (
      <div className='justify-center text-center'>
        {categoryId && (
          <h1 className='text-center text-3xl text-red-500'>
            Category : <span className='text-black capitalize'> {categoryId}</span>
          </h1>
        )}
        {pins && <MasonryLayout pins={pins} />}
      </div>
    );
  }
}
