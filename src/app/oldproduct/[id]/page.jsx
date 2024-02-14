import React from 'react';
import { cookies } from 'next/headers';
import { getSessionCookiesName } from '@/backend/helpers';
import ProductComponent from '@/components/products/ProductComponent';

const getOneProductDetails = async (id, currentCookies) => {
  const URL = `${process.env.NEXTAUTH_URL}/api/product`;
  const res = await fetch(
    URL,
    {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Cookie: currentCookies,
        Id: `${id}`,
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
    <>
      <ProductComponent product={product} trendingProducts={trendingProducts} />
      {/* <ImageSlider /> */}
    </>
  );
};

export default ProductDetailsPage;
