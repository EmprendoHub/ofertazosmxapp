'use client';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { AiOutlineUser } from 'react-icons/ai';
import { useSession } from 'next-auth/react';
import { resetPOSCart, savePOSOrder } from '@/redux/shoppingSlice';
import { useDispatch } from 'react-redux';
import Link from 'next/link';
import FormattedPrice from '@/backend/helpers/FormattedPrice';
import { revalidatePath } from 'next/cache';
import { toast } from 'react-toastify';

const POSPaymentForm = () => {
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const [amountReceived, setAmountReceived] = useState(0);
  const isLoggedIn = Boolean(session?.user);
  const { productsPOS, userInfo } = useSelector((state) => state.compras);

  const amountTotal = productsPOS?.reduce(
    (acc, cartItem) => acc + cartItem.quantity * cartItem.price,
    0
  );

  const layawayAmount = Number(amountTotal) * 0.3;

  const totalAmountCalc = Number(amountTotal);

  //=============================== Drawer Payment starts here ============================

  const handleCheckout = async (payType) => {
    if (totalAmountCalc > amountReceived) {
      toast.error('La cantidad que recibe es menor al total');
      return;
    }
    const response = await fetch(`/api/pos/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', PayType: `${payType}` },
      body: JSON.stringify({
        items: productsPOS,
        email: session?.user?.email,
        user: userInfo,
        amountReceived: amountReceived,
      }),
    });

    try {
      const data = await response.json();

      dispatch(savePOSOrder({ order: productsPOS, id: data.id }));
      dispatch(resetPOSCart());
      revalidatePath('/pos/carrito');
    } catch (error) {
      console.log(error);
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
    <section className="p-2 maxsm:py-7 bg-gray-100">
      <div className=" max-w-screen-xl mx-auto bg-white flex flex-col justify-between p-2">
        <h2 className="text-7xl font-EB_Garamond mb-4">Totales</h2>
        <ul className="mb-5">
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
            {/* <button
              onClick={() => handleCheckout('layaway')}
              className=" text-slate-100 bg-violet-950 mt-4 py-3 px-6 hover:bg-slate-200 hover:text-black duration-300 ease-in-out cursor-pointer w-full"
            >
              Apartar Artículos{' '}
            </button> */}
            <button
              onClick={() => handleCheckout('total')}
              className="bg-black w-full text-slate-100 mt-4 py-5 uppercase text-4xl px-6 hover:bg-slate-200 hover:text-black duration-300 ease-in-out cursor-pointer"
            >
              Pagar Total{' '}
            </button>

            <Link
              href="/pos/carrito"
              className="w-full mt-4 text-center px-5 py-2 inline-block text-gray-90 bg-slate-300 shadow-sm border border-gray-200 rounded-md hover:bg-gray-100 hover:text-black ease-in-out"
            >
              Regresar
            </Link>
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
        {/* <div className="trustfactor-class mx-auto">
          <Image
            src={'/images/stripe-badge-transparente.webp'}
            width={500}
            height={200}
            alt="Stripe Payment"
          />
        </div> */}
      </div>
    </section>
  );
};

export default POSPaymentForm;
