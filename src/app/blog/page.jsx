import React from 'react';
import { getCookiesName } from '@/backend/helpers';
import { cookies } from 'next/headers';
import BlogCoverSection from '@/components/blog/BlogCoverSection';
import FeaturedPosts from '@/components/blog/FeaturedPosts';
import RecentPosts from '@/components/blog/RecentPosts';
import axios from 'axios';

export const metadata = {
  title: 'Blog Marort Mx',
  description: 'Ven y explora nuestro blog y descubre artículos de moda.',
};

const getAllPosts = async (searchParams) => {
  const urlParams = {
    keyword: searchParams.keyword,
    page: searchParams.page,
  };
  const nextCookies = cookies();
  const cookieName = getCookiesName();
  const nextAuthSessionToken = nextCookies.get(cookieName);

  // Filter out undefined values
  const filteredUrlParams = Object.fromEntries(
    Object.entries(urlParams).filter(([key, value]) => value !== undefined)
  );
  const searchQuery = new URLSearchParams(filteredUrlParams).toString();
  const URL = `${process.env.NEXTAUTH_URL}/api/posts?${searchQuery}`;
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

const BlogPage = async ({ searchParams }) => {
  const allBlogData = await getAllPosts(searchParams);
  const allBlogs = await allBlogData?.posts?.posts;
  return (
    <>
      <main className="flex flex-col items-center justify-center mt-10">
        <BlogCoverSection blogs={allBlogs} />
        <FeaturedPosts blogs={allBlogs} />
        <RecentPosts blogs={allBlogs} />
      </main>
    </>
  );
};

export default BlogPage;
