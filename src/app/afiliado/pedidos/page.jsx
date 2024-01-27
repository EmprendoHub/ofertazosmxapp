import { options } from '@/app/api/auth/[...nextauth]/options';
import { getAllOrders } from '@/backend/controllers/affiliateController';
import AfiliadoOrders from '@/components/afiliados/AfiliadoOrders';
import ServerPagination from '@/components/pagination/ServerPagination';
import { getServerSession } from 'next-auth';
import React from 'react';

const UserOrdersPage = async ({ searchParams }) => {
  const session = await getServerSession(options);
  const data = await getAllOrders(searchParams, session);
  const filteredOrdersCount = data?.itemCount;
  const orders = data?.orders.orders;
  let page = parseInt(searchParams.page, 10);
  page = !page || page < 1 ? 1 : page;
  const perPage = Number(data?.resPerPage);
  const totalPages = Math.ceil(data.itemCount / perPage);
  const prevPage = page - 1 > 0 ? page - 1 : 1;
  const nextPage = page + 1;
  const isPageOutOfRange = page > totalPages;
  const pageNumbers = [];
  const offsetNumber = 1;
  for (let i = page - offsetNumber; i <= page + offsetNumber; i++) {
    if (i >= 1 && i <= totalPages) {
      pageNumbers.push(i);
    }
  }

  return (
    <>
      <AfiliadoOrders
        orders={orders}
        filteredOrdersCount={filteredOrdersCount}
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

export default UserOrdersPage;
