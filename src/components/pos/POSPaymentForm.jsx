'use client';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { AiOutlineUser } from 'react-icons/ai';
import { useSession } from 'next-auth/react';
import { resetPOSCart, savePOSOrder } from '@/redux/shoppingSlice';
import { useDispatch } from 'react-redux';
import Link from 'next/link';
import FormattedPrice from '@/backend/helpers/FormattedPrice';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { payPOSDrawer } from '@/app/_actions';

const POSPaymentForm = () => {
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const router = useRouter();

  const isLoggedIn = Boolean(session?.user);
  const { productsPOS } = useSelector((state) => state.compras);
  const [validationError, setValidationError] = useState(null);
  const amountTotal = productsPOS?.reduce(
    (acc, cartItem) => acc + cartItem.quantity * cartItem.price,
    0
  );

  const layawayAmount = Number(amountTotal) * 0.3;

  const totalAmountCalc = Number(amountTotal);
  const [amountReceived, setAmountReceived] = useState(totalAmountCalc);

  //=============================== Drawer Payment starts here ============================

  const handleCheckout = async (payType) => {
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
      router.push('/admin/pedidos');
    }
  };

  const handleAmountReceived = async (inputValue) => {
    // Replace any non-digit characters with an empty string
    const sanitizedValue = inputValue.replace(/\D/g, '');
    // Convert the sanitized value to an integer
    const integerValue = parseInt(sanitizedValue);
    // If the input is not empty and the parsed integer is a valid whole number,
    // update the state with the integer value, otherwise update with an empty string
    setAmountReceived(isNaN(integerValue) ? '' : integerValue);
  };

  //=============================== Stripe Payment ends here ============================
  return (
    <div className="max-w-full p-2 maxsm:py-7 bg-gray-100">
      <div className=" mx-auto bg-white flex flex-col justify-between p-2">
        <h2 className="text-5xl font-EB_Garamond mb-4">Totales</h2>
        {validationError?.title && (
          <p className="text-sm text-red-400">
            {validationError.title._errors.join(', ')}
          </p>
        )}
        <ul className="mb-5 max-w-full">
          <li className="flex justify-between text-gray-600  mb-2 text-2xl">
            <span>Sub-Total:</span>
            <span>
              <FormattedPrice amount={amountTotal} />
            </span>
          </li>
          <li className="flex justify-between text-gray-600  mb-2 text-xl">
            <span>Total de Artículos:</span>
            <span className="text-orange-600">
              {productsPOS?.reduce(
                (acc, cartItem) => acc + cartItem.quantity,
                0
              )}
              (Artículos)
            </span>
          </li>
          <li>
            <div className="border-b-[1px] border-b-slate-300 py-2">
              <div className="flex items-center justify-between">
                <p className=" font-medium  font-EB_Garamond">IVA</p>
                <p>
                  <FormattedPrice amount={0} />
                </p>
              </div>
            </div>
          </li>
          <li>
            <div className="border-b-[1px] border-b-slate-300 py-2">
              <div className="flex items-center justify-between">
                <p className=" font-medium  font-EB_Garamond">
                  Apártalo por solo
                </p>
                <p>
                  <FormattedPrice amount={layawayAmount} />
                </p>
              </div>
            </div>
          </li>
          <li className=" font-bold border-t flex justify-between mt-3 pt-3  text-4xl">
            <span>Total:</span>
            <span>
              <FormattedPrice amount={totalAmountCalc} />
            </span>
          </li>
        </ul>

        {isLoggedIn ? (
          <div className="flex flex-col items-center gap-1">
            <p>Ingresa la cantidad que se recibe:</p>
            <input
              type="text"
              placeholder="$0.00"
              value={amountReceived}
              onChange={(e) => handleAmountReceived(e.target.value)}
              className="text-7xl text-center outline-none"
            />
            <button
              onClick={() => handleCheckout('layaway')}
              className="text-4xl text-slate-100 bg-violet-950 mt-4 py-3 px-6 hover:bg-slate-200 hover:text-black duration-300 ease-in-out cursor-pointer w-full"
            >
              Apartar Artículos{' '}
            </button>
            <button
              onClick={() => handleCheckout('total')}
              className="bg-black w-full text-slate-100 mt-4 py-5 uppercase text-4xl px-6 hover:bg-slate-200 hover:text-black duration-300 ease-in-out cursor-pointer"
            >
              Pagar Total{' '}
            </button>
          </div>
        ) : (
          <div>
            {/** Login/Register */}
            {!session && (
              <>
                <Link href={'/iniciar'}>
                  <div className=" w-1/4 maxmd:w-2/3 sm:w-full bg-black text-slate-100 mt-4 py-3 px-6 hover:bg-green-600 duration-500 cursor-pointer">
                    <div className="flex flex-row justify-center items-center gap-x-3 ">
                      <AiOutlineUser className="text-ld" />
                      <p className="text-sm font-base">Iniciar/Registro</p>
                    </div>
                  </div>
                </Link>
              </>
            )}
            <p className="text-sm mt-1 text-red-600 py-2">
              Por favor inicie sesión para continuar
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default POSPaymentForm;
