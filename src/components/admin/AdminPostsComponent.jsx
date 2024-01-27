'use client';
import React, { useContext } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AuthContext from '@/context/AuthContext';
import { FaTrash, FaPencilAlt } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { formatDate } from '@/backend/helpers';

const AdminPostsComponent = ({ data, filteredOrdersCount }) => {
  const posts = data;
  const { deletePost } = useContext(AuthContext);

  const deleteHandler = (post_id) => {
    Swal.fire({
      title: 'Estas seguro(a)?',
      text: '¡No podrás revertir esta acción!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#000',
      confirmButtonText: '¡Sí, eliminar!',
      cancelButtonText: 'No, cancelar!',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Eliminado!',
          text: 'Tu publicación ha sido eliminado.',
          icon: 'success',
        });
        deletePost(post_id);
      }
    });
  };
  return (
    <>
      <hr className="my-4 maxsm:my-1" />

      <div className="flex flex-row maxsm:flex-col justify-between items-center ">
        <table className="w-full text-sm text-left">
          <thead className="text-l text-gray-700 uppercase">
            <tr>
              <th scope="col" className="px-6 maxsm:px-0 py-3 maxmd:hidden">
                Id
              </th>
              <th scope="col" className="px-6 maxsm:px-0 py-3 maxsm:py-1">
                Img
              </th>
              <th scope="col" className="px-6 maxsm:px-0 py-3  maxsm:py-1">
                Catg.
              </th>
              <th scope="col" className="px-6 maxsm:px-0 py-3  maxsm:py-1">
                Titulo
              </th>
              <th scope="col" className="px-6 py-3 maxsm:hidden">
                Fecha
              </th>
              <th scope="col" className="w-5 px-1 py-3 text-center">
                ...
              </th>
            </tr>
          </thead>
          <tbody>
            {posts?.map((post, index) => (
              <tr className="bg-white" key={index}>
                <td className="px-6 maxsm:px-2 py-2 maxmd:hidden">
                  <Link key={index} href={`/admin/blog/editar/${post._id}`}>
                    {post._id}
                  </Link>
                </td>
                <td className="px-6 maxsm:px-0 py-2 relative ">
                  <span className="relative flex items-center justify-center text-black w-12 h-12 maxsm:w-10 maxsm:h-10 shadow mt-2">
                    <Link key={index} href={`/admin/blog/editar/${post._id}`}>
                      <Image
                        src={post?.images[0].url}
                        alt="Title"
                        width={100}
                        height={100}
                        className="w-10 h-auto maxsm:w-10 "
                      />
                    </Link>
                  </span>
                </td>
                <td className="px-6 maxsm:px-0 py-2 ">
                  <b>{post?.category.substring(0, 7)}...</b>
                </td>
                <td className={`px-6 maxsm:px-0 py-2 font-bold `}>
                  {post?.title.substring(0, 12)}...
                </td>
                <td className="px-6 py-2 maxsm:hidden">
                  {post?.createdAt &&
                    `${formatDate(post?.createdAt.substring(0, 24))} `}
                </td>
                <td className="px-1 py-2">
                  <div>
                    <Link
                      href={`/admin/blog/editar/${post._id}`}
                      className="px-2 py-2 inline-block text-white hover:text-black bg-black shadow-sm border border-gray-200 rounded-md hover:bg-gray-100 cursor-pointer mr-2"
                    >
                      <FaPencilAlt className="maxsm:text-[10px]" />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <hr className="my-4" />
    </>
  );
};

export default AdminPostsComponent;
