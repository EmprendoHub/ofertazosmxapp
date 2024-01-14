import { getCookiesName } from '@/backend/helpers';
import Orders from '@/components/admin/profile/Orders';
import AdminPagination from '@/components/pagination/AdminPagination';
import { cookies } from 'next/headers';
import React from 'react';

const getAllOrders = async (searchParams) => {
  const urlParams = {
    keyword: searchParams.keyword,
    page: searchParams.page,
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
  const orderCount = data?.orderCount;
  const filteredOrdersCount = data?.filteredOrdersCount;
  const page = searchParams['page'] ?? '1';
  const per_page = 5;
  const start = (Number(page) - 1) * Number(per_page); // 0, 5, 10 ...
  const end = start + Number(per_page); // 5, 10, 15 ...

  return (
    <>
      <Orders data={data} filteredOrdersCount={filteredOrdersCount} />
      <AdminPagination
        hasNextPage={end < filteredOrdersCount}
        hasPrevPage={start > 0}
        totalItemCount={filteredOrdersCount}
      />
    </>
  );
};

export default UserOrdersPage;
