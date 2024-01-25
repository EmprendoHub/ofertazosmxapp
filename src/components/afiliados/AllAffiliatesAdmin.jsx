'use client';
import React, { useContext } from 'react';
import Link from 'next/link';
import { FaPencilAlt, FaTrash } from 'react-icons/fa';
import AuthContext from '@/context/AuthContext';
import Swal from 'sweetalert2';
import AdminAffiliateSearch from '../layout/AdminAffiliateSearch';

const AllAffiliatesAdmin = ({ affiliates, filteredAffiliatesCount }) => {
  const { deleteAffiliate } = useContext(AuthContext);

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
            {`${filteredAffiliatesCount} Afiliados `}
          </h1>
          <AdminAffiliateSearch />
        </div>
        <table className="w-full text-sm  text-left">
          <thead className="text-l text-gray-700 uppercase">
            <tr>
              <th scope="col" className="px-6 maxsm:px-0 py-3 maxmd:hidden">
                Id
              </th>
              <th scope="col" className="px-6 maxsm:px-0 py-3 ">
                Stripe
              </th>

              <th scope="col" className="px-6 maxsm:px-0 py-3 ">
                Teléfono
              </th>
              <th scope="col" className="px-6 maxsm:px-0 py-3">
                Nombre
              </th>
              <th scope="col" className="px-1 py-3 ">
                Email
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
                    href={`/admin/asociados/cuenta/${affiliate._id}`}
                  >
                    {affiliate._id.substring(0, 10)}...
                  </Link>
                </td>
                <td className="px-6 maxsm:px-0 py-2 relative ">
                  {affiliate.stripe_id}
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
                      href={`/admin/asociados/cuenta/${affiliate._id}`}
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
      </div>

      <hr className="my-4" />
    </>
  );
};

export default AllAffiliatesAdmin;
