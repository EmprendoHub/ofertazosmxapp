'use client';
import React, { useContext } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AuthContext from '@/context/AuthContext';
import { FaTrash, FaPencilAlt } from 'react-icons/fa';

const AllPostsComponent = ({ data, filteredOrdersCount }) => {
  const posts = data?.posts.posts;
  return (
    <>
      <Link href="/admin/blog/nuevo">
        <button className="px-4 py-2 inline-block text-blue-600 border border-gray-300 rounded-md hover:bg-gray-100">
          <i className="mr-1 fa fa-plus"></i> Agregar Nueva Publicación
        </button>
      </Link>
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
    </>
  );
};

export default AllPostsComponent;
