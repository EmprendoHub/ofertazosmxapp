'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { FaPencilAlt, FaTrash, FaUserCircle } from 'react-icons/fa';
import Swal from 'sweetalert2';
import AdminClientSearch from '../layout/AdminClientSearch';
import { useDispatch, useSelector } from 'react-redux';
import { saveEmailReceiver } from '@/redux/shoppingSlice';

const AllClientsComponent = ({ clients, filteredClientsCount }) => {
  const dispatch = useDispatch();
  const { emailListData } = useSelector((state) => state.compras);
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
        //deleteUser(product_id);
      }
    });
  };
  console.log(emailListData, 'emails');
  const handleCheckBox = (client) => {
    // If the client with the same ID doesn't exist, add it to the list
    const receiver = {
      id: client?._id,
      email: client?.email,
      name: client?.name,
    };
    dispatch(saveEmailReceiver(receiver));
  };

  return (
    <>
      <hr className="my-4" />
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <div className=" flex flex-row maxsm:flex-col maxsm:items-start items-center justify-between">
          {' '}
          <h1 className="text-3xl my-5 ml-4 font-bold">
            {`${filteredClientsCount} Clientes `}
          </h1>
          <AdminClientSearch />
        </div>
        <table className="w-full text-sm  text-left">
          <thead className="text-l text-gray-700 uppercase">
            <tr>
              <th></th>
              <th scope="col" className="px-6 maxsm:px-0 py-3 maxmd:hidden">
                Id
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
            {clients?.map((client, index) => (
              <tr className="bg-white" key={index}>
                <td>
                  <input
                    type="checkbox"
                    id={client._id}
                    onChange={() => handleCheckBox(client)}
                  />
                </td>
                <td className="px-6 maxsm:px-2 py-2 maxmd:hidden">
                  <Link
                    key={index}
                    href={`/admin/asociados/cuenta/${client._id}`}
                  >
                    {client._id.substring(0, 10)}...
                  </Link>
                </td>
                <td className="px-6 maxsm:px-0 py-2 ">
                  <b>{client.role}</b>
                </td>
                <td className={`px-6 maxsm:px-0 py-2 font-bold `}>
                  {client.name}
                </td>
                <td className="px-1 py-2">{client.email}</td>
                <td className="px-1 py-2  w-24 flex flex-row">
                  <div>
                    <Link
                      href={`/admin/asociados/cuenta/${client._id}`}
                      className="px-2 py-2 inline-block text-white hover:text-black bg-black shadow-sm border border-gray-200 rounded-md hover:bg-gray-100 cursor-pointer mr-2"
                    >
                      <FaPencilAlt className="" />
                    </Link>
                  </div>
                  <div>
                    <button
                      onClick={() => deleteHandler(client._id)}
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

export default AllClientsComponent;
