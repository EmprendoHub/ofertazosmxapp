'use client';
import React, { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AuthContext from '@/context/AuthContext';
import { toast } from 'react-toastify';
import FormattedPrice from '@/backend/helpers/FormattedPrice';

const AdminOneOrder = ({ id, data }) => {
  const { updateOrder } = useContext(AuthContext);
  const order = data.order;
  const address = data.deliveryAddress;
  const [orderStatus, setOrderStatus] = useState(order?.orderStatus);
  const [currentOrderStatus, setCurrentOrderStatus] = useState();

  function getQuantities(orderItems) {
    // Use reduce to sum up the 'quantity' fields
    const totalQuantity = orderItems?.reduce(
      (sum, obj) => sum + obj.quantity,
      0
    );
    return totalQuantity;
  }

  function getTotal(orderItems) {
    // Use reduce to sum up the 'total' field
    const totalAmount = orderItems?.reduce(
      (acc, cartItem) => acc + cartItem.quantity * cartItem.price,
      0
    );
    return totalAmount;
  }

  function getPendingTotal(orderItems, orderAmountPaid) {
    // Use reduce to sum up the 'total' field
    const totalAmount = orderItems?.reduce(
      (acc, cartItem) => acc + cartItem.quantity * cartItem.price,
      0
    );
    const pendingAmount = totalAmount - orderAmountPaid;
    return pendingAmount;
  }

  function subtotal() {
    let sub = order?.paymentInfo?.amountPaid - order?.ship_cost;
    return sub;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (order?.orderStatus === orderStatus) {
      toast.success('No hubo ningún cambio');
      return;
    }

    try {
      const formData = new FormData();
      formData.set('orderStatus', orderStatus);
      formData.set('_id', id);

      try {
        const res = await updateOrder(formData);

        if (res.ok) {
          const data = await res.json();
          toast.success('El pedido se actualizo exitosamente');
          setCurrentOrderStatus(data.payload.orderStatus);

          return;
        }
      } catch (error) {
        toast.error('Error actualizando pedido. Por favor Intenta de nuevo.');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg p-5">
        <div className="flex flex-row items-center justify-start gap-x-5">
          <h2 className="text-3xl mb-8 ml-4 font-bold ">
            Pedido #{order?._id}
          </h2>
          {order?.orderStatus === 'Apartado' ? (
            <h2
              className={`text-3xl mb-8 ml-4 font-bold uppercase text-amber-700`}
            >
              Apartado
            </h2>
          ) : (
            <h2
              className={`text-3xl mb-8 ml-4 font-bold uppercase ${
                order?.paymentInfo?.status === 'paid' ? 'text-green-700' : ''
              }`}
            >
              {order?.paymentInfo?.amountPaid >= getTotal(order?.orderItems)
                ? 'PAGADO'
                : 'PENDIENTE'}
            </h2>
          )}
        </div>
        <table className="w-full text-sm text-left">
          <thead className="text-l text-gray-700 uppercase">
            <tr>
              <th scope="col" className="px-6 py-3">
                Domicilio
              </th>
              <th scope="col" className="px-6 py-3">
                Ciudad
              </th>
              <th scope="col" className="px-6 py-3">
                Entidad
              </th>
              <th scope="col" className="px-6 py-3">
                Código Postal
              </th>
              <th scope="col" className="px-6 py-3">
                Tel
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-white">
              <td className="px-6 py-2">{address?.street}</td>
              <td className="px-6 py-2">{address?.city}</td>
              <td className="px-6 py-2">{address?.province}</td>
              <td className="px-6 py-2">{address?.zip_code}</td>
              <td className="px-6 py-2">{address?.phone}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg p-5">
        <table className="w-full text-sm text-left">
          <thead className="text-l text-gray-700 uppercase">
            <tr>
              <th scope="col" className="px-6 py-3">
                ID
              </th>
              <th scope="col" className="px-6 py-3">
                Nombre
              </th>
              <th scope="col" className="px-6 py-3">
                Artículos
              </th>
              <th scope="col" className="px-6 py-3">
                Precio
              </th>
              <th scope="col" className="px-6 py-3">
                Img
              </th>
            </tr>
          </thead>
          <tbody>
            {order?.orderItems?.map((item, index) => (
              <tr className="bg-white" key={index}>
                <td className="px-6 py-2">{item.product || item._id}</td>
                <td className="px-6 py-2">{item.name}</td>
                <td className="px-6 py-2">{item.quantity}</td>
                <td className="px-6 py-2">
                  <FormattedPrice amount={item.price} />
                </td>
                <td className="px-6 py-2">
                  <Image
                    alt="producto"
                    src={item.image}
                    width={50}
                    height={50}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="relative flex flex-row maxmd:flex-col items-center justify-start overflow-x-auto shadow-md sm:rounded-lg p-5 gap-12">
        <div className="w-1/3 maxmd:w-full">
          <div className="container max-w-screen-xl mx-auto bg-white flex flex-col justify-between p-2">
            <h2 className="text-2xl">Totales</h2>
            {order?.orderStatus === 'Apartado' ? (
              <ul className="mb-5">
                <li className="flex justify-between gap-x-5 text-gray-600  mb-1">
                  <span>Total de Artículos:</span>
                  <span className="text-green-700">
                    {getQuantities(order?.orderItems)} (Artículos)
                  </span>
                </li>
                <li className="flex justify-between gap-x-5 text-gray-600  mb-1">
                  <span>Sub-Total:</span>
                  <span>
                    <FormattedPrice amount={subtotal()} />
                  </span>
                </li>

                <li className="flex justify-between gap-x-5 text-gray-600  mb-1">
                  <span>Total:</span>
                  <span>
                    <FormattedPrice amount={getTotal(order?.orderItems)} />
                  </span>
                </li>
                <li className="text-xl font-bold border-t flex justify-between gap-x-5  pt-3">
                  <span>Abono:</span>
                  <span>
                    - <FormattedPrice amount={order?.paymentInfo?.amountPaid} />
                  </span>
                </li>

                <li className="text-xl text-amber-700 font-bold border-t flex justify-between gap-x-5  pt-1">
                  <span>Pendiente:</span>
                  <span>
                    <FormattedPrice
                      amount={getPendingTotal(
                        order?.orderItems,
                        order?.paymentInfo?.amountPaid
                      )}
                    />
                  </span>
                </li>
              </ul>
            ) : (
              <ul className="mb-5">
                <li className="flex justify-between gap-x-5 text-gray-600  mb-1">
                  <span>Sub-Total:</span>
                  <span>
                    <FormattedPrice amount={subtotal()} />
                  </span>
                </li>
                <li className="flex justify-between gap-x-5 text-gray-600  mb-1">
                  <span>Total de Artículos:</span>
                  <span className="text-green-700">
                    {getQuantities(order?.orderItems)} (Artículos)
                  </span>
                </li>
                <li className="flex justify-between gap-x-5 text-gray-600  mb-1">
                  <span>Envió:</span>
                  <span>
                    <FormattedPrice amount={order?.ship_cost} />
                  </span>
                </li>
                <li className="text-3xl font-bold border-t flex justify-between gap-x-5 mt-3 pt-3">
                  <span>Total:</span>
                  <span>
                    <FormattedPrice amount={order?.paymentInfo?.amountPaid} />
                  </span>
                </li>
              </ul>
            )}
          </div>
        </div>
        {order?.orderStatus === 'Apartado' ? (
          <div className="w-2/3 maxmd:w-full">
            <hr />{' '}
          </div>
        ) : (
          <div className="w-2/3 maxmd:w-full">
            <hr />
            <form
              onSubmit={handleSubmit}
              className="flex flex-row flex-wrap items-start gap-5 justify-start "
            >
              {' '}
              <div className="my-8">
                <h2
                  className={`${
                    order?.orderStatus === 'Procesando'
                      ? 'text-blue-900'
                      : order?.orderStatus === 'En Camino'
                      ? 'text-amber-700'
                      : order?.orderStatus === 'Entregado'
                      ? 'text-green-700'
                      : ''
                  } text-3xl mb-8 ml-4 font-bold uppercase`}
                >
                  {currentOrderStatus}
                </h2>
                <label className="block mb-3">
                  {' '}
                  Actualizar estado de pedido{' '}
                </label>
                <div className="relative">
                  <select
                    className="block appearance-none border border-gray-200 bg-gray-100 rounded-md py-2 px-3 hover:border-gray-400 focus:outline-none focus:border-gray-400 w-full"
                    name="orderStatus"
                    required
                    value={orderStatus}
                    onChange={(e) => setOrderStatus(e.target.value)}
                  >
                    {['Procesando', 'En Camino', 'Entregado'].map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  <i className="absolute inset-y-0 right-0 p-2 text-gray-400">
                    <svg
                      width="22"
                      height="22"
                      className="fill-current"
                      viewBox="0 0 20 20"
                    >
                      <path d="M7 10l5 5 5-5H7z"></path>
                    </svg>
                  </i>
                </div>
              </div>
              <button
                type="submit"
                className="mb-2 px-4 py-2 text-center w-full inline-block text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
              >
                Actualizar
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminOneOrder;
