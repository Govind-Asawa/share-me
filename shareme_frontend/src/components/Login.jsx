import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

import { client } from '../SanityClient';

import shareVideo from '../assets/share.mp4';
import logo from '../assets/logowhite.png';

export default function Login() {
  const navigate = useNavigate();

  const responseGoogle = (response) => {
    const details = jwtDecode(response.credential); //we receive encoded response
    localStorage.setItem('user', JSON.stringify(details));

    const { name, sub, picture } = details;
    const doc = {
      _id: sub, //unique per user
      _type: 'user', //used by sanity to identify the doc that needs to be created
      userName: name,
      image: picture,
    };

    client.createIfNotExists(doc).then(navigate('/', { replace: true }));
  };

  return (
    <div className='flex justify-start items-center flex-col h-screen'>
      <div className='relative w-full h-full'>
        <video
          src={shareVideo}
          type='video/mp4'
          loop
          controls={false}
          muted
          autoPlay
          className='w-full h-full object-cover'
        />
        <div className='flex flex-col justify-center items-center h-screen absolute top-0 bottom-0 right-0 left-0 bg-blackOverlay'>
          <div className='p-5'>
            <img src={logo} width='130px' alt='Shareme logo' />
          </div>
          <div className='shadow-2xl'>
            <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_TOKEN}>
              <GoogleLogin
                onSuccess={responseGoogle}
                onError={() => {
                  console.log('Login Failed');
                }}
              />
              ;
            </GoogleOAuthProvider>
          </div>
        </div>
      </div>
    </div>
  );
}
