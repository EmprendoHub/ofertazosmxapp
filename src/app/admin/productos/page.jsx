import React from 'react';
import AllAdminProductsComponent from '@/components/admin/AllAdminProductsComponent';
import Product from '@/backend/models/Product';
import dbConnect from '@/lib/db';
import ServerPagination from '@/components/pagination/ServerPagination';
import { cookies } from 'next/headers';
import { getCookiesName } from '@/backend/helpers';

const getAllProducts = async (searchParams, cookie) => {
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
  try {
    const res = await fetch(URL, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookie,
      },
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

const AdminProductsPage = async ({ searchParams }) => {
  const nextCookies = cookies();
  const cookieName = getCookiesName();
  let nextAuthSessionToken = nextCookies.get(cookieName);
  nextAuthSessionToken = nextAuthSessionToken?.value;
  const cookie = `${cookieName}=${nextAuthSessionToken}`;
  const data = await getAllProducts(searchParams, cookie);
  let page = parseInt(searchParams.page, 10);
  page = !page || page < 1 ? 1 : page;
  const perPage = 5;
  //const data = await getData(perPage, page, searchParams);
  const itemCount = data?.productsCount;
  const totalPages = Math.ceil(data.filteredProductsCount / perPage);
  const prevPage = page - 1 > 0 ? page - 1 : 1;
  const nextPage = page + 1;
  const isPageOutOfRange = page > totalPages;
  const pageNumbers = [];
  const offsetNumber = 3;
  const search =
    typeof searchParams.search === 'string' ? searchParams.search : undefined;
  for (let i = page - offsetNumber; i <= page + offsetNumber; i++) {
    if (i >= 1 && i <= totalPages) {
      pageNumbers.push(i);
    }
  }

  const products = data?.products?.products.map((item) =>
    JSON.parse(JSON.stringify(item))
  );

  return (
    <>
      <AllAdminProductsComponent
        products={products}
        search={search}
        filteredProductsCount={itemCount}
      />
      <ServerPagination
        isPageOutOfRange={isPageOutOfRange}
        page={page}
        pageNumbers={pageNumbers}
        prevPage={prevPage}
        nextPage={nextPage}
        totalPages={totalPages}
      />
    </>
  );
};

export default AdminProductsPage;
