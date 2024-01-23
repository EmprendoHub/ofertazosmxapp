import React from 'react';
import AdminPagination from '@/components/pagination/AdminPagination';
import { getCookiesName } from '@/backend/helpers';
import { cookies } from 'next/headers';
import AdminPostsComponent from '@/components/admin/AdminPostsComponent';
import axios from 'axios';
import { connectToDatabase } from '@/lib/connectMongo';
import Link from 'next/link';

// const getAllPosts = async (searchParams) => {
//   const urlParams = {
//     keyword: searchParams.keyword,
//     page: searchParams.page,
//   };
//   // Filter out undefined values
//   const filteredUrlParams = Object.fromEntries(
//     Object.entries(urlParams).filter(([key, value]) => value !== undefined)
//   );
//   const nextCookies = cookies();
//   const cookieName = getCookiesName();
//   const nextAuthSessionToken = nextCookies.get(cookieName);
//   const searchQuery = new URLSearchParams(filteredUrlParams).toString();
//   const URL = `${process.env.NEXTAUTH_URL}/api/posts?${searchQuery}`;
//   try {
//     const { data } = await axios.get(
//       URL,
//       {
//         headers: {
//           Cookie: `${cookieName}=${nextAuthSessionToken?.value}`,
//         },
//       },
//       { cache: 'no-cache' }
//     );
//     return data;
//   } catch (error) {
//     console.log(error);
//   }
// };

async function getData(perPage, page) {
  try {
    // DB Connect
    const client = await connectToDatabase();

    const db = client.db('shopoutdb');
    console.log(db);

    // DB Query
    const items = await db
      .collection('posts')
      .find({})
      .skip(perPage * (page - 1))
      .limit(perPage)
      .toArray();

    const itemCount = await db.collection('posts').countDocuments({});

    const response = { items, itemCount };
    return response;
  } catch (error) {
    console.log(error);
    throw new Error('Failed to fetch data. Please try again later.');
  }
}

const AdminPostsPage = async ({ searchParams }) => {
  let page = parseInt(searchParams.page, 10);
  page = !page || page < 1 ? 1 : page;
  const perPage = 4;
  const data = await getData(perPage, page);

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
        <ul className="grid grid-cols-4 gap-4 text-center">
          {data.items.map((item) => (
            <li
              key={item._id}
              className="bg-green-500 rounded-md p-4 text-black"
            >
              {item.title}
            </li>
          ))}
        </ul>

        {isPageOutOfRange ? (
          <div>No more pages...</div>
        ) : (
          <div className="flex justify-center items-center mt-16">
            <div className="flex border-[1px] gap-4 rounded-[10px] border-light-green p-4">
              {page === 1 ? (
                <div className="opacity-60" aria-disabled="true">
                  Previous
                </div>
              ) : (
                <Link href={`?page=${prevPage}`} aria-label="Previous Page">
                  Previous
                </Link>
              )}

              {pageNumbers.map((pageNumber, index) => (
                <Link
                  key={index}
                  className={
                    page === pageNumber
                      ? 'bg-green-500 fw-bold px-2 rounded-md text-black'
                      : 'hover:bg-green-500 px-1 rounded-md'
                  }
                  href={`?page=${pageNumber}`}
                >
                  {pageNumber}
                </Link>
              ))}

              {page === totalPages ? (
                <div className="opacity-60" aria-disabled="true">
                  Next
                </div>
              ) : (
                <Link href={`?page=${nextPage}`} aria-label="Next Page">
                  Next
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
