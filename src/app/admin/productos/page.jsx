import React from 'react';
import AllAdminProductsComponent from '@/components/admin/AllAdminProductsComponent';
import Product from '@/backend/models/Product';
import dbConnect from '@/lib/db';
import ServerPagination from '@/components/pagination/ServerPagination';

async function getData(perPage, page, searchParams) {
  'use server';
  try {
    await dbConnect();
    let items;
    items = await Product.find()
      .skip(perPage * (page - 1))
      .limit(perPage);

    const itemCount = await Product.countDocuments({});
    // console.log(productQuery);
    // // Apply search Filters
    // const apiProductFilters = new APIFilters(productQuery, searchParams)
    //   .searchAllFields()
    //   .filter();

    // let items = await apiProductFilters.query;

    // const filteredProductsCount = items.length;

    const response = { items, itemCount };
    return response;
  } catch (error) {
    console.log(error);
    throw new Error('Failed to fetch data. Please try again later.');
  }
}

const AdminProductsPage = async ({ searchParams }) => {
  let page = parseInt(searchParams.page, 10);
  page = !page || page < 1 ? 1 : page;
  const perPage = 4;
  const data = await getData(perPage, page, searchParams);
  const totalPages = Math.ceil(data.itemCount / perPage);
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

  const products = data.items.map((item) => JSON.parse(JSON.stringify(item)));

  return (
    <>
      <AllAdminProductsComponent products={products} search={search} />
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
