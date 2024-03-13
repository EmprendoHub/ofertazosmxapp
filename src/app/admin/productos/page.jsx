import React from 'react';
import ServerPagination from '@/components/pagination/ServerPagination';
import AdminProducts from '@/components/admin/AdminProducts';
import { getAllProduct } from '@/app/_actions';

const AdminProductsPage = async ({ searchParams }) => {
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

  // pagination
  let page = parseInt(searchParams.page, 10);
  page = !page || page < 1 ? 1 : page;
  const perPage = 10;
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

  return (
    <>
      <AdminProducts
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
