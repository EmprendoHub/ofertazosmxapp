import React from 'react';
import AllPostsComponent from '@/components/blog/AllPostsComponent';

const getPosts = async (searchParams) => {
  const urlParams = {
    keyword: searchParams.keyword,
    page: searchParams.page,
    category: searchParams.category,
    title: searchParams.title,
    'date[lte]': searchParams.max,
    'date[gte]': searchParams.min,
  };
  // Filter out undefined values
  const filteredUrlParams = Object.fromEntries(
    Object.entries(urlParams).filter(([key, value]) => value !== undefined)
  );

  const searchQuery = new URLSearchParams(filteredUrlParams).toString();
  const URL = `${process.env.NEXTAUTH_URL}/api/posts?${searchQuery}`;
  try {
    const res = await fetch(URL);
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

const ProfilePage = async ({ searchParams }) => {
  const data = await getPosts(searchParams);
  const page = searchParams['page'] ?? '1';
  const per_page = searchParams['per_age'] ?? '10';
  const start = (Number(page) - 1) * Number(per_page); // 0, 5, 10 ...
  const end = start + Number(per_page); // 5, 10, 15 ...
  let entries = data?.posts;
  let allCategories = data?.allCategories;
  const totalPostCount = entries?.length;
  entries = entries?.slice(start, end);
  return <AllPostsComponent posts={entries} />;
};

export default ProfilePage;
