'use client';
import React, { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { formatDate } from '@/backend/helpers';
import { resetCart } from '@/redux/shoppingSlice';
import { FaEye, FaMoneyCheck } from 'react-icons/fa';
import { getTotalFromItems } from '@/backend/helpers';
import OrderSearch from '@/components/layout/OrderSearch';
import AuthContext from '@/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import AdminPagination from '@/components/pagination/AdminPagination';

const UserOrders = ({ searchParams, currentCookies }) => {
  const { getAllUserOrders } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [filteredOrdersCount, setFilteredOrdersCount] = useState();
  const page = searchParams['page'] ?? '1';
  const per_page = 5;
  const start = (Number(page) - 1) * Number(per_page); // 0, 5, 10 ...
  const end = start + Number(per_page); // 5, 10, 15 ...
  const dispatch = useDispatch();
  const router = useRouter();
  const params = useSearchParams();

  const orderSuccess = params.get('pedido_exitoso');

  useEffect(() => {
    async function getOrders() {
      const ordersData = await getAllUserOrders(searchParams, currentCookies);
      setOrders(ordersData?.orders.orders);
      setFilteredOrdersCount(ordersData?.filteredOrdersCount);
    }
    getOrders();
  }, [getAllUserOrders, searchParams, currentCookies]);

  useEffect(() => {
    if (orderSuccess === 'true') {
      dispatch(resetCart());
      router.replace('/perfil/pedidos');
    }
  }, [orderSuccess]);

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <div className=" flex flex-row justify-between items-center">
        <h1 className="text-3xl my-5 ml-4 font-bold">
          {orders?.length} Pedidos
        </h1>
        <OrderSearch />
      </div>
      <table className="w-full text-sm text-left">
        <thead className="text-l text-gray-700 uppercase">
          <tr>
            <th scope="col" className="px-6 py-3">
              No.
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
                  {order.orderId}
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
      <AdminPagination
        hasNextPage={end < filteredOrdersCount}
        hasPrevPage={start > 0}
        totalItemCount={filteredOrdersCount}
        perPage={per_page}
      />
    </div>
  );
};

export default UserOrders;
