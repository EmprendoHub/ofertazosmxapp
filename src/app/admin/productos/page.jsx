import React from 'react';
import AllProductsComponent from '@/components/products/AllProductsComponent';
import { getCookiesName } from '@/backend/helpers';
import { cookies } from 'next/headers';

const AdminProductsPage = async ({ searchParams }) => {
  const nextCookies = cookies();
  const cookieName = getCookiesName();
  let nextAuthSessionToken = nextCookies.get(cookieName);
  nextAuthSessionToken = nextAuthSessionToken?.value;
  const currentCookies = `${cookieName}=${nextAuthSessionToken}`;
  return (
    <AllProductsComponent
      searchParams={searchParams}
      currentCookies={currentCookies}
    />
  );
};

export default AdminProductsPage;
