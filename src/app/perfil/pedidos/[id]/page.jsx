import OneOrder from '@/components/user/profile/OneOrder';
import axios from 'axios';
import React from 'react';
import { cookies } from 'next/headers';
import { getSessionCookiesName } from '@/backend/helpers';

const UserOneOrderPage = async ({ params }) => {
  const nextCookies = cookies();
  const cookieName = getSessionCookiesName();
  let nextAuthSessionToken = nextCookies.get(cookieName);
  nextAuthSessionToken = nextAuthSessionToken?.value;
  const currentCookies = `${cookieName}=${nextAuthSessionToken}`;
  return (
    <div>
      <OneOrder id={params.id} currentCookies={currentCookies} />
    </div>
  );
};

export default UserOneOrderPage;
