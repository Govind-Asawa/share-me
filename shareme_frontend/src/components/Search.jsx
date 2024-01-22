import React, { useState, useEffect } from 'react';

import MasonryLayout from './MasonryLayout';
import { client } from '../SanityClient';
import { feedQuery, searchQuery } from '../utils/SanityQueries';
import Spinner from './Spinner';

export default function Search({ searchTerm }) {
  const [pins, setPins] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let query = '';
    setLoading(true);

    if (searchTerm) {
      query = searchQuery(searchTerm);
    } else {
      query = feedQuery;
    }

    client.fetch(query).then((data) => {
      if (data?.length > 0) setPins(data);
      setLoading(false);
    });
  }, [searchTerm]);

  return (
    <div>
      {loading && <Spinner message='Searching for pins' />}
      {pins?.length !== 0 && <MasonryLayout pins={pins} />}
      {pins?.length === 0 && searchTerm !== '' && !loading && (
        <div className='mt-10 text-center text-xl'>No pins found</div>
      )}
    </div>
  );
}
