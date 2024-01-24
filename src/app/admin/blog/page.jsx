import React from 'react';
import Link from 'next/link';
import AdminPostsComponent from '@/components/admin/AdminPostsComponent';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { cookies } from 'next/headers';
import { getCookiesName } from '@/backend/helpers';

const getAllPosts = async (searchParams, cookie) => {
  const urlParams = {
    keyword: searchParams.keyword,
    page: searchParams.page,
  };
  // Filter out undefined values
  const filteredUrlParams = Object.fromEntries(
    Object.entries(urlParams).filter(([key, value]) => value !== undefined)
  );
  const searchQuery = new URLSearchParams(filteredUrlParams).toString();
  const URL = `${process.env.NEXTAUTH_URL}/api/posts?${searchQuery}`;
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

const AdminPostsPage = async ({ searchParams }) => {
  //set cookies
  const nextCookies = cookies();
  const cookieName = getCookiesName();
  const nextAuthSessionToken = nextCookies.get(cookieName);
  const cookie = `${cookieName}=${nextAuthSessionToken?.value}`;
  const data = await getAllPosts(searchParams, cookie);
  //
  const posts = data?.posts?.posts;
  let page = parseInt(searchParams.page, 10);
  page = !page || page < 1 ? 1 : page;
  const perPage = 4;
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
      <div className="container mx-auto mt-8">
        <AdminPostsComponent data={posts} />

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
      </div>
    </>
  );
};

export default AdminPostsPage;
