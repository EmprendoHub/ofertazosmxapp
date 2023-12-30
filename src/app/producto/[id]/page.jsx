import React from 'react';
import ProductDetailsComponent from '@/components/products/ProductDetailsComponent';

const getOneProductDetails = async (id) => {
  const URL = `${process.env.NEXTAUTH_URL}/api/product?${id}`;
  const res = await fetch(URL, { cache: 'no-cache' });
  const data = await res.json();
  return data.product;
};

const ProductDetailsPage = async ({ params }) => {
  const product = await getOneProductDetails(params.id);

  return <ProductDetailsComponent product={product} />;
};

export default ProductDetailsPage;
