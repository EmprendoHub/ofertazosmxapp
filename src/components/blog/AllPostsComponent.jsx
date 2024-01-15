'use client';
import React, { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AuthContext from '@/context/AuthContext';
import AdminPagination from '../pagination/AdminPagination';

const AllPostsComponent = ({ searchParams, currentCookies }) => {
  const { getAllPosts } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [filteredPostsCount, setFilteredPostsCount] = useState();
  const page = searchParams['page'] ?? '1';
  const per_page = 5;
  const start = (Number(page) - 1) * Number(per_page); // 0, 5, 10 ...
  const end = start + Number(per_page); // 5, 10, 15 ...

  useEffect(() => {
    async function getPosts() {
      const postsData = await getAllPosts(searchParams, currentCookies);
      setPosts(postsData?.posts.posts);
      setFilteredPostsCount(postsData?.filteredPostsCount);
    }
    getPosts();
  }, [getAllPosts, searchParams, currentCookies]);

  return (
    <>
      <hr className="my-4" />
      {posts?.map((post, index) => (
        <div
          key={index}
          className="flex flex-row maxsm:flex-col justify-between items-center "
        >
          <div>
            <Link key={index} href={`/blog/articulo/${post._id}`}>
              <div className="mb-5 gap-4">
                <figure className="w-full flex align-center bg-gray-100 p-4 rounded-md cursor-pointer maxsm:flex-col">
                  <div className="mr-3 w-15 h-15 maxsm:w-full maxsm:h-full">
                    <span className="flex items-center justify-center text-black w-12 h-12 maxsm:w-full maxsm:h-full shadow mt-2">
                      <Image
                        src={post?.images[0].url}
                        alt="Title"
                        width={100}
                        height={100}
                      />
                    </span>
                  </div>
                  <figcaption className="text-gray-600">
                    <p>
                      {post?.title}
                      <br /> {post?.summary}
                      <br />
                      Categoría: {post?.category}
                    </p>
                  </figcaption>
                </figure>
              </div>
            </Link>
          </div>
        </div>
      ))}

      <hr className="my-4" />
      <AdminPagination
        hasNextPage={end < filteredPostsCount}
        hasPrevPage={start > 0}
        totalItemCount={filteredPostsCount}
      />
    </>
  );
};

export default AllPostsComponent;
