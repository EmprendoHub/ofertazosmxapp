import POSComponent from '@/components/pos/POSComponent';
import React from 'react';
import { getAllProduct } from '../_actions';

const POSPage = async ({ searchParams }) => {
  const urlParams = {
    keyword: searchParams.keyword,
    page: searchParams.page,
  };
  const filteredUrlParams = Object.fromEntries(
    Object.entries(urlParams).filter(([key, value]) => value !== undefined)
  );
  const searchQuery = new URLSearchParams(filteredUrlParams).toString();
  const data = await getAllProduct(searchQuery);
  const products = JSON.parse(data.products);

  return <POSComponent products={products} />;
};

export default POSPage;
