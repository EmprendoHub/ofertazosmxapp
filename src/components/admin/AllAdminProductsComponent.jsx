'use client';
import React, { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AuthContext from '@/context/AuthContext';
import { FaTrash, FaPencilAlt, FaStar } from 'react-icons/fa';
import FormattedPrice from '@/backend/helpers/FormattedPrice';
import AdminProductSearch from '../layout/AdminProductSearch';
import Swal from 'sweetalert2';
import SearchProducts from '@/app/admin/productos/search';

const AllAdminProductsComponent = ({
  products,
  filteredProductsCount,
  search,
}) => {
  const { deleteProduct } = useContext(AuthContext);
  const deleteHandler = (product_id) => {
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
          text: 'Tu producto ha sido eliminado.',
          icon: 'success',
        });
        deleteProduct(product_id);
      }
    });
  };
  return (
    <>
      <hr className="my-4 maxsm:my-1" />
      <div className="relative overflow-x-auto min-h-full shadow-md sm:rounded-lg">
        <div className=" flex flex-row  maxsm:items-start items-center justify-between">
          {' '}
          <h1 className="text-3xl maxsm:text-base my-5 maxsm:my-1 ml-4 maxsm:ml-0 font-bold font-EB_Garamond w-1/2">
            {`${filteredProductsCount} Productos `}
          </h1>
          <SearchProducts search={search} />
        </div>
        <table className="w-full text-sm  text-left h-full">
          <thead className="text-l text-gray-700 uppercase">
            <tr>
              <th scope="col" className="px-6 maxsm:px-0 py-3 maxmd:hidden">
                SKU
              </th>
              <th scope="col" className="px-6 maxsm:px-0 py-3 ">
                Img
              </th>

              <th scope="col" className="px-6 maxsm:px-0 py-3 ">
                Precio
              </th>
              <th scope="col" className="px-6 maxsm:px-0 py-3 maxsm:hidden">
                Titulo
              </th>
              <th scope="col" className="px-1 py-3 ">
                Exst.
              </th>
              <th scope="col" className="w-5 px-1 py-3 text-center">
                ...
              </th>
            </tr>
          </thead>
          <tbody>
            {products?.map((product, index) => (
              <tr className="bg-white" key={index}>
                <td className="px-6 maxsm:px-2 py-2 maxmd:hidden">
                  <Link
                    key={index}
                    href={`/admin/productos/editar/${product._id}`}
                  >
                    {product._id.substring(0, 10)}...
                  </Link>
                </td>
                <td className="px-6 maxsm:px-0 py-2 relative ">
                  <span className="relative flex items-center justify-center text-black w-12 h-12 maxsm:w-8 maxsm:h-8 shadow mt-2">
                    <Link href={`/admin/productos/editar/${product._id}`}>
                      <Image
                        src={product?.images[0].url}
                        alt="Title"
                        width={100}
                        height={100}
                        className="w-10 h-auto maxsm:w-10 "
                      />
                    </Link>
                    {product?.featured === 'Si' ? (
                      <span className="absolute -top-3 -right-1 z-20">
                        <FaStar className="text-xl text-amber-600" />
                      </span>
                    ) : (
                      ''
                    )}
                  </span>
                </td>
                <td className="px-6 maxsm:px-0 py-2 ">
                  <b>
                    <FormattedPrice amount={product.price} />
                  </b>
                </td>
                <td className={`px-6 maxsm:px-0 py-2 font-bold maxsm:hidden`}>
                  {product.title.substring(0, 15)}
                </td>
                <td className="px-1 py-2 ">{product.stock}</td>
                <td className="px-1 py-2 flex flex-row items-center gap-x-1">
                  <Link
                    href={`/admin/productos/editar/${product._id}`}
                    className="p-2 inline-block text-white hover:text-black bg-black shadow-sm border border-gray-200 rounded-md hover:bg-gray-100 cursor-pointer "
                  >
                    <FaPencilAlt className="maxsm:text-[10px]" />
                  </Link>
                  <button
                    onClick={() => deleteHandler(product._id)}
                    className="p-2 inline-block text-white hover:text-black bg-red-600 shadow-sm border border-gray-200 rounded-md hover:bg-gray-100 cursor-pointer "
                  >
                    <FaTrash className="maxsm:text-[10px]" />
                  </button>
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

export default AllAdminProductsComponent;
