import { getCookiesName } from '@/backend/helpers';
import ViewPostDetails from '@/components/blog/ViewPostDetails';
import axios from 'axios';
import { cookies } from 'next/headers';
import React from 'react';

const getOnePostDetails = async (id) => {
  const nextCookies = cookies();
  const cookieName = getCookiesName();
  const nextAuthSessionToken = nextCookies.get(cookieName);
  const URL = `${process.env.NEXTAUTH_URL}/api/post?${id}`;

  try {
    const { data } = await axios.get(URL, {
      headers: {
        Cookie: `${cookieName}=${nextAuthSessionToken?.value}`,
      },
    });

    return data;
  } catch (error) {
    console.log(error);
  }
};

const BlogPostPage = async ({ params }) => {
  const postData = await getOnePostDetails(params.id);
  const post = postData?.post;
  const trendingProducts = postData?.trendingProducts;
  return <ViewPostDetails post={post} trendingProducts={trendingProducts} />;
};

export default BlogPostPage;
