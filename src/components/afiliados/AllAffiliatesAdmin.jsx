'use client';
import React, { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { FaPencilAlt, FaTrash, FaUserCircle } from 'react-icons/fa';
import AuthContext from '@/context/AuthContext';
import AdminPagination from '../pagination/AdminPagination';
import AdminProductSearch from '../layout/AdminProductSearch';
import Swal from 'sweetalert2';
import AdminAffiliateSearch from '../layout/AdminAffiliateSearch';

const AllAffiliatesAdmin = ({ searchParams, currentCookies }) => {
  const { getAllAffiliates, deleteAffiliate } = useContext(AuthContext);
  const [affiliates, setAffiliates] = useState([]);
  const [affiliatesCount, setAffiliatesCount] = useState(0);
  const page = searchParams['page'] ?? '1';
  const per_page = '5';
  const start = (Number(page) - 1) * Number(per_page); // 0, 5, 10 ...
  const end = start + Number(per_page); // 5, 10, 15 ...

  useEffect(() => {
    async function getAffiliates() {
      const affiliatesGet = await getAllAffiliates(
        searchParams,
        currentCookies,
        per_page
      );
      setAffiliates(affiliatesGet?.affiliates.affiliates);
      setAffiliatesCount(affiliatesGet?.affiliatesCount);
    }
    getAffiliates();
  }, [getAllAffiliates]);

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
        deleteAffiliate(product_id);
      }
    });
  };

  return (
    <>
      <hr className="my-4" />
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <div className=" flex flex-row maxsm:flex-col maxsm:items-start items-center justify-between">
          {' '}
          <h1 className="text-3xl my-5 ml-4 font-bold">
            {`${affiliatesCount} Afiliados `}
          </h1>
          <AdminAffiliateSearch />
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
            {affiliates?.map((affiliate, index) => (
              <tr className="bg-white" key={index}>
                <td className="px-6 maxsm:px-2 py-2 maxmd:hidden">
                  <Link
                    key={index}
                    href={`/admin/affiliates/editar/${affiliate._id}`}
                  >
                    {affiliate._id.substring(0, 10)}...
                  </Link>
                </td>
                <td className="px-6 maxsm:px-0 py-2 relative ">
                  <span className="relative flex items-center justify-center text-black w-12 h-12 maxsm:w-10 maxsm:h-10 shadow mt-2">
                    {affiliate.stripe_id}
                  </span>
                </td>
                <td className="px-6 maxsm:px-0 py-2 ">
                  <b>{affiliate.contact.phone}</b>
                </td>
                <td className={`px-6 maxsm:px-0 py-2 font-bold `}>
                  {affiliate.fullName}
                </td>
                <td className="px-1 py-2 ">{affiliate.email}</td>
                <td className="px-1 py-2 ">
                  <div>
                    <Link
                      href={`/admin/affiliates/editar/${affiliate._id}`}
                      className="px-2 py-2 inline-block text-white hover:text-black bg-black shadow-sm border border-gray-200 rounded-md hover:bg-gray-100 cursor-pointer mr-2"
                    >
                      <FaPencilAlt className="" />
                    </Link>
                  </div>
                  <div>
                    <button
                      onClick={() => deleteHandler(affiliate._id)}
                      className="px-2 py-2 inline-block text-white hover:text-black bg-red-600 shadow-sm border border-gray-200 rounded-md hover:bg-gray-100 cursor-pointer mr-2"
                    >
                      <FaTrash className="" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <AdminPagination
          hasNextPage={end < affiliatesCount}
          hasPrevPage={start > 0}
          totalItemCount={affiliatesCount}
          perPage={per_page}
        />
      </div>

      <hr className="my-4" />
    </>
  );
};

export default AllAffiliatesAdmin;
