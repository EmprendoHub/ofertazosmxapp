import OneOrder from '@/components/user/profile/OneOrder';
import axios from 'axios';
import React from 'react';
import { cookies } from 'next/headers';

const getOneOrder = async (id) => {
  try {
    const nextCookies = cookies();
    const nextAuthSessionToken = nextCookies.get('next-auth.session-token');
    const URL = `${process.env.NEXTAUTH_URL}/api/order?${id}`;

    const { data } = await axios.get(URL, {
      headers: {
        Cookie: `next-auth.session-token=${nextAuthSessionToken?.value}`,
      },
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};

const UserOneOrderPage = async ({ params }) => {
  const data = await getOneOrder(params.id);
  return (
    <div>
      <OneOrder id={params.id} data={data} />
    </div>
  );
};

export default UserOneOrderPage;
