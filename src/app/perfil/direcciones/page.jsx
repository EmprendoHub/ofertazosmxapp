import ProfileAddresses from '@/components/user/profile/ProfileAddresses';
import React from 'react';
import { getServerSession } from 'next-auth/next';
import { options } from '@/app/api/auth/[...nextauth]/options';

const getAddresses = async () => {
  const session = await getServerSession(options);
  const URL = `${process.env.NEXTAUTH_URL}/api/addresses`;
  const res = await fetch(URL, {
    headers: {
      'X-Mysession-Key': JSON.stringify(session),
    },
    cache: 'no-cache',
  });
  const data = await res.json();
  return data.addresses;
};

const DireccionesPage = async () => {
  const addresses = await getAddresses();

  return <ProfileAddresses data={addresses} />;
};

export default DireccionesPage;
