'use client';
import React, { useContext } from 'react';
import Image from 'next/image';
import AuthContext from '@/context/AuthContext';

const Profile = () => {
  const { user } = useContext(AuthContext);
  console.log(user);
  return (
    <>
      <figure className="flex items-start sm:items-center text-black">
        <div className="relative">
          <Image
            className="w-16 h-16 rounded-full mr-4"
            src={user?.image ? user?.image : '/next.svg'}
            alt={user?.name ? user?.name : 'avatar'}
            width={50}
            height={50}
          />
        </div>
        <figcaption>
          <h5 className="font-semibold text-lg">
            {user?.name}
            <span className="text-red-400 text-sm pl-2">( {user?.role} )</span>
          </h5>
          <p>
            <b>Email:</b> {user?.email}
          </p>
          <p>
            <b>Se unió el: </b>
            {user?.createdAt && `${Date(user?.createdAt).substring(0, 24)} CST`}
          </p>
        </figcaption>
      </figure>

      <hr className="my-4" />
    </>
  );
};

export default Profile;
