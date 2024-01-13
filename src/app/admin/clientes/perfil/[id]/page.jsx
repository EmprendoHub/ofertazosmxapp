import { getCookiesName } from '@/backend/helpers';
import ViewUserOrders from '@/components/orders/ViewUserOrders';
import axios from 'axios';
import { cookies } from 'next/headers';
import React from 'react';

const getUserOrders = async (id) => {
  const nextCookies = cookies();
  const cookieName = getCookiesName();
  const nextAuthSessionToken = nextCookies.get(cookieName);
  const URL = `${process.env.NEXTAUTH_URL}/api/orders/user?${id}`;
  const { data } = await axios.get(
    URL,
    {
      headers: {
        Cookie: `${cookieName}=${nextAuthSessionToken?.value}`,
      },
    },
    { cache: 'no-cache' }
  );
  return data.orders;
};

const ProductDetailsPage = async ({ params }) => {
  const orders = await getUserOrders(params.id);

  return <ViewUserOrders orders={orders} />;
};

export default ProductDetailsPage;
