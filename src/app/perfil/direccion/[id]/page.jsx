import UpdateAddress from '@/components/user/profile/UpdateAddress';
import React from 'react';
import { getServerSession } from 'next-auth/next';
import { options } from '@/app/api/auth/[...nextauth]/options';

const getAddress = async (id) => {
  const session = await getServerSession(options);
  const URL = `${process.env.NEXTAUTH_URL}/api/address?${id}`;
  const res = await fetch(URL, {
    headers: {
      'X-Mysession-Key': JSON.stringify(session),
    },
  });
  const data = await res.json();
  return data.addresses;
};

const UserAddressPage = async ({ params }) => {
  const address = await getAddress(params.id);
  return <UpdateAddress data={address} />;
};

export default UserAddressPage;
