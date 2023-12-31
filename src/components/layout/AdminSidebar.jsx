"use client";
import React from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { FaUsers, FaRegAddressCard, FaUserEdit } from "react-icons/fa";
import { RiLockPasswordLine, RiLogoutCircleRFill } from "react-icons/ri";
import { FaListCheck, FaTableCells, FaFileCirclePlus } from "react-icons/fa6";
import { MdOutlineDashboard } from "react-icons/md";

const AdminSidebar = () => {
  return (
    <aside className=' w-1/4 maxmd:w-full px-4 maxsm:px-1 py-8 flex flex-col maxmd:flex-row  items-start justify-start'>
      <ul className='sidebar flex flex-col maxmd:flex-row gap-x-2 '>
        <Link
          href='/admin'
          className='block px-3 maxsm:px-1 py-2 text-gray-800 hover:bg-blue-100 hover:text-blue-500 rounded-md'
        >
          <li className='flex flex-row items-center gap-x-3 '>
            <MdOutlineDashboard className='text-2xl text-black' />

            <div className='maxmd:hidden'>Panel de Control</div>
          </li>
        </Link>
        <Link
          href='/admin/pedidos'
          className='block px-3 maxsm:px-1 py-2 text-gray-800 hover:bg-blue-100 hover:text-blue-500 rounded-md'
        >
          <li className='flex flex-row items-center gap-x-3'>
            <FaListCheck className='text-2xl text-black' />

            <div className='maxmd:hidden'>Pedidos</div>
          </li>
        </Link>
        <Link
          href='/admin/productos/nuevo'
          className='block px-3 maxsm:px-1 py-2 text-gray-800 hover:bg-blue-100 hover:text-blue-500 rounded-md'
        >
          <li className='flex flex-row items-center gap-x-3'>
            <FaFileCirclePlus className='text-2xl text-black' />

            <div className='maxmd:hidden'>Nuevo Producto</div>
          </li>
        </Link>
        <Link
          href='/admin/productos'
          className='block px-3 maxsm:px-1 py-2 text-gray-800 hover:bg-blue-100 hover:text-blue-500 rounded-md'
        >
          <li className='flex flex-row items-center gap-x-3'>
            <FaTableCells className='text-2xl text-black' />

            <div className='maxmd:hidden'>Productos</div>
          </li>
        </Link>
      </ul>
      <hr className='my-4 maxsm:px-1' />
      <ul className='sidebar flex flex-col maxmd:flex-row gap-x-2'>
        <Link
          href='/admin/clientes'
          className='block px-3 maxsm:px-1 py-2 text-gray-800 hover:bg-blue-100 hover:text-blue-500 rounded-md'
        >
          <li className='flex flex-row items-center gap-x-3'>
            <FaUsers className='text-2xl text-black' />

            <div className='maxmd:hidden'>Clientes</div>
          </li>
        </Link>
        <Link
          href='/admin/perfil/actualizar'
          className='block px-3 maxsm:px-1 py-2 text-gray-800 hover:bg-blue-100 hover:text-blue-500 rounded-md'
        >
          <li className='flex flex-row items-center gap-x-3'>
            <RiLockPasswordLine className='text-2xl text-black' />

            <div className='maxmd:hidden'>Perfil</div>
          </li>
        </Link>

        <li>
          <div
            className=' px-3 maxsm:px-1 py-2 text-red-800 hover:bg-red-100 hover:text-white-500 rounded-md cursor-pointer flex flex-row items-center gap-x-3'
            onClick={() => signOut()}
          >
            <RiLogoutCircleRFill className='text-2xl text-black' />

            <div className='maxmd:hidden'>Cerrar Session</div>
          </div>
        </li>
      </ul>
    </aside>
  );
};

export default AdminSidebar;
