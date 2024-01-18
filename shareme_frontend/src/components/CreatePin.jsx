import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { MdDelete } from 'react-icons/md';

import { client } from '../SanityClient';
import { categories } from '../utils/data';
import Spinner from './Spinner';

const initFieldValues = {
  title: '',
  about: '',
  src: '',
  category: '',
};

export default function CreatePin({ user }) {
  const [fieldValues, setFieldValues] = useState({ ...initFieldValues });
  const [loading, setLoading] = useState(false);
  const [hasEmptyFields, setHasEmptyFields] = useState(false);
  const [imageAsset, setImageAsset] = useState(null);
  const [wrongImageType, setWrongImageType] = useState(null);

  const navigate = useNavigate();

  const uploadImage = (e) => {
    const { type, name } = e.target.files[0];
    if (
      type === 'image/png' ||
      type === 'image/svg' ||
      type === 'image/jpeg' ||
      type === 'image/gif' ||
      type === 'image/tiff'
    ) {
      setWrongImageType(false);
      setLoading(true);

      client.assets
        .upload('image', e.target.files[0], {
          contentType: type,
          filename: name,
        })
        .then((document) => {
          setImageAsset(document);
          setLoading(false);
        })
        .catch((err) => {
          console.log('Image upload err ', err);
        });
    } else {
      setWrongImageType(true);
    }
  };

  const handleFieldChange = (e) => {
    const updatedFieldValues = {
      ...fieldValues,
      [e.target.id]: e.target.value,
    };
    setFieldValues(updatedFieldValues);
  };

  const savePin = () => {
    if(Object.values(fieldValues).filter((field) => !field).length > 0 )
    {
      setHasEmptyFields(true);
      setTimeout(() => setHasEmptyFields(false), 2000);
    }
    else{
      const doc = {
        _type: 'pin',
        ...fieldValues,
        image: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: imageAsset?._id
          }
        },
        userId: user?._id,
        postedBy: {
          _type: 'postedBy',
          _ref: user?._id
        }
      }

      client.create(doc).then(() => navigate('/'))
    }
  };
  const cancelSave = () => {
    navigate('/');
  };

  return (
    <div className='flex flex-col justify-center items-center mt-5 lg:h-4/5'>
      {hasEmptyFields && (
				<p className="text-red-500 mb-5 text-xl transition-all duration-150 ease-in ">
					Please add all fields.
				</p>
			)}
      <div className='flex flex-col lg:flex-row justify-center items-center bg-white p-3 lg:p-5 w-full lg:w-4/5'>
        <div className='bg-secondaryColor p-3 flex flex-0.7 w-full'>
          <div className='flex justify-center items-center flex-col border-2 border-dotted border-gray-300 p-3 w-full h-420'>
            {loading && <Spinner />}
            {wrongImageType && <p>Wrong file type</p>}
            {!imageAsset ? (
              <label className='cursor-pointer hover:text-red-400'>
                <div className='flex flex-col justify-center items-center h-full'>
                  <div className='flex flex-col justify-center items-center'>
                    <p className='font-bold text-2xl'>
                      <AiOutlineCloudUpload />
                    </p>
                    <p className='text-lg'>Click here to upload</p>
                  </div>
                  <p className='mt-32 text-gray-400'>
                    Recommendation: Use high-quality JPG, JPEG, SVG, PNG, GIF or
                    TIFF less than 20MB
                  </p>
                </div>
                <input
                  type='file'
                  name='uploadImage'
                  className='w-0 h-0'
                  onChange={uploadImage}
                />
              </label>
            ) : (
              <div className='relative h-full'>
                <img
                  src={imageAsset?.url}
                  alt='uploaded-image'
                  className='h-full w-full'
                />
                <button
                  type='button'
                  className='absolute bottom-3 right-3 p-2 rounded-full bg-white text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out'
                  onClick={() => setImageAsset(null)}
                >
                  <MdDelete />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* FIELDS */}
        <div className='flex flex-col flex-1 gap-6 lg:pl-5 mt-5'>
          <input
            type='text'
            value={fieldValues.title}
            id='title'
            onChange={(e) => handleFieldChange(e)}
            placeholder='Add your title'
            className='outline-none text-xl sm:text-3xl font-bold border-b-2 border-gray-200 p-2'
          />
          {user && (
            <div
              to={`user-profile/${user._id}`}
              className='flex items-center my-3 mb-3 gap-2'
            >
              <img
                src={user.image}
                alt='user-profile'
                className='w-10 h-10 rounded-full'
              />
              <p>{user.userName}</p>
            </div>
          )}
          <input
            type='text'
            value={fieldValues.about}
            id='about'
            onChange={(e) => handleFieldChange(e)}
            placeholder='what is your pin about ?'
            className='outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2'
          />
          <input
            type='text'
            value={fieldValues.src}
            id='src'
            onChange={(e) => handleFieldChange(e)}
            placeholder='Add a destination link'
            className='outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2'
          />
          <div className='flex flex-col'>
            <div>
              <p className='mb-2 text-lg sm:text-xl font-semibold'>
                Choose pin category
              </p>
              <select
                id='category'
                onChange={handleFieldChange}
                className='outline-none w-4/5 text-base border-b-2 border-gray-200 p-2 rounded-md cursor-pointer'
              >
                <option value='' className='bg-white'>
                  Select category
                </option>
                {categories.map((cat) => (
                  <option
                    value={cat.name}
                    className='text-base border-0 outline-none capitalize bg-white text-black'
                  >
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className='flex justify-end gap-2 items-end mt-5'>
              <button
                type='button'
                onClick={cancelSave}
                className='bg-black text-white rounded-full font-bold p-2 w-28 outline-none'
              >
                Cancel
              </button>
              <button
                type='button'
                onClick={savePin}
                className='bg-red-500 text-white rounded-full font-bold p-2 w-28 outline-none'
              >
                Save Pin
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
