'use client';
import React, { useState } from 'react';
import { payPOSDrawer } from '@/app/_actions';
import { toast } from 'react-toastify';
import { FaCircleCheck, FaCircleExclamation } from 'react-icons/fa6';
import { resetPOSCart, savePOSOrder } from '@/redux/shoppingSlice';
import { useDispatch, useSelector } from 'react-redux';
import { usePathname, useRouter } from 'next/navigation';

const PayCartComp = ({ setShowModal, payType }) => {
  const getPathname = usePathname();
  let pathname;
  if (getPathname.includes('admin')) {
    pathname = 'admin';
  } else if (getPathname.includes('puntodeventa')) {
    pathname = 'puntodeventa';
  }
  const dispatch = useDispatch();
  const router = useRouter();
  const [transactionNo, setTransactionNo] = useState('EFECTIVO');
  const [amount, setAmount] = useState(0);

  const { productsPOS } = useSelector((state) => state.compras);
  const [validationError, setValidationError] = useState(null);
  const amountTotal = productsPOS?.reduce(
    (acc, cartItem) => acc + cartItem.quantity * cartItem.price,
    0
  );

  const layawayAmount = Number(amountTotal) * 0.3;

  const totalAmountCalc = Number(amountTotal);
  let amountPlaceHolder;
  if (payType === 'layaway') {
    amountPlaceHolder = layawayAmount;
  } else {
    amountPlaceHolder = totalAmountCalc;
  }
  const [amountReceived, setAmountReceived] = useState(amountPlaceHolder);

  const handleAmountReceived = async (inputValue) => {
    // Replace any non-digit characters with an empty string
    const sanitizedValue = inputValue.replace(/\D/g, '');
    // Convert the sanitized value to an integer
    const integerValue = parseInt(sanitizedValue);
    // If the input is not empty and the parsed integer is a valid whole number,
    // update the state with the integer value, otherwise update with an empty string
    setAmountReceived(isNaN(integerValue) ? '' : integerValue);
  };

  const handleCheckout = async () => {
    if (payType === 'layaway') {
      if (!amountReceived || layawayAmount > amountReceived) {
        toast.error(
          'La cantidad que recibe es menor al minino de 30% que se require para apartar este pedido'
        );
        return;
      }
    } else {
      if (!amountReceived || totalAmountCalc > amountReceived) {
        toast.error('La cantidad que recibe es menor al total');
        return;
      }
    }

    const formData = new FormData();
    const items = JSON.stringify(productsPOS);
    formData.append('items', items);
    formData.append('amountReceived', amountReceived);
    formData.append('payType', payType);
    const result = await payPOSDrawer(formData);
    if (result?.error) {
      console.log(result?.error);
      setValidationError(result.error);
    } else {
      const order = await JSON.parse(result.newOrder);
      setValidationError(null);
      dispatch(savePOSOrder({ order: order }));
      dispatch(resetPOSCart());
      setAmountReceived(0);
      router.push(`/${pathname}/pedidos`);
    }
  };

  return (
    <div className="flex flex-col w-full h-full items-center justify-center">
      <div className="w-1/2 maxmd:w-5/6 bg-white pl-4">
        <section className=" p-6 w-full">
          <h1 className="text-2xl maxmd:text-5xl font-semibold text-black mb-8 font-EB_Garamond text-center">
            Recibir Pago
          </h1>
          <div className="flex flex-col items-center gap-1">
            {validationError?.title && (
              <p className="text-sm text-red-400">
                {validationError.title._errors.join(', ')}
              </p>
            )}
            <div className="mb-4 text-center">
              <label className="block mb-1"> Numero de Transacción </label>
              <input
                type="text"
                className="appearance-none border bg-gray-100 rounded-md py-2 px-3 border-gray-300 focus:outline-none hover:outline-none focus:border-gray-400 hover:border-gray-400 w-full text-center font-bold "
                placeholder="EFECTIVO o 654687687"
                value={transactionNo}
                onChange={(e) => setTransactionNo(e.target.value)}
                name="transactionNo"
              />
            </div>
            <div className="mb-4 text-center">
              <label className="block mb-1">
                Ingresa la cantidad que se recibe:{' '}
              </label>
              <input
                type="text"
                placeholder="$0.00"
                value={amountReceived}
                onChange={(e) => handleAmountReceived(e.target.value)}
                className="text-7xl text-center outline-none w-full appearance-none border bg-gray-100 rounded-md py-2 px-3 border-gray-300 focus:outline-none focus:border-gray-400:outline-none focus:border-gray-400 hover:border-gray-400"
                name="amount"
              />
              {validationError?.amount && (
                <p className="text-sm text-red-400">
                  {validationError.amount._errors.join(', ')}
                </p>
              )}
            </div>
            <div className="flex flex-row items-center gap-3">
              <div
                onClick={() => setShowModal(false)}
                className="my-2 px-4 py-2 text-center text-white bg-red-700 border border-transparent rounded-md hover:bg-red-800 w-full flex flex-row items-center justify-center gap-1 cursor-pointer"
              >
                <FaCircleExclamation className="text-xl" />
                Cancelar
              </div>
              <button
                onClick={() => handleCheckout('layaway')}
                className="my-2 px-4 py-2 text-center text-white bg-emerald-700 border border-transparent rounded-md hover:bg-emerald-900 w-full flex flex-row items-center justify-center gap-1"
              >
                <FaCircleCheck className="text-xl" /> Procesar
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PayCartComp;
