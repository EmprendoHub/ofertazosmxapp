import { getCookiesName } from '@/backend/helpers';
import Orders from '@/components/admin/profile/Orders';
import { cookies } from 'next/headers';
import React from 'react';

const getAllOrders = async (searchParams) => {
  const urlParams = {
    keyword: searchParams.keyword,
  };
  // Filter out undefined values
  const filteredUrlParams = Object.fromEntries(
    Object.entries(urlParams).filter(([key, value]) => value !== undefined)
  );
  const nextCookies = cookies();
  const cookieName = getCookiesName();
  const nextAuthSessionToken = nextCookies.get(cookieName);
  const searchQuery = new URLSearchParams(filteredUrlParams).toString();
  const URL = `${process.env.NEXTAUTH_URL}/api/orders?${searchQuery}`;
  try {
    const res = await fetch(
      URL,
      {
        headers: {
          Cookie: `${cookieName}=${nextAuthSessionToken?.value}`,
        },
      },
      { cache: 'no-cache' }
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

const UserOrdersPage = async ({ searchParams }) => {
  const data = await getAllOrders(searchParams);
  return <Orders orders={data?.orders} />;
};

export default UserOrdersPage;
