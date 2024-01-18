import React from 'react';
import AllPostsComponent from '@/components/blog/AllPostsComponent';
import { getCookiesName } from '@/backend/helpers';
import { cookies } from 'next/headers';

export const metadata = {
  title: 'Blog Shopout Mx',
  description: 'Ven y explora nuestro blog y descubre artículos de moda.',
};

const BlogPage = async ({ searchParams }) => {
  const nextCookies = cookies();
  const cookieName = getCookiesName();
  let nextAuthSessionToken = nextCookies.get(cookieName);
  nextAuthSessionToken = nextAuthSessionToken?.value;
  const currentCookies = `${cookieName}=${nextAuthSessionToken}`;

  return (
    <>
      <AllPostsComponent
        searchParams={searchParams}
        currentCookies={currentCookies}
      />
    </>
  );
};

export default BlogPage;
