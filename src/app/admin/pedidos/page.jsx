import { options } from '@/app/api/auth/[...nextauth]/options';
import AdminOrders from '@/components/admin/profile/AdminOrders';
import AdminPagination from '@/components/pagination/AdminPagination';
import axios from 'axios';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

async function getAllOrders(searchParams, session) {
  try {
    const urlParams = {
      keyword: searchParams.keyword,
      page: searchParams.page,
    };
    const stringSession = JSON.stringify(session);
    // Filter out undefined values
    const filteredUrlParams = Object.fromEntries(
      Object.entries(urlParams).filter(([key, value]) => value !== undefined)
    );
    const searchQuery = new URLSearchParams(filteredUrlParams).toString();
    const URL = `${process.env.NEXTAUTH_URL}/api/orders?${searchQuery}`;
    const res = await fetch(URL, {
      headers: {
        Session: stringSession,
        'Content-Type': 'application/json; charset=utf-8',
      },
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error.message);
  }
}

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
  const offsetNumber = 3;
  for (let i = page - offsetNumber; i <= page + offsetNumber; i++) {
    if (i >= 1 && i <= totalPages) {
      pageNumbers.push(i);
    }
  }

  return (
    <>
      <AdminOrders orders={orders} filteredOrdersCount={filteredOrdersCount} />
      {isPageOutOfRange ? (
        <div>No mas paginas...</div>
      ) : (
        <div className="flex justify-center items-center mt-16">
          <div className="flex border-[1px] gap-4 rounded-[10px] border-light-green p-4">
            {page === 1 ? (
              <div
                aria-disabled="true"
                className="opacity-60 bg-black w-10 h-10 flex justify-center items-center disabled:bg-slate-300 text-white p-2  rounded-full text-xl"
              >
                <FiChevronLeft />
              </div>
            ) : (
              <Link
                href={`?page=${prevPage}`}
                aria-label="Previous Page"
                className="bg-black w-10 h-10 flex justify-center items-center disabled:bg-slate-300 text-white p-2  rounded-full text-xl"
              >
                <FiChevronLeft />
              </Link>
            )}

            {pageNumbers.map((pageNumber, index) => (
              <Link
                key={index}
                className={
                  page === pageNumber
                    ? 'bg-black fw-bold px-2 w-10 h-10 flex justify-center items-center text-white rounded-full'
                    : 'hover:bg-black px-1 rounded-full w-10 h-10 flex justify-center items-center hover:text-white'
                }
                href={`?page=${pageNumber}`}
              >
                {pageNumber}
              </Link>
            ))}

            {page === totalPages ? (
              <div
                className="opacity-60 bg-black w-10 h-10 flex justify-center items-center disabled:bg-slate-300 text-white p-2  rounded-full text-xl"
                aria-disabled="true"
              >
                <FiChevronRight />
              </div>
            ) : (
              <Link
                href={`?page=${nextPage}`}
                aria-label="Next Page"
                className="bg-black w-10 h-10 flex justify-center items-center disabled:bg-slate-300 text-white p-2  rounded-full text-xl"
              >
                <FiChevronRight />
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default UserOrdersPage;
