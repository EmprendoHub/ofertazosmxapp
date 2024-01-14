import React from 'react';
import UpdatePostDetails from '@/components/blog/UpdatePostDetails';
import ViewPostDetails from '@/components/blog/ViewPostDetails';

const getOnePostDetails = async (id) => {
  const URL = `${process.env.NEXTAUTH_URL}/api/post?${id}`;
  const res = await fetch(URL, { cache: 'no-cache' });
  const data = await res.json();
  return data.post;
};

const BlogArticlePage = async ({ params }) => {
  const post = await getOnePostDetails(params.id);

  return <ViewPostDetails post={post} />;
};

export default BlogArticlePage;
