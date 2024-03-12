'use client';
import FormattedPrice from '@/backend/helpers/FormattedPrice';
import { useRef } from 'react';
import { Button } from 'react-bootstrap';
import { FaPrint } from 'react-icons/fa6';
import ReactToPrint from 'react-to-print';
import './PosStyles.css';

const POSReceiptOneOrder = ({ order }) => {
  const ref = useRef();

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

  function subtotal() {
    let sub = order?.paymentInfo?.amountPaid - order?.ship_cost;
    return sub;
  }

  return (
    <div
      ref={ref}
      className="main-receipt w-[300px] maxmd:w-full min-h-full mx-auto relative bg-white px-2"
    >
      <div className="flex flex-row justify-between items-center">
        <div className=" relative flex flex-col items-center justify-center max-w-fit">
          <h1 className="flex font-black font-EB_Garamond text-[1.5rem] maxmd:text-[1rem] leading-none">
            SHOPOUT
          </h1>
        </div>

        <div className=" flex flex-col  items-end justify-end gap-x-1 overflow-hidden  ">
          <h2 className="text-md font-bold text-slate-700 items-center">
            #{order?.orderId}
          </h2>
          <div className="text-xs text-slate-600 tracking-widest pb-1 border-b-2 border-slate-300">
            {order?.branch}
          </div>
        </div>
      </div>

      <div className="relative overflow-x-auto border-b-2 border-slate-300">
        <table className="w-full text-left">
          <thead className="text-xs text-gray-700 uppercase">
            <tr className="flex flex-row items-center justify-between">
              <th scope="col" className="px-2 maxsm:px-0 py-1">
                #
              </th>
              <th scope="col" className="px-2 maxsm:px-0 py-1">
                Producto
              </th>

              <th scope="col" className="px-2 maxsm:px-0 py-1">
                Precio
              </th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {order?.orderItems?.map((item, index) => (
              <tr
                key={index}
                className="flex flex-row items-center justify-between"
              >
                <td className="px-2 maxsm:px-0 pb-1">{item.quantity}</td>
                <td className="px-2 maxsm:px-0 pb-1">
                  {item.name.substring(0, 14)}...
                </td>

                <td className="px-2 maxsm:px-0 pb-1">
                  <FormattedPrice amount={item.price || 0} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="relative flex flex-row maxmd:flex-col items-center justify-start overflow-x-auto gap-3 ">
        <div className="w-full">
          <div className="container max-w-screen-xl mx-auto flex flex-col justify-between p-2">
            <ul className="mb-2 ">
              <li className="flex justify-between gap-x-5 text-gray-950">
                <span className="text-sm">Sub-Total:</span>
                <span>
                  <FormattedPrice amount={subtotal() || 0} />
                </span>
              </li>
              <li className="flex justify-between gap-x-5 text-gray-950">
                <span className="text-sm">Total de Artículos:</span>
                <span className="text-green-700">
                  {getQuantities(order?.orderItems)} (Artículos)
                </span>
              </li>
              <li className="flex justify-between gap-x-5 text-gray-950">
                <span className="text-sm">IVA:</span>
                <span>
                  <FormattedPrice amount={order?.ship_cost || 0} />
                </span>
              </li>
              <li className="text-xl font-bold border-t-2 border-slate-300  flex justify-between gap-x-1 pt-3">
                <span>Total:</span>
                <span>
                  <FormattedPrice
                    amount={order?.paymentInfo?.amountPaid || 0}
                  />
                </span>
              </li>
            </ul>
            <div className="text-xs text-slate-600 tracking-wide text-center  border-t-2 border-slate-300 ">
              <p>Gracias por tu compra</p>
              <p>Para descuentos y especiales visita www.shopout.com.mx</p>
            </div>
          </div>
        </div>
      </div>

      <ReactToPrint
        bodyClass="print-agreement"
        pageStyle="@page { size: 2.5in 4in }"
        documentTitle={`#${order?.orderId}`}
        content={() => ref.current}
        trigger={() => (
          <Button
            className="print-btn w-full bg-black text-white p-4 rounded-sm"
            type="primary"
            icon={<FaPrint />}
          >
            Imprimir Recibo
          </Button>
        )}
      />
    </div>
  );
};

export default POSReceiptOneOrder;
