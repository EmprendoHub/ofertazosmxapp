import { getSessionCookiesName } from '@/backend/helpers';
import AdminOrders from '@/components/admin/profile/AdminOrders';
import { cookies } from 'next/headers';
import React from 'react';

const UserOrdersPage = async ({ searchParams }) => {
  const nextCookies = cookies();
  const cookieName = getSessionCookiesName();
  let nextAuthSessionToken = nextCookies.get(cookieName);
  nextAuthSessionToken = nextAuthSessionToken?.value;
  const currentCookies = `${cookieName}=${nextAuthSessionToken}`;
  return (
    <>
      <AdminOrders
        searchParams={searchParams}
        currentCookies={currentCookies}
      />
    </>
  );
};

export default UserOrdersPage;
