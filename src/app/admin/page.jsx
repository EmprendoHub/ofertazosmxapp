import React from 'react';
import Profile from '@/components/user/profile/Profile';
import DashComponent from '@/components/admin/dashboard/DashComponent';
import { getServerSession } from 'next-auth';
import { options } from '../api/auth/[...nextauth]/options';

async function getAllFromDashboard(session) {
  try {
    const stringSession = JSON.stringify(session);

    const URL = `${process.env.NEXTAUTH_URL}/api/dashboard`;
    const res = await fetch(URL, {
      headers: {
        Session: stringSession,
        'Content-Type': 'application/json; charset=utf-8',
      },
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error.message);
  }
}

const ProfilePage = async () => {
  const session = await getServerSession(options);
  const data = await getAllFromDashboard(session);
  const clients = data?.clients;
  const products = data?.products;
  const affiliates = data?.affiliates;
  const orders = data?.orders;
  const posts = data?.posts;
  return (
    <>
      <Profile />
      <DashComponent
        clients={clients}
        affiliates={affiliates}
        orders={orders}
        products={products}
        posts={posts}
      />
    </>
  );
};

export default ProfilePage;
