import AdminOneOrder from '@/components/admin/profile/AdminOneOrder';
import axios from 'axios';
import React from 'react';
import { cookies } from 'next/headers';
import { getSessionCookiesName } from '@/backend/helpers';

const AdminOneOrderPage = async ({ params }) => {
  const nextCookies = cookies();
  const cookieName = getSessionCookiesName();
  let nextAuthSessionToken = nextCookies.get(cookieName);
  nextAuthSessionToken = nextAuthSessionToken?.value;
  const currentCookies = `${cookieName}=${nextAuthSessionToken}`;
  return (
    <div>
      <AdminOneOrder id={params.id} currentCookies={currentCookies} />
    </div>
  );
};

export default AdminOneOrderPage;
