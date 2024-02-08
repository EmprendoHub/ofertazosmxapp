'use client';
import React, { useEffect } from 'react';
import Image from 'next/image';
import {
  decreaseQuantity,
  deleteProduct,
  increaseQuantity,
} from '@/redux/shoppingSlice';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { AiOutlineClose } from 'react-icons/ai';
import { toast } from 'react-toastify';
import CheckOutForm from './CheckOutForm';
import { useRouter } from 'next/navigation';

const Cart = () => {
  //import CartContext and assign to addItemToCart
  const { productsData } = useSelector((state) => state?.compras);
  const router = useRouter();
  const dispatch = useDispatch();
  if (productsData?.length <= 0) {
    router.replace('/tienda');
  }

  return (
    <>
      <section className="mt-5  bg-gray-100">
        <div className="max-w-screen-xl mx-auto px-4">
          <h2 className="text-3xl font-semibold mb-2 font-EB_Garamond">
            {productsData?.length || 0} Artículos(s) en el Carrito
          </h2>
        </div>
      </section>

      {productsData?.length > 0 && (
        <section className="pb-10 bg-gray-100">
          <div className="container max-w-screen-xl mx-auto bg-white p-5">
            <div className="flex flex-col md:flex-row gap-4">
              <main className="md:w-3/4">
                <article className="border border-gray-200  shadow-sm rounded mb-5 p-3 lg:p-5">
                  {productsData?.map((cartItem, index) => (
                    <div key={index}>
                      <div className="flex flex-wrap lg:flex-row gap-5  mb-4 items-center">
                        <div className="w-full lg:w-2/5 xl:w-2/4">
                          <figure className="flex leading-5">
                            <div>
                              <div className="block w-16 h-16 rounded border border-gray-200 overflow-hidden">
                                <Image
                                  src={cartItem?.images[0].url}
                                  alt="Title"
                                  width={100}
                                  height={100}
                                />
                              </div>
                            </div>
                            <figcaption className="ml-3">
                              <p>
                                <a
                                  href={`/producto/${cartItem?._id}`}
                                  className="hover:text-blue-600"
                                >
                                  {cartItem?.title}
                                </a>
                              </p>
                              <p className="mt-1 text-gray-400">
                                {' '}
                                Marca: {cartItem?.brand}
                              </p>
                            </figcaption>
                          </figure>
                        </div>
                        <div className="w-24">
                          <div className="flex items-center text-lg text-black  w-20 justify-between">
                            <span
                              onClick={() =>
                                dispatch(decreaseQuantity(cartItem))
                              }
                              className="cursor-pointer"
                            >
                              <FiChevronLeft />
                            </span>
                            <span>{cartItem?.quantity}</span>
                            <span
                              onClick={() =>
                                dispatch(increaseQuantity(cartItem))
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
                              ${cartItem?.price * cartItem?.quantity.toFixed(2)}
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
                                dispatch(deleteProduct(cartItem?._id))
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
                  <CheckOutForm />
                </article>
              </aside>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default Cart;
