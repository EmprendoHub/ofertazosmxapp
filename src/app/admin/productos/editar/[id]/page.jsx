import React from 'react';
import UpdateProductDetails from '@/components/products/UpdateProductDetails';
import { getServerSession } from 'next-auth';
import { options } from '@/app/api/auth/[...nextauth]/options';
import { getSessionCookiesName } from '@/backend/helpers';
import { cookies } from 'next/headers';

const getOneProductDetails = async (id, currentCookies) => {
  const URL = `${process.env.NEXTAUTH_URL}/api/product?${id}`;
  const res = await fetch(URL, {
    headers: {
      Cookie: currentCookies,
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
  const data = await res.json();
  return data.product;
};

const ProductDetailsPage = async ({ params }) => {
  const session = getServerSession(options);
  const nextCookies = cookies();
  const cookieName = getSessionCookiesName();
  let nextAuthSessionToken = nextCookies.get(cookieName);
  nextAuthSessionToken = nextAuthSessionToken?.value;
  const currentCookies = `${cookieName}=${nextAuthSessionToken}`;
  const product = await getOneProductDetails(params.id, currentCookies);

  return <UpdateProductDetails product={product} />;
};

export default ProductDetailsPage;
