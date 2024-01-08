'use client';
import React, { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AuthContext from '@/context/AuthContext';

function getQuantities(orderItems) {
  // Use reduce to sum up the 'quantity' fields
  const totalQuantity = orderItems?.reduce((sum, obj) => sum + obj.quantity, 0);
  return totalQuantity;
}

function getTotal(orderItems) {
  // Use reduce to sum up the 'total' field
  const amountWithoutTax = orderItems?.reduce(
    (acc, cartItem) => acc + cartItem.quantity * cartItem.price,
    0
  );
  const amountTax = amountWithoutTax * 0.16;
  const totalAmount = amountWithoutTax + amountTax;

  return totalAmount.toFixed(2);
}

function checkIfPaid(orderItems, orderAmountPaid) {
  // Use reduce to sum up the 'total' field
  const amountWithoutTax = orderItems?.reduce(
    (acc, cartItem) => acc + cartItem.quantity * cartItem.price,
    0
  );
  const amountTax = amountWithoutTax * 0.16;
  const totalAmount = amountWithoutTax + amountTax;

  if (Number(totalAmount) === Number(orderAmountPaid)) {
    return 'pagado';
  } else return 'pendiente de pago';
}

function getPaymentTax(orderAmountPaid) {
  const amountTax = orderAmountPaid * 0.16;
  return amountTax.toFixed(2);
}
function getTaxTotal(orderItems) {
  // Use reduce to sum up the 'total' field
  const amountWithoutTax = orderItems?.reduce(
    (acc, cartItem) => acc + cartItem.quantity * cartItem.price,
    0
  );
  const amountTax = amountWithoutTax * 0.16;

  return amountTax.toFixed(2);
}

function getPendingTotal(orderItems, orderAmountPaid) {
  // Use reduce to sum up the 'total' field
  const amountWithoutTax = orderItems?.reduce(
    (acc, cartItem) => acc + cartItem.quantity * cartItem.price,
    0
  );
  const amountTax = amountWithoutTax * 0.16;
  const totalAmount = amountWithoutTax + amountTax;

  const pendingAmount = totalAmount - orderAmountPaid;

  return pendingAmount.toFixed(2);
}

const OneOrder = ({ id }) => {
  const { getOneOrder } = useContext(AuthContext);
  const [order, setOrder] = useState([]);
  const [address, setAddress] = useState();

  useEffect(() => {
    async function getOrder() {
      const orderGet = await getOneOrder(id);
      setOrder(orderGet?.order);
      setAddress(orderGet?.deliveryAddress);
    }
    getOrder();
  }, [getOneOrder]);

  function subtotal() {
    let sub = getTotal(order?.orderItems);
    sub = sub / (1 + 0.16);
    return sub.toFixed(2);
  }
  return (
    <>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg p-5">
        <div className="flex flex-row items-center justify-start gap-x-5">
          <h2 className="text-3xl mb-8 ml-4 font-bold ">
            Pedido #{order?._id}
          </h2>
          <h2
            className={`text-3xl mb-8 ml-4 font-bold uppercase ${
              order?.orderStatus && order?.orderStatus === 'Apartado'
                ? 'text-amber-700'
                : order.orderStatus === 'En Camino'
                ? 'text-blue-700'
                : order.orderStatus === 'Entregado'
                ? 'text-green-700'
                : 'text-slate-600'
            }`}
          >
            {order?.orderStatus}
          </h2>
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
                Cant.
              </th>
              <th scope="col" className="px-6 py-3">
                Nombre
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
                <td className="px-6 py-2">{item.quantity}</td>
                <td className="px-6 py-2">{item.name}</td>
                <td className="px-6 py-2">${item.price}</td>
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

      {order?.orderStatus === 'Apartado' ? (
        <div className="relative flex fle-row maxmd:flex-col overflow-x-auto shadow-md sm:rounded-lg p-5">
          <div className="w-1/3 maxmd:w-full">
            <div className="container max-w-screen-xl mx-auto bg-white flex flex-col justify-between p-2">
              <h2 className="text-2xl">Totales</h2>
              <ul className="mb-5">
                <li className="flex justify-between gap-x-5 text-gray-600  mb-1">
                  <span>Total de Artículos:</span>
                  <span className="text-green-700">
                    {getQuantities(order?.orderItems)} (Artículos)
                  </span>
                </li>
                <li className="flex justify-between gap-x-5 text-gray-600  mb-1">
                  <span>Sub-Total:</span>
                  <span>${subtotal()}</span>
                </li>

                <li className="flex justify-between gap-x-5 text-gray-600  mb-1">
                  <span>IVA:</span>
                  <span>${getTaxTotal(order?.orderItems)}</span>
                </li>
                <li className="flex justify-between gap-x-5 text-gray-600  mb-1">
                  <span>Total:</span>
                  <span>${getTotal(order?.orderItems)}</span>
                </li>
                <li className="text-xl font-bold border-t flex justify-between gap-x-5  pt-3">
                  <span>Abono:</span>
                  <span>- ${order?.paymentInfo?.amountPaid.toFixed(2)}</span>
                </li>

                <li className="text-xl text-amber-700 font-bold border-t flex justify-between gap-x-5  pt-1">
                  <span>Pendiente:</span>
                  <span>
                    $
                    {getPendingTotal(
                      order?.orderItems,
                      order?.paymentInfo?.amountPaid
                    )}
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div className="w-2/3 maxmd:w-full flex flex-col justify-center items-center">
            <h3
              className={`text-4xl font-raleway font-bold uppercase  ${
                checkIfPaid(
                  order?.orderItems,
                  order?.paymentInfo?.amountPaid
                ) === 'pagado'
                  ? 'text-green-700'
                  : 'text-amber-700'
              } `}
            >
              {checkIfPaid(order?.orderItems, order?.paymentInfo?.amountPaid)}
            </h3>
            <button className="mt-5 bg-green-700 text-white px-6 py-2">
              Pagar
            </button>
          </div>
        </div>
      ) : (
        <div className="relative flex fle-row maxmd:flex-col overflow-x-auto shadow-md sm:rounded-lg p-5">
          <div className="w-1/3 maxmd:w-full">
            <div className="container max-w-screen-xl mx-auto bg-white flex flex-col justify-between p-2">
              <ul className="mb-5">
                <li className="flex justify-between gap-x-5 text-gray-600  mb-1">
                  <span>Sub-Total:</span>
                  <span>${subtotal()}</span>
                </li>
                <li className="flex justify-between gap-x-5 text-gray-600  mb-1">
                  <span>Total de Artículos:</span>
                  <span className="text-green-700">
                    {getQuantities(order?.orderItems)} (Artículos)
                  </span>
                </li>
                <li className="flex justify-between gap-x-5 text-gray-600  mb-1">
                  <span>IVA:</span>
                  <span>${order?.paymentInfo?.taxPaid}</span>
                </li>
                <li className="flex justify-between gap-x-5 text-gray-600  mb-1">
                  <span>Envió:</span>
                  <span>${order?.ship_cost}</span>
                </li>
                <li className="flex justify-between gap-x-5 text-gray-600  mb-1">
                  <span>Total:</span>
                  <span>${getTotal(order?.orderItems)}</span>
                </li>
                <li className="text-xl font-bold text-green-700 border-t flex justify-between gap-x-5  pt-3">
                  <span>Pagado:</span>
                  <span>${order?.paymentInfo?.amountPaid.toFixed(2)}</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="w-2/3 maxmd:w-full flex justify-center items-center">
            <h3
              className={`text-7xl font-EB_Garamond uppercase  -rotate-12 ${
                checkIfPaid(
                  order?.orderItems,
                  order?.paymentInfo?.amountPaid
                ) === 'pagado'
                  ? 'text-green-700'
                  : 'text-amber-700'
              } `}
            >
              {checkIfPaid(order?.orderItems, order?.paymentInfo?.amountPaid)}
            </h3>
          </div>
        </div>
      )}
    </>
  );
};

export default OneOrder;
