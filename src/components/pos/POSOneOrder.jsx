'use client';
import FormattedPrice from '@/backend/helpers/FormattedPrice';

const POSOneOrder = ({ order }) => {
  const print = () => window.print();
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
    <div className="w-[300px] mx-auto relative bg-white p-5">
      <h2
        className={`text-5xl absolute z-40 -rotate-12 top-1/2 left-10 mb-8 ml-4 font-bold uppercase ${
          order?.paymentInfo?.status === 'paid'
            ? 'text-green-900 opacity-30'
            : ''
        }`}
      >
        {order?.paymentInfo?.amountPaid >= getTotal(order?.orderItems)
          ? 'PAGADO'
          : 'PENDIENTE'}
      </h2>
      <div className="flex flex-row justify-between items-center">
        <div className="pt-3 relative flex flex-col items-center justify-center max-w-fit">
          <h1 className="flex font-black font-EB_Garamond text-[1rem] maxmd:text-[1rem] leading-none">
            SHOPOUT
          </h1>
          <div className="flex flex-row items-center justify-center text-[10px]">
            <div>----</div>
            <p className="leading-none font-EB_Garamond">MX</p>
            <div>----</div>
          </div>
        </div>

        <div className="relative overflow-x-auto maxsm:rounded-lg maxsm:p-1">
          <div className=" flex flex-wrap  items-center justify-start gap-x-1 overflow-hidden  ">
            <p className="text-sm">RECIBO #</p>
            <h2 className="text-xl  font-bold text-slate-700 items-center">
              {order?.orderId}
            </h2>
          </div>
        </div>
      </div>
      <div className="text-xs text-slate-600 tracking-widest pb-3 border-b-2 border-slate-300">
        {order?.branch}
      </div>
      <div className="relative overflow-x-auto border-b-2 border-slate-300">
        <table className="w-full text-left">
          <thead className="text-xs text-gray-700 uppercase">
            <tr>
              <th scope="col" className="px-2 maxsm:px-0 py-3">
                #
              </th>
              <th scope="col" className="px-2 maxsm:px-0 py-3">
                Producto
              </th>

              <th scope="col" className="px-2 maxsm:px-0 py-3">
                Precio
              </th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {order?.orderItems?.map((item, index) => (
              <tr key={index}>
                <td className="px-2 maxsm:px-0 py-2">{item.quantity}</td>
                <td className="px-2 maxsm:px-0 py-2">
                  {item.name.substring(0, 14)}...
                </td>

                <td className="px-2 maxsm:px-0 py-2">
                  <FormattedPrice amount={item.price || 0} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="relative flex flex-row maxmd:flex-col items-center justify-start overflow-x-auto gap-12 ">
        <div className="w-full">
          <div className="container max-w-screen-xl mx-auto flex flex-col justify-between p-2">
            <h2 className="text-xl">Totales</h2>

            <ul className="mb-5 ">
              <li className="flex justify-between gap-x-5 text-gray-950  mb-1">
                <span className="text-sm">Sub-Total:</span>
                <span>
                  <FormattedPrice amount={subtotal() || 0} />
                </span>
              </li>
              <li className="flex justify-between gap-x-5 text-gray-950  mb-1">
                <span className="text-sm">Total de Artículos:</span>
                <span className="text-green-700">
                  {getQuantities(order?.orderItems)} (Artículos)
                </span>
              </li>
              <li className="flex justify-between gap-x-5 text-gray-950  mb-1">
                <span className="text-sm">IVA:</span>
                <span>
                  <FormattedPrice amount={order?.ship_cost || 0} />
                </span>
              </li>
              <li className="text-2xl font-bold border-t-2 border-slate-300  flex justify-between gap-x-5 mt-3 pt-3">
                <span>Total:</span>
                <span>
                  <FormattedPrice
                    amount={order?.paymentInfo?.amountPaid || 0}
                  />
                </span>
              </li>
            </ul>
            <div className="text-sm text-slate-600 tracking-wide text-center  border-t-2 border-slate-300 ">
              <p>Gracias por tu compra</p>
              <p>Para descuentos y especiales visita www.shopout.com.mx</p>
            </div>
          </div>
        </div>
      </div>
      <button
        className="bg-black text-white p-4 print:hidden mt-4"
        onClick={print}
      >
        Imprimir Recibo
      </button>
    </div>
  );
};

export default POSOneOrder;
