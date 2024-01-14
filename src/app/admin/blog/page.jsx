import React from 'react';
import AdminPagination from '@/components/pagination/AdminPagination';
import { getCookiesName } from '@/backend/helpers';
import { cookies } from 'next/headers';
import AdminPostsComponent from '@/components/admin/AdminPostsComponent';
import axios from 'axios';

const getAllPosts = async (searchParams) => {
  const urlParams = {
    keyword: searchParams.keyword,
    page: searchParams.page,
  };
  // Filter out undefined values
  const filteredUrlParams = Object.fromEntries(
    Object.entries(urlParams).filter(([key, value]) => value !== undefined)
  );
  const nextCookies = cookies();
  const cookieName = getCookiesName();
  const nextAuthSessionToken = nextCookies.get(cookieName);
  const searchQuery = new URLSearchParams(filteredUrlParams).toString();
  const URL = `${process.env.NEXTAUTH_URL}/api/posts?${searchQuery}`;
  try {
    const { data } = await axios.get(
      URL,
      {
        headers: {
          Cookie: `${cookieName}=${nextAuthSessionToken?.value}`,
        },
      },
      { cache: 'no-cache' }
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

const AdminPostsPage = async ({ searchParams }) => {
  const data = await getAllPosts(searchParams);
  const postCount = data?.postCount;
  const filteredPostsCount = data?.filteredPostsCount;
  const page = searchParams['page'] ?? '1';
  const per_page = 5;
  const start = (Number(page) - 1) * Number(per_page); // 0, 5, 10 ...
  const end = start + Number(per_page); // 5, 10, 15 ...

  return (
    <>
      <AdminPostsComponent
        data={data}
        filteredPostsCount={filteredPostsCount}
      />
      <AdminPagination
        hasNextPage={end < filteredPostsCount}
        hasPrevPage={start > 0}
        totalItemCount={filteredPostsCount}
      />
    </>
  );
};

export default AdminPostsPage;
