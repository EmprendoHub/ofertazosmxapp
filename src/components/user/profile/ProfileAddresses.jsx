"use client";
import React, { useContext } from "react";
import Link from "next/link";
import { AiTwotoneHome } from "react-icons/ai";
import AuthContext from "@/context/AuthContext";

const ProfileAddresses = ({ data }) => {
  const { deleteAddress } = useContext(AuthContext);
  const addresses = data;
  const deleteHandler = (address_id) => {
    deleteAddress(address_id);
  };
  return (
    <div className='px-5'>
      <hr className='my-4' />

      <Link href='perfil/direcciones/nueva'>
        <button className='px-4 py-2 inline-block text-blue-600 border border-gray-300 rounded-md hover:bg-gray-100'>
          <i className='mr-1 fa fa-plus'></i> Agregar Dirección
        </button>
      </Link>

      <hr className='my-4' />
      {addresses?.map((address, index) => (
        <div
          key={index}
          className='flex flex-row justify-between items-center '
        >
          <div>
            <Link href={`/perfil/direccion/${address._id}`}>
              <div className='mb-5 gap-4'>
                <figure className='w-full flex align-center bg-gray-100 p-4 rounded-md cursor-pointer'>
                  <div className='mr-3'>
                    <span className='flex items-center justify-center text-black w-12 h-12 bg-white rounded-full shadow mt-2'>
                      <AiTwotoneHome className=' text-black' />
                    </span>
                  </div>
                  <figcaption className='text-gray-600'>
                    <p>
                      {address?.street}
                      <br /> {address?.city}, {address?.province},{" "}
                      {address?.zipcode}, {address?.country}
                      <br />
                      Tel: {address?.phone}
                    </p>
                  </figcaption>
                </figure>
              </div>
            </Link>
          </div>
          <div className='flex flex-row justify-between items-center gap-5'>
            <span>
              {" "}
              <button
                onClick={() => deleteHandler(address._id)}
                className='my-2 px-4 py-2 text-center w-full inline-block text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700'
              >
                Borrar
              </button>
            </span>
            <span>
              <Link
                key={index}
                href={`/perfil/direccion/${address._id}`}
                className='my-2 px-4 py-2 text-center w-full inline-block text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700'
              >
                Edit
              </Link>
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProfileAddresses;
