'use client';
import Link from 'next/link';
import { FaEye } from 'react-icons/fa';
import { formatDate, formatTime } from '@/backend/helpers';
import { getTotalFromItems } from '@/backend/helpers';
import FormattedPrice from '@/backend/helpers/FormattedPrice';
import AdminOrderSearch from '@/components/layout/AdminOrderSearch';
import { TfiMoney } from 'react-icons/tfi';
import { useState } from 'react';
import Modal from '../modals/Modal';
import { FaPrint } from 'react-icons/fa6';

const AdminOrders = ({ orders, filteredOrdersCount }) => {
  const [showModal, setShowModal] = useState(false);
  const [usedOrderId, setUsedOrderId] = useState('');
  const updateOrderStatus = async (orderId) => {
    setUsedOrderId(orderId);
    setShowModal(true);
  };
  return (
    <>
      <Modal
        showModal={showModal}
        setShowModal={setShowModal}
        orderId={usedOrderId}
      />
      <div className="relative overflow-x-auto shadow-md maxsm:rounded-lg">
        <div className=" flex flex-row maxsm:flex-col maxsm:items-start items-center justify-between">
          <h1 className="text-3xl w-full maxsm:text-xl my-5 maxsm:my-1 ml-4 maxsm:ml-0 font-bold font-EB_Garamond">
            {`${filteredOrdersCount} Pedidos `}
          </h1>
          <AdminOrderSearch />
        </div>
        <table className="w-full text-sm maxmd:text-xs text-left">
          <thead className=" text-gray-700 uppercase">
            <tr>
              <th scope="col" className="px-4 maxsm:px-1 py-3">
                No.
              </th>
              <th scope="col" className="px-4 py-3 maxmd:hidden">
                Total
              </th>
              <th scope="col" className="px-4 maxsm:px-0 py-3">
                Pagado
              </th>
              <th scope="col" className="px-4 maxsm:px-0 py-3">
                Estado
              </th>
              <th scope="col" className="px-4 maxsm:px-0 py-3">
                Ubic.
              </th>
              <th scope="col" className="px-4 py-3 maxsm:hidden">
                Fecha
              </th>
              <th scope="col" className="w-5 px-1 py-3 text-center">
                ...
              </th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((order, index) => (
              <tr className="bg-white" key={index}>
                <td className="px-4 maxsm:px-2 py-2">
                  <Link key={index} href={`/admin/pedido/${order._id}`}>
                    {order.orderId}
                  </Link>
                </td>
                <td className="px-4 py-2 maxmd:hidden">
                  <FormattedPrice
                    amount={getTotalFromItems(order.orderItems)}
                  />
                </td>
                <td className="px-4 maxsm:px-0 py-2 ">
                  <b>
                    <FormattedPrice amount={order?.paymentInfo?.amountPaid} />
                  </b>
                </td>
                <td
                  className={`px-4 maxsm:px-0 py-2 font-bold ${
                    order.orderStatus === 'Apartado'
                      ? 'text-amber-700'
                      : order.orderStatus === 'En Camino'
                      ? 'text-blue-700'
                      : order.orderStatus === 'Entregado'
                      ? 'text-green-700'
                      : order.orderStatus === 'Pagado'
                      ? 'text-green-800'
                      : 'text-slate-600'
                  }`}
                >
                  {order.orderStatus}
                </td>
                <td
                  className={`px-4 maxsm:px-0 py-2 font-bold ${
                    order.branch === 'Sahuayo'
                      ? 'text-amber-700'
                      : 'text-slate-600'
                  }`}
                >
                  {order.branch}
                </td>
                <td className="px-4 py-2 maxsm:hidden">
                  {order?.createdAt &&
                    `${formatDate(
                      order?.createdAt.substring(0, 24)
                    )} a las ${formatTime(order?.createdAt)}`}
                </td>
                <td className="px-1 py-2">
                  <div className="flex items-center">
                    <Link
                      href={`/admin/pedido/${order._id}`}
                      className="px-2 py-2 inline-block text-white hover:text-black bg-black shadow-sm border border-gray-200 rounded-md hover:bg-gray-100 cursor-pointer mr-2"
                    >
                      <FaEye className="" />
                    </Link>
                    <Link
                      href={`/admin/recibo/${order._id}`}
                      className="px-2 py-2 inline-block text-white hover:text-black bg-black shadow-sm border border-gray-200 rounded-md hover:bg-gray-100 cursor-pointer mr-2"
                    >
                      <FaPrint className="" />
                    </Link>
                    {order?.paymentInfo?.amountPaid >=
                      getTotalFromItems(order.orderItems) ===
                    true ? (
                      ''
                    ) : (
                      <button
                        onClick={() => updateOrderStatus(order._id)}
                        className={`px-2 py-2 inline-block text-black hover:text-black ${
                          order?.paymentInfo?.amountPaid >=
                            getTotalFromItems(order.orderItems) ===
                          true
                            ? ''
                            : 'bg-emerald-700'
                        }  shadow-sm border border-gray-200 rounded-md hover:scale-110 cursor-pointer mr-2 duration-200 ease-in-out`}
                      >
                        {order?.paymentInfo?.amountPaid >=
                          getTotalFromItems(order.orderItems) ===
                        true ? (
                          ''
                        ) : (
                          <TfiMoney className="text-white" />
                        )}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AdminOrders;
