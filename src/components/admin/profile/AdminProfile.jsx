'use client';
import React, { useContext } from 'react';
import Image from 'next/image';
import AuthContext from '@/context/AuthContext';

function formatDate(dateTimeString) {
  // Create a Date object from the given string
  const date = new Date(dateTimeString);

  // Adjust to CST (Central Standard Time) - UTC-6
  const cstDate = new Date(date.getTime() - 6 * 60 * 60 * 1000);

  // Format the date in the desired format
  const formattedDate = cstDate.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Format the time in the desired format
  const formattedTime = cstDate.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'America/Mexico_City', // Specify the time zone (CST)
  });

  return formattedDate;
}

function formatTime(dateTimeString) {
  // Create a Date object from the given string
  const date = new Date(dateTimeString);

  // Adjust to CST (Central Standard Time) - UTC-6
  const cstDate = new Date(date.getTime() - 6 * 60 * 60 * 1000);

  // Format the time in the desired format
  const formattedTime = cstDate.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'America/Mexico_City', // Specify the time zone (CST)
  });

  return formattedTime;
}
const AdminProfile = () => {
  const { user } = useContext(AuthContext);

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
            <b>Se Unió el: </b>
            {user?.createdAt &&
              `${formatDate(
                user?.createdAt.substring(0, 24)
              )} a las ${formatTime(user?.createdAt.substring(0, 24))} CST`}
          </p>
        </figcaption>
      </figure>

      <hr className="my-4" />
    </>
  );
};

export default AdminProfile;
