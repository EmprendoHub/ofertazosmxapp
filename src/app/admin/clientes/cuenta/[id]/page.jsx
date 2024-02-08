import { getSessionCookiesName } from '@/backend/helpers';
import ViewUserOrders from '@/components/orders/ViewUserOrders';
import { cookies } from 'next/headers';
import React from 'react';

const ClientDetailsPage = async ({ searchParams, params }) => {
  const nextCookies = cookies();
  const cookieName = getSessionCookiesName();
  let nextAuthSessionToken = nextCookies.get(cookieName);
  nextAuthSessionToken = nextAuthSessionToken?.value;
  const currentCookies = `${cookieName}=${nextAuthSessionToken}`;

  return (
    <>
      <ViewUserOrders
        searchParams={searchParams}
        currentCookies={currentCookies}
        params={params}
      />
    </>
  );
};

export default ClientDetailsPage;
