import React from 'react';
import UpdatePostDetails from '@/components/blog/UpdatePostDetails';

const getOnePostDetails = async (id) => {
  const URL = `${process.env.NEXTAUTH_URL}/api/post?${id}`;
  const res = await fetch(URL, { cache: 'no-cache' });
  const data = await res.json();
  return data.post;
};

const PostDetailsPage = async ({ params }) => {
  const post = await getOnePostDetails(params.id);

  return <UpdatePostDetails post={post} />;
};

export default PostDetailsPage;
