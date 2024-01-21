'use client';
import React, { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { AiTwotoneHome } from 'react-icons/ai';
import AuthContext from '@/context/AuthContext';
import Swal from 'sweetalert2';
import { FaPencilAlt, FaTrash } from 'react-icons/fa';

const MyAffiliateLinks = ({ currentCookies }) => {
  const { getAllAffiliateLinks } = useContext(AuthContext);
  const [links, setLinks] = useState([]);

  useEffect(() => {
    async function getLinks() {
      const data = await getAllAffiliateLinks(currentCookies);
      console.log(data[0].events.length);
      setLinks(data);
    }
    getLinks();
  }, [getAllAffiliateLinks]);

  const deleteHandler = (link_id) => {
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
          text: 'El Enlace ha sido eliminado.',
          icon: 'success',
        });
        //deleteAddress(link_id);
      }
    });
  };
  return (
    <div className="px-5">
      <hr className="my-4" />

      <Link href="/afiliado/enlaces/nuevo">
        <button className="px-4 py-2 inline-block text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100">
          <i className="mr-1 fa fa-plus"></i> Agregar Enlace
        </button>
      </Link>

      <hr className="my-4" />
      {links?.map((link, index) => (
        <div
          key={index}
          className="flex flex-row justify-between items-center "
        >
          <div>
            <Link href={`/afiliado/`}>
              <div className="mb-5 gap-4">
                <figure className="w-full flex align-center bg-gray-100 p-4 rounded-md cursor-pointer">
                  <div className="mr-3">
                    <span className="flex items-center justify-center text-black w-12 h-12 bg-white rounded-full shadow mt-2">
                      <AiTwotoneHome className=" text-black" />
                    </span>
                  </div>
                  <figcaption className="text-gray-600">
                    <p>
                      Enlace de Afiliado: {link?.link?.targetUrl}
                      <br />
                      Codigo Unico: {link?.link?.uniqueCode}
                      <br />
                      Metadata: {link?.link?.metadata}
                      <br />
                      Clicks: {link?.events.length}
                    </p>
                  </figcaption>
                </figure>
              </div>
            </Link>
          </div>
          <div className="flex flex-col justify-between items-center gap-1">
            <span>
              <button
                onClick={() => deleteHandler(link._id)}
                className="px-2 py-2 inline-block text-white hover:text-red-600 bg-red-600 shadow-sm border border-gray-200 rounded-md hover:bg-gray-100 cursor-pointer "
              >
                <FaTrash className="" />
              </button>
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyAffiliateLinks;
