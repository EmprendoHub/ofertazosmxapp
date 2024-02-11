import React from 'react';
import BlogPublishedComponent from '@/components/blog/BlogPublishedComponent';
import { getCookiesName } from '@/backend/helpers';
import { cookies } from 'next/headers';

const getOnePostDetails = async (id) => {
  const nextCookies = cookies();
  const cookieName = getCookiesName();
  const nextAuthSessionToken = nextCookies.get(cookieName);
  const URL = `${process.env.NEXTAUTH_URL}/api/post`;
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
  return data.post;
};

const PostDetailsPage = async ({ params }) => {
  const post = await getOnePostDetails(params.id);
  return <BlogPublishedComponent post={post} />;
};

export default PostDetailsPage;
