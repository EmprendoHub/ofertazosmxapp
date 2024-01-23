import React from 'react';
import { getCookiesName } from '@/backend/helpers';
import { cookies } from 'next/headers';
import AllAdminProductsComponent from '@/components/admin/AllAdminProductsComponent';
import AdminPagination from '@/components/pagination/AdminPagination';
import axios from 'axios';
import { getServerSession } from 'next-auth';
import { options } from '@/app/api/auth/[...nextauth]/options';

const getAllProducts = async (searchParams, currentCookies, perPage) => {
  try {
    const urlParams = {
      keyword: searchParams.keyword,
      page: searchParams.page,
      category: searchParams.category,
      brand: searchParams.brand,
      'rating[gte]': searchParams.rating,
      'price[lte]': searchParams.max,
      'price[gte]': searchParams.min,
    };
    // Filter out undefined values
    const filteredUrlParams = Object.fromEntries(
      Object.entries(urlParams).filter(([key, value]) => value !== undefined)
    );

    const searchQuery = new URLSearchParams(filteredUrlParams).toString();
    const URL = `${process.env.NEXTAUTH_URL}/api/products?${searchQuery}`;
    const { data } = await axios.get(
      URL,
      {
        headers: {
          Cookie: currentCookies,
          perPage: perPage,
          'Content-Type': 'application/json; charset=utf-8',
        },
      },
      { cache: 'no-cache' }
    );

    return data;
  } catch (error) {
    console.log(error);
  }
};

const AdminProductsPage = async ({ searchParams }) => {
  const session = await getServerSession(options);
  const nextCookies = cookies();
  const cookieName = getCookiesName();
  let nextAuthSessionToken = nextCookies.get(cookieName);
  nextAuthSessionToken = nextAuthSessionToken?.value;
  const currentCookies = `${cookieName}=${nextAuthSessionToken}`;

  const page = searchParams['page'] ?? '1';
  const per_page = '5';
  const start = (Number(page) - 1) * Number(per_page); // 0, 5, 10 ...
  const end = start + Number(per_page); // 5, 10, 15 ...

  const productData = await getAllProducts(
    searchParams,
    currentCookies,
    per_page,
    session
  );
  const filteredProductsCount = productData?.filteredProductsCount;
  const products = productData?.products.products;
  return (
    <>
      <AllAdminProductsComponent
        products={products}
        filteredProductsCount={filteredProductsCount}
      />
      <AdminPagination
        hasNextPage={end < filteredProductsCount}
        hasPrevPage={start > 0}
        totalItemCount={filteredProductsCount}
        perPage={per_page}
      />
    </>
  );
};

export default AdminProductsPage;
