import React from 'react';
import AllProductsComponent from '@/components/products/AllProductsComponent';

const getProducts = async (searchParams) => {
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
    const res = await fetch(URL);
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

const ProfilePage = async ({ searchParams }) => {
  const data = await getProducts(searchParams);
  const page = searchParams['page'] ?? '1';
  const per_page = searchParams['per_age'] ?? '10';
  const start = (Number(page) - 1) * Number(per_page); // 0, 5, 10 ...
  const end = start + Number(per_page); // 5, 10, 15 ...
  let entries = data?.products;
  let allCategories = data?.allCategories;
  let allBrands = data?.allBrands;
  const totalProductCount = entries?.length;
  entries = entries?.slice(start, end);
  return <AllProductsComponent products={entries} />;
};

export default ProfilePage;
