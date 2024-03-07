import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { MdAttachMoney } from 'react-icons/md';
import { IoArrowRedoSharp } from 'react-icons/io5';
import { HiArrowNarrowUp, HiOutlineUserGroup } from 'react-icons/hi';

const POSDashComponent = ({
  orders,
  products,
  orderCountPreviousMonth,
  totalOrderCount,
  totalProductCount,
}) => {
  return (
    <div className="p-3 md:mx-auto  text-slate-300">
      <div className="flex-wrap flex gap-4 justify-start">
        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 w-72 maxmd:w-full rounded-md shadow-md">
          <div className="flex justify-between">
            <div className="">
              <h3 className="text-gray-500 text-md uppercase">
                Pedidos Totales
              </h3>
              <p className="text-2xl text-slate-300">{totalOrderCount}</p>
            </div>
            <MdAttachMoney className="bg-teal-600  text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
          <div className="flex  gap-2 text-sm">
            <span className="text-green-500 flex items-center">
              <HiArrowNarrowUp />
              {orderCountPreviousMonth}
            </span>
            <div className="text-gray-500">Mes Anterior</div>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-4 py-3 mx-auto justify-start">
        <div className="flex flex-col w-72 maxmd:w-full shadow-md p-5 rounded-md dark:bg-gray-800">
          <div className="flex justify-between py-3 text-base font-black font-EB_Garamond">
            <h1 className="text-center">Pedidos recientes</h1>
            <button>
              <Link href={'/puntodeventa/pedidos'}>Ver todos</Link>
            </button>
          </div>
          <table>
            <thead>
              <tr className="flex justify-between mb-4">
                <th>No.</th>
                <th>Status</th>
                <th>...</th>
              </tr>
            </thead>
            {orders &&
              orders.map((order) => (
                <tbody key={order._id} className="divide-y">
                  <tr className="bg-white flex justify-between dark:border-gray-700 dark:bg-gray-800 mb-4">
                    <td>{order.orderId}</td>
                    <td>{order.orderStatus}</td>
                    <td>
                      <Link href={`/puntodeventa/pedido/${order._id}`}>
                        <IoArrowRedoSharp className=" text-teal-600 " />
                      </Link>
                    </td>
                  </tr>
                </tbody>
              ))}
          </table>
        </div>
      </div>
    </div>
  );
};

export default POSDashComponent;
