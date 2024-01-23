import { options } from '@/app/api/auth/[...nextauth]/options';
import { getSessionCookiesName } from '@/backend/helpers';
import AdminOrders from '@/components/admin/profile/AdminOrders';
import AdminPagination from '@/components/pagination/AdminPagination';
import axios from 'axios';
import { getServerSession } from 'next-auth';
import { cookies } from 'next/headers';
import React from 'react';

async function getAllOrders(searchParams, currentCookies, session) {
  try {
    const urlParams = {
      keyword: searchParams.keyword,
      page: searchParams.page,
    };
    const stringSession = JSON.stringify(session);
    // Filter out undefined values
    const filteredUrlParams = Object.fromEntries(
      Object.entries(urlParams).filter(([key, value]) => value !== undefined)
    );
    const searchQuery = new URLSearchParams(filteredUrlParams).toString();
    const URL = `${process.env.NEXTAUTH_URL}/api/orders?${searchQuery}`;
    const { data } = await axios.get(
      URL,
      {
        headers: {
          Cookie: currentCookies,
          Session: stringSession,
          'Content-Type': 'application/json; charset=utf-8',
        },
      },
      { cache: 'no-cache' }
    );
    console.log(data);
    return data;
  } catch (error) {
    console.log(error.message);
  }
}

const UserOrdersPage = async ({ searchParams }) => {
  const session = await getServerSession(options);
  const nextCookies = cookies();
  const cookieName = getSessionCookiesName();
  let nextAuthSessionToken = nextCookies.get(cookieName);
  nextAuthSessionToken = nextAuthSessionToken?.value;
  const currentCookies = `${cookieName}=${nextAuthSessionToken}`;
  //
  const ordersData = await getAllOrders(searchParams, currentCookies, session);
  const filteredOrdersCount = ordersData?.filteredOrdersCount;
  const orders = ordersData?.orders.orders;
  const page = searchParams['page'] ?? '1';
  const per_page = 5;
  const start = (Number(page) - 1) * Number(per_page); // 0, 5, 10 ...
  const end = start + Number(per_page); // 5, 10, 15 ...

  return (
    <>
      <AdminOrders orders={orders} filteredOrdersCount={filteredOrdersCount} />
      <AdminPagination
        hasNextPage={end < filteredOrdersCount}
        hasPrevPage={start > 0}
        totalItemCount={filteredOrdersCount}
        perPage={per_page}
      />
    </>
  );
};

export default UserOrdersPage;
