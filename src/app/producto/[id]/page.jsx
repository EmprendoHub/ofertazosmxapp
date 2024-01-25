import React from 'react';
import ProductDetailsComponent from '@/components/products/ProductDetailsComponent';
import { cookies } from 'next/headers';
import { getSessionCookiesName } from '@/backend/helpers';

const getOneProductDetails = async (id, currentCookies) => {
  const URL = `${process.env.NEXTAUTH_URL}/api/product?${id}`;
  const res = await fetch(
    URL,
    {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Cookie: currentCookies,
      },
    },
    { next: { revalidate: 120 } }
  );
  const data = await res.json();
  return data;
};

const ProductDetailsPage = async ({ params }) => {
  const nextCookies = cookies();
  const cookieName = getSessionCookiesName();
  let nextAuthSessionToken = nextCookies.get(cookieName);
  nextAuthSessionToken = nextAuthSessionToken?.value;
  const currentCookies = `${cookieName}=${nextAuthSessionToken}`;
  const data = await getOneProductDetails(params.id, currentCookies);
  const product = data?.product;
  const trendingProducts = data?.trendingProducts;
  return (
    <ProductDetailsComponent
      product={product}
      trendingProducts={trendingProducts}
    />
  );
};

export default ProductDetailsPage;
