'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { TiCancel } from 'react-icons/ti';
import { FaPencilAlt } from 'react-icons/fa';
import Swal from 'sweetalert2';
import AdminClientSearch from '../layout/AdminClientSearch';
import { useDispatch, useSelector } from 'react-redux';
import { saveEmailReceiver } from '@/redux/shoppingSlice';
import { changeClientStatus } from '@/app/_actions';

const AllClientsComponent = ({ clients, filteredClientsCount }) => {
  const dispatch = useDispatch();
  const { emailListData } = useSelector((state) => state.compras);
  const [selectedClients, setSelectedClients] = useState([]);
  useEffect(() => {
    // Map through emailListData and extract only the ids
    const emailIds = emailListData.map((data) => data.id);

    // Filter through clients and update the selectedClients state array
    const updatedSelectedClients = clients.map((client) => ({
      ...client,
      isSelected: emailIds.includes(client._id),
    }));

    setSelectedClients(updatedSelectedClients);
  }, [emailListData, clients]);

  const deactivateHandler = (client_id, active) => {
    let title;
    let text;
    let confirmBtn;
    let successTitle;
    let successText;
    let icon;
    let confirmBtnColor;
    if (active === true) {
      icon = 'warning';
      title = 'Estas seguro(a)?';
      text =
        '¡Estas a punto de desactivar a este cliente y quedara sin acceso!';
      confirmBtn = '¡Sí, desactivar cliente!';
      confirmBtnColor = '#CE7E00';
      successTitle = 'Desactivar!';
      successText = 'El cliente ha sido desactivado.';
    } else {
      icon = 'success';
      title = 'Estas seguro(a)?';
      text = '¡Estas a punto de reactivar a este cliente!';
      confirmBtn = '¡Sí, reactivar cliente!';
      confirmBtnColor = '#228B22';
      successTitle = 'Reactivado!';
      successText = 'El cliente ha sido reactivado.';
    }
    Swal.fire({
      title: title,
      text: text,
      icon: icon,
      showCancelButton: true,
      confirmButtonColor: confirmBtnColor,
      cancelButtonColor: '#000',
      confirmButtonText: confirmBtn,
      cancelButtonText: 'No, cancelar!',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: successTitle,
          text: successText,
          icon: icon,
        });
        changeClientStatus(client_id);
      }
    });
  };
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
          <h1 className="text-2xl mb-5 ml-4 font-bold font-EB_Garamond w-full ">
            {`${filteredClientsCount} Clientes `}
          </h1>
          <AdminClientSearch />
        </div>
        <table className="w-full text-sm  text-left">
          <thead className="text-l text-gray-700 uppercase">
            <tr>
              <th></th>
              <th scope="col" className="px-6 maxsm:px-0 py-3 maxmd:hidden">
                Nombre
              </th>
              <th scope="col" className="px-6 maxsm:px-0 py-3 ">
                Teléfono
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
            {selectedClients?.map((client, index) => (
              <tr
                className={` ${
                  client?.active === true
                    ? 'bg-slate-100'
                    : 'bg-slate-200 text-slate-400'
                }`}
                key={index}
              >
                {client?.active}
                <td>
                  <input
                    type="checkbox"
                    id={client._id}
                    checked={client.isSelected} // Bind the checked attribute based on isSelected
                    onChange={() => handleCheckBox(client)}
                  />
                </td>
                <td className="px-6 maxsm:px-2 py-2">
                  <Link key={index} href={`/admin/cliente/${client._id}`}>
                    {client.name.substring(0, 15)}...
                  </Link>
                </td>
                <td className="px-6 maxsm:px-0 py-2  maxmd:hidden">
                  <b>{client.role}</b>
                </td>

                <td className="px-1 py-2">
                  {client.email.substring(0, 12)}...
                </td>
                <td className="px-1 py-2  w-24 flex flex-row">
                  <div>
                    <Link
                      href={`/admin/cliente/${client._id}`}
                      className="px-2 py-2 inline-block text-white hover:text-black bg-black shadow-sm border border-gray-200 rounded-md hover:bg-gray-100 cursor-pointer mr-2"
                    >
                      <FaPencilAlt className="" />
                    </Link>
                  </div>
                  <div>
                    <button
                      onClick={() =>
                        deactivateHandler(client._id, client?.active)
                      }
                      className="px-2 py-2 inline-block text-white hover:text-black bg-slate-400 shadow-sm border border-gray-200 rounded-md hover:bg-gray-100 cursor-pointer mr-2"
                    >
                      <TiCancel className="" />
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
