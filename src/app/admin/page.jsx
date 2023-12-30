import Profile from '@/components/user/profile/Profile';
import React from 'react';
import { getServerSession } from 'next-auth/next';
import { options } from '@/app/api/auth/[...nextauth]/options';

const getProducts = async () => {
  const session = await getServerSession(options);
  const URL = `${process.env.NEXTAUTH_URL}/api/products`;
  const res = await fetch(URL, {
    headers: {
      'X-Mysession-Key': JSON.stringify(session),
    },
  });
  const data = await res.json();
  return data.products;
};

const ProfilePage = async () => {
  const products = await getProducts();
  return <Profile />;
};

export default ProfilePage;
