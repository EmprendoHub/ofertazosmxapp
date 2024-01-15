import { getSessionCookiesName } from '@/backend/helpers';
import Orders from '@/components/admin/profile/Orders';
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
      <Orders searchParams={searchParams} currentCookies={currentCookies} />
    </>
  );
};

export default UserOrdersPage;
