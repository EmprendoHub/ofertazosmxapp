import React from 'react';
import Link from 'next/link';
import { FaUserCircle } from 'react-icons/fa';

const AllClientsComponent = ({ clients }) => {
  return (
    <>
      <hr className="my-4" />
      {clients?.map((client, index) => (
        <div
          key={index}
          className="flex flex-row maxsm:flex-col justify-between items-center "
        >
          <div>
            <Link key={index} href={`/admin/clientes/editar/${client._id}`}>
              <div className="mb-5 gap-4">
                <figure className="w-full flex align-center bg-gray-100 p-4 rounded-md cursor-pointer maxsm:flex-col">
                  <div className="mr-3 w-15 h-15 maxsm:w-full maxsm:h-full">
                    <span className="flex items-center justify-center text-black w-12 h-12 maxsm:w-full maxsm:h-full shadow mt-2">
                      <FaUserCircle />
                    </span>
                  </div>
                  <figcaption className="text-gray-600">
                    <p>
                      {client?._id}
                      <br />
                      {client?.email}
                      <br />
                      Tipo: {client?.role}
                    </p>
                  </figcaption>
                </figure>
              </div>
            </Link>
          </div>
          <div className="flex flex-row justify-between items-center gap-5">
            <span>
              <Link
                key={index}
                href={`/admin`}
                className="my-2 px-4 py-2 text-center w-full inline-block text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
              >
                Select
              </Link>
            </span>
          </div>
        </div>
      ))}

      <hr className="my-4" />
    </>
  );
};

export default AllClientsComponent;
