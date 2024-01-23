'use client';
import React, { useContext } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AuthContext from '@/context/AuthContext';
import { FaTrash, FaPencilAlt } from 'react-icons/fa';
import Swal from 'sweetalert2';

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
            <Link key={index} href={`/admin/blog/editar/${post._id}`}>
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
          <div className="flex flex-row justify-between items-center gap-5">
            <span>
              {' '}
              <button
                onClick={() => deleteHandler(post._id)}
                className="my-2 px-4 py-2 text-center w-full inline-block text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700"
              >
                <FaTrash className="text-white" />
              </button>
            </span>
            <span>
              <Link
                key={index}
                href={`/admin/blog/editar/${post._id}`}
                className="my-2 px-4 py-2 text-center w-full inline-block text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
              >
                <FaPencilAlt className="text-white" />
              </Link>
            </span>
          </div>
        </div>
      ))}

      <hr className="my-4" />
    </>
  );
};

export default AdminPostsComponent;
