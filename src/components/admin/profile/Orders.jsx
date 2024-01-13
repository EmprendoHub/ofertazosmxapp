import React from 'react';
import Link from 'next/link';
import { FaPencilAlt } from 'react-icons/fa';
import { AiOutlineInteraction } from 'react-icons/ai';
import { formatDate, formatTime } from '@/backend/helpers';
import { getTotalFromItems } from '@/backend/helpers';
import FormattedPrice from '@/backend/helpers/FormattedPrice';
import AdminOrderSearch from '@/components/layout/AdminOrderSearch';

const Orders = ({ orders }) => {
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <h1 className="text-3xl my-5 ml-4 font-bold">
        {`${orders?.length} Pedidos`}
      </h1>
      <AdminOrderSearch />
      <table className="w-full text-sm text-left">
        <thead className="text-l text-gray-700 uppercase">
          <tr>
            <th scope="col" className="px-6 py-3">
              Cliente
            </th>
            <th scope="col" className="px-6 py-3">
              Pedido
            </th>
            <th scope="col" className="px-6 py-3">
              Total
            </th>
            <th scope="col" className="px-6 py-3">
              Pagado
            </th>
            <th scope="col" className="px-6 py-3">
              Estado
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
              <td className="px-6 py-2">
                <Link
                  key={index}
                  href={`/admin/clientes/perfil/${order.user._id}`}
                >
                  {order.user.name.substring(0, 12)}...
                </Link>
              </td>
              <td className="px-6 py-2">
                <Link key={index} href={`/admin/pedidos/${order._id}`}>
                  {order._id.substring(0, 7)}...
                </Link>
              </td>
              <td className="px-6 py-2">
                <FormattedPrice amount={getTotalFromItems(order.orderItems)} />
              </td>
              <td className="px-6 py-2 ">
                <b>
                  <FormattedPrice amount={order.paymentInfo.amountPaid} />
                </b>
              </td>
              <td
                className={`px-6 py-2 font-bold ${
                  order.orderStatus === 'Apartado'
                    ? 'text-amber-700'
                    : order.orderStatus === 'En Camino'
                    ? 'text-blue-700'
                    : order.orderStatus === 'Entregado'
                    ? 'text-green-700'
                    : 'text-slate-600'
                }`}
              >
                {order.orderStatus}
              </td>
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
