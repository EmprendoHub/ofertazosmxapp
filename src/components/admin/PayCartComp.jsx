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
  const [phone, setPhoneNo] = useState('111-111-1111');
  const [email, setEmail] = useState('sucursal@shopout.com.mx');
  const [name, setName] = useState('CLIENTE EFECTIVO');
  const [savingPayment, setSavingPayment] = useState(false);

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
    formData.append('name', name);
    formData.append('phone', phone);
    formData.append('email', email);
    formData.append('transactionNo', transactionNo);
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
          <h1 className="text-2xl maxmd:text-5xl font-semibold text-black mb-4 font-EB_Garamond text-center uppercase">
            {payType === 'layaway' ? 'Apartar' : 'Pagar'}
          </h1>
          <div className="flex flex-col items-center gap-1">
            {validationError?.title && (
              <p className="text-sm text-red-400">
                {validationError.title._errors.join(', ')}
              </p>
            )}
            <div className="mb-4 text-center">
              <label className="block mb-1"> Referencia </label>
              <input
                type="text"
                className="appearance-none border bg-gray-100 rounded-md py-2 px-3 border-gray-300 focus:outline-none hover:outline-none focus:border-gray-400 hover:border-gray-400 w-full text-center font-bold "
                placeholder="8971654687687"
                onChange={(e) => setTransactionNo(e.target.value)}
                name="transactionNo"
              />
            </div>
            <div className="mb-4 text-center">
              <input
                type="text"
                className="appearance-none border bg-gray-100 rounded-md py-2 px-3 border-gray-300 focus:outline-none hover:outline-none focus:border-gray-400 hover:border-gray-400 w-full text-center font-bold "
                placeholder="Nombre de Cliente"
                onChange={(e) => setName(e.target.value)}
                name="name"
              />
            </div>
            <div className="mb-4 text-center">
              <input
                type="text"
                className="appearance-none border bg-gray-100 rounded-md py-2 px-3 border-gray-300 focus:outline-none hover:outline-none focus:border-gray-400 hover:border-gray-400 w-full text-center font-bold "
                placeholder="353 123 4512"
                onChange={(e) => setPhoneNo(e.target.value)}
                name="phone"
              />
            </div>
            <div className="mb-4 text-center">
              <input
                type="text"
                className="appearance-none border bg-gray-100 rounded-md py-2 px-3 border-gray-300 focus:outline-none hover:outline-none focus:border-gray-400 hover:border-gray-400 w-full text-center font-bold "
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                name="email"
              />
            </div>
            <div className="mb-4 text-center">
              <input
                type="text"
                placeholder="$0.00"
                value={amountReceived}
                onChange={(e) => handleAmountReceived(e.target.value)}
                className="text-5xl text-center outline-none w-full appearance-none border bg-gray-100 rounded-md py-2  border-gray-300 focus:outline-none focus:border-gray-400:outline-none focus:border-gray-400 hover:border-gray-400"
                name="amount"
              />
              {validationError?.amount && (
                <p className="text-sm text-red-400">
                  {validationError.amount._errors.join(', ')}
                </p>
              )}
            </div>
            {!savingPayment && (
              <div className="flex flex-row flex-wrap items-center gap-3">
                <div
                  onClick={() => setShowModal(false)}
                  className="my-2 px-4 py-2 text-center text-white bg-red-700 border border-transparent rounded-md hover:bg-red-800 w-full flex flex-row items-center justify-center gap-1 cursor-pointer"
                >
                  <FaCircleExclamation className="text-xl" />
                  Cancelar
                </div>
                <button
                  onClick={() =>
                    handleCheckout('layaway') && setSavingPayment(true)
                  }
                  className="my-2 px-4 py-2 text-center text-white bg-emerald-700 border border-transparent rounded-md hover:bg-emerald-900 w-full flex flex-row items-center justify-center gap-1"
                >
                  <FaCircleCheck className="text-xl" /> Procesar
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default PayCartComp;
