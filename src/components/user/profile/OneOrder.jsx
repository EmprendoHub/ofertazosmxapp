'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import FormattedPrice from '@/backend/helpers/FormattedPrice';
import { getOrderItemsQuantities, getTotalFromItems } from '@/backend/helpers';
import { loadStripe } from '@stripe/stripe-js';
import { useSelector } from 'react-redux';

const OneOrder = ({ id, data }) => {
  const order = data.order;
  const address = data.deliveryAddress;
  const { userInfo } = useSelector((state) => state.compras);

  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE__KEY);
  const handleCheckout = async () => {
    const stripe = await stripePromise;

    const response = await fetch(`/api/layaway`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        order: order,
        items: order?.orderItems,
        email: userInfo?.email,
        user: userInfo,
        shipping: address,
      }),
    });

    try {
      const data = await response.json();
      //console.log(data, '<= data');
      //dispatch(saveOrder({ order: productsData, id: data.id }));
      stripe?.redirectToCheckout({ sessionId: data.id });
    } catch (error) {
      console.log(error);
    }
  };

  function checkIfPaid(orderItems, orderAmountPaid) {
    // Use reduce to sum up the 'total' field
    const totalAmount = orderItems?.reduce(
      (acc, cartItem) => acc + cartItem.quantity * cartItem.price,
      0
    );

    if (Number(orderAmountPaid) >= Number(totalAmount)) {
      return 'pagado';
    } else return 'pendiente de pago';
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
    let sub = getTotalFromItems(order?.orderItems);
    return sub;
  }
  return (
    <>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg p-5">
        <div className="flex flex-row items-center justify-start gap-x-5">
          <h2 className="text-3xl mb-8 ml-4 font-bold ">
            Pedido #{order?.orderId}
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
                ID.
              </th>
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
                <td className="px-6 py-2">{item.product || item._id}</td>
                <td className="px-6 py-2">{item.quantity}</td>
                <td className="px-6 py-2">{item.name}</td>
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

      {order?.orderStatus === 'Apartado' ? (
        <div className="relative flex fle-row maxmd:flex-col overflow-x-auto shadow-md sm:rounded-lg p-5">
          <div className="w-1/3 maxmd:w-full">
            <div className="container max-w-screen-xl mx-auto bg-white flex flex-col justify-between p-2">
              <h2 className="text-2xl">Totales</h2>
              <ul className="mb-5">
                <li className="flex justify-between gap-x-5 text-gray-600  mb-1">
                  <span>Total de Artículos:</span>
                  <span className="text-green-700">
                    {getOrderItemsQuantities(order?.orderItems)} (Artículos)
                  </span>
                </li>
                <li className="flex justify-between gap-x-5 text-gray-600  mb-1">
                  <span>Sub-Total:</span>
                  <FormattedPrice amount={subtotal()} />
                </li>
                <li className="flex justify-between gap-x-5 text-gray-600  mb-1">
                  <span>Total:</span>
                  <FormattedPrice
                    amount={getTotalFromItems(order?.orderItems)}
                  />
                </li>
                <li className="text-xl font-bold border-t flex justify-between gap-x-5  pt-3">
                  <span>Abono:</span>
                  -<FormattedPrice amount={order?.paymentInfo?.amountPaid} />
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

            <button
              onClick={() => handleCheckout()}
              className="bg-black w-1/2 text-slate-100 mt-4 py-3 px-6 hover:bg-slate-200 hover:text-black duration-300 ease-in-out cursor-pointer"
            >
              Pagar Total{' '}
            </button>
            <p className="pt-5">
              Si realizaste un pago por Oxxo o Transferencia Bancaria
            </p>
            <p>
              Permite hasta 24 horas después de tu pago para que se refleje en
              tu cuenta.
            </p>
          </div>
        </div>
      ) : (
        <div className="relative flex fle-row maxmd:flex-col overflow-x-auto shadow-md sm:rounded-lg p-5">
          <div className="w-1/3 maxmd:w-full">
            <div className="container max-w-screen-xl mx-auto bg-white flex flex-col justify-between p-2">
              <ul className="mb-5">
                <li className="flex justify-between gap-x-5 text-gray-600  mb-1">
                  <span>Sub-Total:</span>
                  <FormattedPrice amount={subtotal()} />
                </li>
                <li className="flex justify-between gap-x-5 text-gray-600  mb-1">
                  <span>Total de Artículos:</span>
                  <span className="text-green-700">
                    {getOrderItemsQuantities(order?.orderItems)} (Artículos)
                  </span>
                </li>
                <li className="flex justify-between gap-x-5 text-gray-600  mb-1">
                  <span>Envió:</span>
                  <FormattedPrice amount={order?.ship_cost} />
                  (Gratis)
                </li>
                <li className="flex justify-between gap-x-5 text-gray-600  mb-1">
                  <span>Total:</span>
                  <FormattedPrice
                    amount={getTotalFromItems(order?.orderItems)}
                  />
                </li>
                <li className="text-xl font-bold text-green-700 border-t flex justify-between gap-x-5  pt-3">
                  <span>Pagado:</span>
                  <FormattedPrice amount={order?.paymentInfo?.amountPaid} />
                </li>
              </ul>
            </div>
          </div>
          <div className="w-2/3 maxmd:w-full flex justify-center items-center">
            <h3
              className={`text-5xl font-EB_Garamond uppercase  -rotate-12 ${
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
