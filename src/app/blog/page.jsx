import React from 'react';
import { getCookiesName } from '@/backend/helpers';
import { cookies } from 'next/headers';
import BlogCoverSection from '@/components/blog/BlogCoverSection';
import FeaturedPosts from '@/components/blog/FeaturedPosts';
import RecentPosts from '@/components/blog/RecentPosts';

export const metadata = {
  title: 'Blog Marort Mx',
  description: 'Ven y explora nuestro blog y descubre artículos de moda.',
};

const getAllPosts = async (searchParams, currentCookies) => {
  const urlParams = {
    keyword: searchParams.keyword,
    page: searchParams.page,
  };
  // Filter out undefined values
  const filteredUrlParams = Object.fromEntries(
    Object.entries(urlParams).filter(([key, value]) => value !== undefined)
  );
  const searchQuery = new URLSearchParams(filteredUrlParams).toString();
  const URL = `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/posts?${searchQuery}`;
  try {
    const res = await fetch(URL, {
      headers: {
        Cookie: currentCookies,
      },
    });

    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

const BlogPage = async ({ searchParams }) => {
  const nextCookies = cookies();
  const cookieName = getCookiesName();
  let nextAuthSessionToken = nextCookies.get(cookieName);
  nextAuthSessionToken = nextAuthSessionToken?.value;
  const currentCookies = `${cookieName}=${nextAuthSessionToken}`;
  const allBlogData = await getAllPosts(searchParams, currentCookies);
  const allBlogs = allBlogData?.posts.posts;
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
