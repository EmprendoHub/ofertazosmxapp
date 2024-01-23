import { getCookiesName } from '@/backend/helpers';
import AffiliateProfile from '@/components/afiliados/AffiliateProfile';
import ViewUserOrders from '@/components/orders/ViewUserOrders';
import axios from 'axios';
import { cookies } from 'next/headers';
import React from 'react';

const getAffiliateProfile = async (id) => {
  const nextCookies = cookies();
  const cookieName = getCookiesName();
  const nextAuthSessionToken = nextCookies.get(cookieName);
  const URL = `${process.env.NEXTAUTH_URL}/api/affiliate?${id}`;
  const { data } = await axios.get(
    URL,
    {
      headers: {
        Cookie: `${cookieName}=${nextAuthSessionToken?.value}`,
      },
    },
    { cache: 'no-cache' }
  );
  console.log(data);
  return data;
};

const AffiliateProfilePage = async ({ params }) => {
  const affiliate = await getAffiliateProfile(params.id);

  return <AffiliateProfile affiliate={affiliate} />;
};

export default AffiliateProfilePage;
