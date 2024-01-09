'use client';
import React, { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import AuthContext from '@/context/AuthContext';
import { formatDate } from '@/backend/helpers';
import { useRouter, useSearchParams } from 'next/navigation';
import { resetCart } from '@/redux/shoppingSlice';
import { useDispatch } from 'react-redux';
import { FaEye, FaMoneyCheck } from 'react-icons/fa';
import { getTotalFromItems } from '@/backend/helpers';

const UserOrders = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const params = useSearchParams();

  const orderSuccess = params.get('pedido_exitoso');
  const { getAllUserOrders } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (orderSuccess === 'true') {
      dispatch(resetCart());
      router.replace('/perfil/pedidos');
    }
  }, [orderSuccess]);

  useEffect(() => {
    async function getOrders() {
      const ordersGet = await getAllUserOrders();
      setOrders(ordersGet);
    }
    getOrders();
  }, [getAllUserOrders]);

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
                {' '}
                <Link
                  href={`/perfil/pedidos/${order._id}`}
                  className="cursor-pointer "
                >
                  {order._id.substring(0, 7)}...
                </Link>
              </td>
              <td className="px-6 py-2">
                ${getTotalFromItems(order.orderItems)}
              </td>
              <td className="px-6 py-2 ">
                <b>${order.paymentInfo.amountPaid}</b>
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
                {' '}
                <p>
                  {order?.createdAt &&
                    `${formatDate(order?.createdAt.substring(0, 24))} `}
                </p>
              </td>

              <td className="px-6 py-2">
                <div>
                  <Link
                    href={`/perfil/pedidos/${order._id}`}
                    className="px-2 py-2 inline-block text-white hover:text-black bg-black shadow-sm border border-gray-200 rounded-md hover:bg-gray-100 cursor-pointer mr-2"
                  >
                    <FaEye className="" />
                  </Link>
                  <a className="px-2 py-2 inline-block text-white  hover:text-black bg-black shadow-sm border border-gray-200 rounded-md hover:bg-gray-100 cursor-pointer">
                    <FaMoneyCheck className="" />
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

export default UserOrders;
