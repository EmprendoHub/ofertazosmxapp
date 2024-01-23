import { getCookiesName } from '@/backend/helpers';
import AllAffiliatesAdmin from '@/components/afiliados/AllAffiliatesAdmin';
import { cookies } from 'next/headers';
import React from 'react';

const ClientsPage = async ({ searchParams }) => {
  const nextCookies = cookies();
  const cookieName = getCookiesName();
  let nextAuthSessionToken = nextCookies.get(cookieName);
  nextAuthSessionToken = nextAuthSessionToken?.value;
  const currentCookies = `${cookieName}=${nextAuthSessionToken}`;
  return (
    <AllAffiliatesAdmin
      searchParams={searchParams}
      currentCookies={currentCookies}
    />
  );
};

export default ClientsPage;
