import Profile from '@/components/user/profile/Profile';
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
  });
  const data = await res.json();
  return data.addresses;
};

const ProfilePage = async () => {
  const addresses = await getAddresses();
  return <Profile addresses={addresses} />;
};

export default ProfilePage;
