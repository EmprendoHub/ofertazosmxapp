import React from 'react';
import UpdateProductDetails from '@/components/products/UpdateProductDetails';

const getOneProductDetails = async (id) => {
  const URL = `${process.env.NEXTAUTH_URL}/api/product?${id}`;
  const res = await fetch(URL);
  const data = await res.json();
  return data.product;
};

const ProductDetailsPage = async ({ params }) => {
  const product = await getOneProductDetails(params.id);

  return <UpdateProductDetails product={product} />;
};

export default ProductDetailsPage;
