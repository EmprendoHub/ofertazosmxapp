'use client';
import React from 'react';
import Image from 'next/image';
import {
  decreasePOSQuantity,
  deletePOSProduct,
  increasePOSQuantity,
} from '@/redux/shoppingSlice';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { AiOutlineClose } from 'react-icons/ai';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import POSCheckOutForm from './POSCheckOutForm';

const POSCart = () => {
  //import CartContext and assign to addItemToCart
  const { productsPOS } = useSelector((state) => state?.compras);
  const router = useRouter();
  const dispatch = useDispatch();
  // if (productsPOS?.length <= 0) {
  //   router.replace('/pos/qr');
  // }
  console.log(productsPOS, 'productsPOS');
  return (
    <>
      <section className="mt-5  bg-gray-100">
        <div className="max-w-screen-xl mx-auto px-4">
          <h2 className="text-3xl font-semibold mb-2 font-EB_Garamond">
            {productsPOS?.length || 0} Artículos(s) en el Carrito
          </h2>
        </div>
      </section>

      {productsPOS?.length > 0 && (
        <section className="pb-10 bg-gray-100">
          <div className="container max-w-screen-xl mx-auto bg-white p-5">
            <div className="flex flex-col md:flex-row gap-4">
              <main className="md:w-3/4">
                <article className="border border-gray-200  shadow-sm rounded p-3 lg:p-5"></article>
                {/* Items */}
                <article className="border border-gray-200  shadow-sm rounded mb-5 p-3 lg:p-5">
                  {productsPOS?.length > 0 &&
                    productsPOS?.map((cartItem, index) => (
                      <div key={index}>
                        <div className="flex flex-wrap lg:flex-row gap-5  mb-4 items-center">
                          <div className="w-full lg:w-2/5 xl:w-2/4">
                            <figure className="flex gap-3 leading-5">
                              <div>
                                <div className="block w-16 h-16 rounded border border-gray-200 overflow-hidden">
                                  <Image
                                    src={cartItem?.image}
                                    alt="Title"
                                    width={100}
                                    height={100}
                                  />
                                </div>
                              </div>
                              <figcaption className="ml-3">
                                <p>{cartItem?.title}</p>
                                <p className="mt-1 text-gray-400">
                                  {' '}
                                  Marca: {cartItem?.brand}
                                </p>
                              </figcaption>
                              <div>{cartItem.color}</div>
                              <div>{cartItem.size}</div>
                            </figure>
                          </div>
                          <div className="w-24">
                            <div className="flex items-center text-lg text-black  w-20 justify-between">
                              <span
                                onClick={() =>
                                  dispatch(decreasePOSQuantity(cartItem))
                                }
                                className="cursor-pointer"
                              >
                                <FiChevronLeft />
                              </span>
                              <span>{cartItem?.quantity || 1}</span>
                              <span
                                onClick={() =>
                                  dispatch(increasePOSQuantity(cartItem))
                                }
                                className="cursor-pointer"
                              >
                                <FiChevronRight />
                              </span>
                            </div>
                          </div>
                          <div>
                            <div className="leading-5">
                              <p className="font-semibold not-italic">
                                $
                                {cartItem?.price *
                                  cartItem?.quantity?.toFixed(2) || 1}
                              </p>
                              <small className="text-gray-400">
                                {' '}
                                ${cartItem?.price} / por articulo{' '}
                              </small>
                            </div>
                          </div>
                          <div className="flex-auto">
                            <div className="float-right">
                              <span
                                onClick={() =>
                                  dispatch(deletePOSProduct(cartItem?._id))
                                }
                                className="text.lg hover:text-red-600 cursor-pointer duration-300"
                              >
                                <AiOutlineClose />
                              </span>
                            </div>
                          </div>
                        </div>

                        <hr className="my-4" />
                      </div>
                    ))}
                </article>
              </main>
              <aside className="md:w-1/4">
                <article className="border border-gray-200 bg-white shadow-sm rounded mb-5 p-1">
                  <POSCheckOutForm />
                </article>
              </aside>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default POSCart;
