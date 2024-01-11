import AdminOneOrder from '@/components/admin/profile/AdminOneOrder';
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

const AdminOneOrderPage = async ({ params }) => {
  const data = await getOneOrder(params.id);
  return (
    <div>
      <AdminOneOrder id={params.id} data={data} />
    </div>
  );
};

export default AdminOneOrderPage;
