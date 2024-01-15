import React from 'react';
import { getCookiesName } from '@/backend/helpers';
import { cookies } from 'next/headers';
import AllAdminProductsComponent from '@/components/products/AllAdminProductsComponent';

const AdminProductsPage = async ({ searchParams }) => {
  const nextCookies = cookies();
  const cookieName = getCookiesName();
  let nextAuthSessionToken = nextCookies.get(cookieName);
  nextAuthSessionToken = nextAuthSessionToken?.value;
  const currentCookies = `${cookieName}=${nextAuthSessionToken}`;
  return (
    <AllAdminProductsComponent
      searchParams={searchParams}
      currentCookies={currentCookies}
    />
  );
};

export default AdminProductsPage;
