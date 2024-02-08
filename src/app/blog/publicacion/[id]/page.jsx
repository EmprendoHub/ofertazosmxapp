import ViewPostDetails from '@/components/blog/ViewPostDetails';
import React from 'react';

const getOnePostDetails = async (id) => {
  const URL = `${process.env.NEXTAUTH_URL}/api/post?${id}`;
  const res = await fetch(URL, { cache: 'no-cache' });
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
