import { getCookiesName } from '@/backend/helpers';
import ViewUserOrders from '@/components/orders/ViewUserOrders';
import AdminPagination from '@/components/pagination/AdminPagination';
import axios from 'axios';
import { cookies } from 'next/headers';
import React from 'react';

const getUserOrders = async (searchParams, params) => {
  const urlParams = {
    keyword: searchParams.keyword,
    page: searchParams.page,
    id: params.id,
  };
  // Filter out undefined values
  const filteredUrlParams = Object.fromEntries(
    Object.entries(urlParams).filter(([key, value]) => value !== undefined)
  );
  const nextCookies = cookies();
  const cookieName = getCookiesName();
  const nextAuthSessionToken = nextCookies.get(cookieName);
  const searchQuery = new URLSearchParams(filteredUrlParams).toString();
  const URL = `${process.env.NEXTAUTH_URL}/api/orders/user?${searchQuery}`;
  const { data } = await axios.get(
    URL,
    {
      headers: {
        Cookie: `${cookieName}=${nextAuthSessionToken?.value}`,
      },
    },
    { cache: 'no-cache' }
  );
  return data;
};

const ProductDetailsPage = async ({ searchParams, params }) => {
  const data = await getUserOrders(searchParams, params);
  const orderCount = data?.orderCount;
  const filteredOrdersCount = data?.filteredOrdersCount;
  const page = searchParams['page'] ?? '1';
  const per_page = 5;
  const start = (Number(page) - 1) * Number(per_page); // 0, 5, 10 ...
  const end = start + Number(per_page); // 5, 10, 15 ...
  const orders = data?.orders.orders;

  return (
    <>
      <ViewUserOrders orders={orders} />
      <AdminPagination
        hasNextPage={end < filteredOrdersCount}
        hasPrevPage={start > 0}
        totalItemCount={filteredOrdersCount}
      />
    </>
  );
};

export default ProductDetailsPage;
