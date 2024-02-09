import { getCookiesName } from '@/backend/helpers';
import ViewPostDetails from '@/components/blog/ViewPostDetails';
import { cookies } from 'next/headers';
import React from 'react';

const getOnePostDetails = async (id) => {
  const nextCookies = cookies();
  const cookieName = getCookiesName();
  const nextAuthSessionToken = nextCookies.get(cookieName);
  const URL = `${process.env.NEXTAUTH_URL}/api/post`;
  console.log('page id', id);
  const res = await fetch(
    URL,
    {
      headers: {
        Cookie: `${cookieName}=${nextAuthSessionToken?.value}`,
        Id: `${id}`,
      },
    },
    { cache: 'no-cache' }
  );
  const data = await res.json();
  return data;
};

const BlogPostPage = async ({ params }) => {
  const postData = await getOnePostDetails(params.id);
  const post = postData?.post;
  const trendingProducts = postData?.trendingProducts;
  return <ViewPostDetails post={post} trendingProducts={trendingProducts} />;
};

export default BlogPostPage;
