'use client';
import React, { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AuthContext from '@/context/AuthContext';
import { FaTrash, FaPencilAlt } from 'react-icons/fa';
import ConfirmationModalContextProvider from '../modals/modalConfirmationContext';
import DeleteButton from '../buttons/DeleteButton';
import AdminPagination from '../pagination/AdminPagination';
import FormattedPrice from '@/backend/helpers/FormattedPrice';
import AdminProductSearch from '../layout/AdminProductSearch';

const AllProductsComponent = ({ searchParams, currentCookies }) => {
  const { getAllProducts } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [filteredProductsCount, setFilteredProductsCount] = useState();
  const page = searchParams['page'] ?? '1';
  const per_page = '5';
  const start = (Number(page) - 1) * Number(per_page); // 0, 5, 10 ...
  const end = start + Number(per_page); // 5, 10, 15 ...

  useEffect(() => {
    async function getProducts() {
      const productsData = await getAllProducts(
        searchParams,
        currentCookies,
        per_page
      );
      setProducts(productsData?.products.products);
      setFilteredProductsCount(productsData?.filteredProductsCount);
    }
    getProducts();
  }, [getAllProducts, searchParams, currentCookies]);

  const { deleteProduct } = useContext(AuthContext);
  const deleteHandler = (product_id) => {
    deleteProduct(product_id);
  };
  return (
    <ConfirmationModalContextProvider>
      <Link href="/admin/productos/nuevo">
        <button className="px-4 py-2 inline-block text-blue-600 border border-gray-300 rounded-md hover:bg-gray-100">
          <i className="mr-1 fa fa-plus"></i> Agregar Nuevo Producto
        </button>
      </Link>
      <hr className="my-4" />
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <div className=" flex flex-row maxsm:flex-col maxsm:items-start items-center justify-between">
          {' '}
          <h1 className="text-3xl my-5 ml-4 font-bold">
            {`${filteredProductsCount} Productos `}
          </h1>
          <AdminProductSearch />
        </div>
        <table className="w-full text-sm  text-left">
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
              <th scope="col" className="px-6 maxsm:px-0 py-3">
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
                <td className="px-6 maxsm:px-0 py-2 ">
                  <span className="flex items-center justify-center text-black w-12 h-12 maxsm:w-10 maxsm:h-10 shadow mt-2">
                    <Image
                      src={product?.images[0].url}
                      alt="Title"
                      width={100}
                      height={100}
                    />
                  </span>
                </td>
                <td className="px-6 maxsm:px-0 py-2 ">
                  <b>
                    <FormattedPrice amount={product.price} />
                  </b>
                </td>
                <td className={`px-6 maxsm:px-0 py-2 font-bold `}>
                  {product.title.substring(0, 15)}
                </td>
                <td className="px-1 py-2 ">{product.stock}</td>
                <td className="px-1 py-2 ">
                  <div>
                    <Link
                      href={`/admin/productos/editar/${product._id}`}
                      className="px-2 py-2 inline-block text-white hover:text-black bg-black shadow-sm border border-gray-200 rounded-md hover:bg-gray-100 cursor-pointer mr-2"
                    >
                      <FaPencilAlt className="" />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <AdminPagination
          hasNextPage={end < filteredProductsCount}
          hasPrevPage={start > 0}
          totalItemCount={filteredProductsCount}
          perPage={per_page}
        />
      </div>

      <hr className="my-4" />
    </ConfirmationModalContextProvider>
  );
};

export default AllProductsComponent;
