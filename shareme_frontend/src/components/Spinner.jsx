import React from 'react';
import { Triangle } from 'react-loader-spinner';

export default function Spinner({ message }) {
  return (
    <div className='flex flex-col justify-center items-center w-full h-full'>
      <Triangle
        visible={true}
        height='80'
        width='80'
        color='#f87171'
        ariaLabel='triangle-loading'
        wrapperStyle={{}}
        wrapperClass='m-5'
      />
      <p className='text-lg text-center px-2'> {message}</p>
    </div>
  );
}
