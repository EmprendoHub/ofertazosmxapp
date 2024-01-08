'use client';
import React, { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import AuthContext from '@/context/AuthContext';
import { FaPencilAlt } from 'react-icons/fa';
import { AiOutlineInteraction } from 'react-icons/ai';
import { formatDate, formatTime } from '@/backend/helpers';

function getQuantities(orderItems) {
  // Use reduce to sum up the 'quantity' fields
  const totalQuantity = orderItems.reduce((sum, obj) => sum + obj.quantity, 0);
  return totalQuantity;
}

const Orders = () => {
  const { getAllOrders } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function getOrders() {
      const ordersGet = await getAllOrders();
      setOrders(ordersGet);
    }
    getOrders();
  }, [getAllOrders]);

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <h1 className="text-3xl my-5 ml-4 font-bold">{orders?.length} Pedidos</h1>
      <table className="w-full text-sm text-left">
        <thead className="text-l text-gray-700 uppercase">
          <tr>
            <th scope="col" className="px-6 py-3">
              ID
            </th>
            <th scope="col" className="px-6 py-3">
              Cantidad Pagada
            </th>
            <th scope="col" className="px-6 py-3">
              Estado
            </th>
            <th scope="col" className="px-6 py-3">
              Artículos
            </th>
            <th scope="col" className="px-6 py-3">
              Fecha
            </th>
            <th scope="col" className="px-6 py-3">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {orders?.map((order, index) => (
            <tr className="bg-white" key={index}>
              <td className="px-6 py-2">{order.user.name}</td>
              <td className="px-6 py-2">${order.paymentInfo.amountPaid}</td>
              <td className="px-6 py-2">{order.orderStatus}</td>
              <td className="px-6 py-2">{getQuantities(order.orderItems)}</td>
              <td className="px-6 py-2">
                {order?.createdAt &&
                  `${formatDate(order?.createdAt.substring(0, 24))} `}
              </td>
              <td className="px-6 py-2">
                <div>
                  <Link
                    href={`/admin/pedidos/${order._id}`}
                    className="px-2 py-2 inline-block text-white hover:text-black bg-black shadow-sm border border-gray-200 rounded-md hover:bg-gray-100 cursor-pointer mr-2"
                  >
                    <FaPencilAlt className="" />
                  </Link>
                  <a className="px-2 py-2 inline-block text-white  hover:text-black bg-black shadow-sm border border-gray-200 rounded-md hover:bg-gray-100 cursor-pointer">
                    <AiOutlineInteraction className="" />
                  </a>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Orders;
