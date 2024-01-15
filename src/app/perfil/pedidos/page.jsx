import { getSessionCookiesName } from '@/backend/helpers';
import UserOrders from '@/components/user/profile/UserOrders';
import { cookies } from 'next/headers';
import React from 'react';

const UserOrdersPage = async ({ searchParams }) => {
  const nextCookies = cookies();
  const cookieName = getSessionCookiesName();
  let nextAuthSessionToken = nextCookies.get(cookieName);
  nextAuthSessionToken = nextAuthSessionToken?.value;
  const currentCookies = `${cookieName}=${nextAuthSessionToken}`;
  return (
    <UserOrders searchParams={searchParams} currentCookies={currentCookies} />
  );
};

export default UserOrdersPage;
