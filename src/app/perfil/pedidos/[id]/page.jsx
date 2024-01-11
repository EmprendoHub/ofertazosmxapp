import OneOrder from '@/components/user/profile/OneOrder';
import axios from 'axios';
import React from 'react';
import { cookies } from 'next/headers';
import { getCookiesName } from '@/backend/helpers';

const getOneOrder = async (id) => {
  try {
    const nextCookies = cookies();
    const cookieName = getCookiesName();
    const nextAuthSessionToken = nextCookies.get(cookieName);
    const URL = `${process.env.NEXTAUTH_URL}/api/order?${id}`;

    const { data } = await axios.get(URL, {
      headers: {
        Cookie: `${cookieName}=${nextAuthSessionToken?.value}`,
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
