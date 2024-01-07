'use client';
import React, { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AuthContext from '@/context/AuthContext';

function getQuantities(orderItems) {
  // Use reduce to sum up the 'quantity' fields
  const totalQuantity = orderItems.reduce((sum, obj) => sum + obj.quantity, 0);
  return totalQuantity;
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
    let sub = order?.paymentInfo?.amountPaid - order?.ship_cost;
    sub = sub / (1 + 0.16);
    return sub.toFixed(2);
  }
  return (
    <>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg p-5">
        <h1 className="text-3xl mb-8 ml-4 font-bold">Pedido #{order?._id}</h1>
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
                <td className="px-6 py-2">{item.product}</td>
                <td className="px-6 py-2">{item.name}</td>
                <td className="px-6 py-2">{item.quantity}</td>
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
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg p-5">
        <div className="container max-w-screen-xl mx-auto bg-white flex flex-col justify-end p-2">
          <h2 className="text-2xl">Totales</h2>
          <ul className="mb-5">
            <li className="flex justify-start gap-x-5 text-gray-600  mb-1">
              <span>Sub-Total:</span>
              <span>${subtotal()}</span>
            </li>
            <li className="flex justify-start gap-x-5 text-gray-600  mb-1">
              <span>Total de Artículos:</span>
              <span className="text-green-700">
                {/* {getQuantities(order?.orderItems)} (Artículos) */}
              </span>
            </li>
            <li className="flex justify-start gap-x-5 text-gray-600  mb-1">
              <span>IVA:</span>
              <span>${order?.paymentInfo?.taxPaid}</span>
            </li>
            <li className="flex justify-start gap-x-5 text-gray-600  mb-1">
              <span>Envió:</span>
              <span>${order?.ship_cost}</span>
            </li>
            <li className="text-3xl font-bold border-t flex justify-start gap-x-5 mt-3 pt-3">
              <span>Total:</span>
              <span>${order?.paymentInfo?.amountPaid}</span>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default OneOrder;
