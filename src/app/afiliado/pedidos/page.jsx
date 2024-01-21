import { getSessionCookiesName } from '@/backend/helpers';
import AfiliadoOrders from '@/components/afiliados/AfiliadoOrders';
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
      <AfiliadoOrders
        searchParams={searchParams}
        currentCookies={currentCookies}
      />
    </>
  );
};

export default UserOrdersPage;
