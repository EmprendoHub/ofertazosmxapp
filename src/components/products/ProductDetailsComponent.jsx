'use client';
import React, { useRef } from 'react';
import { IoMdCart } from 'react-icons/io';
import { Bounce, toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/redux/shoppingSlice';
import { IoIosStar } from 'react-icons/io';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import FormattedPrice from '@/backend/helpers/FormattedPrice';
import { calculatePercentage } from '@/backend/helpers';

const ProductDetailsComponent = ({ product }) => {
  const router = useRouter();
  const imageRef = useRef(null);
  const dispatch = useDispatch();

  return (
    <div className="container-class maxsm:py-8">
      <main className="bg-gray-100 flex min-h-screen flex-col items-center justify-between">
        <div className="w-full mx-auto wrapper-class gap-5 bg-slate-100 text-black bg-opacity-80 p-4 rounded-lg">
          <div className="flex flex-row maxsm:flex-col-reverse items-start justify-start gap-x-5 px-20 py-8 maxmd:py-4 maxmd:px-5 maxsm:px-0">
            <div className="image-class w-1/2 maxsm:w-full flex flex-col items-end justify-end">
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.7 }}
                className="p-2 w-[70%] relative"
              >
                <Image
                  ref={imageRef}
                  src={
                    product?.images[0]
                      ? product.images[0].url
                      : '/images/vw_GTI_2024_2.jpg'
                  }
                  alt="product image"
                  className="rounded-lg object-cover ease-in-out duration-500"
                  width={800}
                  height={800}
                />
              </motion.div>
            </div>
            <div className="description-class w-1/2 maxsm:w-full h-full ">
              <div className="flex flex-col items-start justify-start pt-10 maxsm:pt-2 gap-y-10 w-[90%] maxmd:w-full p-5 pb-10">
                <motion.div
                  initial={{ x: 50, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <p className="text-5xl maxlg:text-3xl font-semibold font-EB_Garamond">
                    {product?.brand}
                  </p>
                  <div className="text-xl font-normal s">
                    <div className="flex items-center gap-x-1">
                      <span className="font-base text-xl">
                        {product?.title}
                      </span>
                    </div>
                  </div>
                  {product?.sale_price ? (
                    <div className="flex flex-row items-center justify-between">
                      <div className="border-[1px] border-yellow-600 w-fit py-1 px-4 rounded-full text-xs text-black">
                        <p>
                          {calculatePercentage(
                            product?.price,
                            product?.sale_price
                          )}
                          % menos
                        </p>
                      </div>
                      <div className="flex items-center gap-x-2">
                        <p className="line-through text-sm text-gray-600 font-bodyFont">
                          <FormattedPrice amount={product?.price} />
                        </p>
                      </div>
                    </div>
                  ) : (
                    ''
                  )}
                  <div>
                    <p className="font-semibold text-4xl text-black font-bodyFont">
                      {product?.sale_price > 0 ? (
                        <FormattedPrice amount={product?.sale_price} />
                      ) : product?.price > 0 ? (
                        <FormattedPrice amount={product?.price} />
                      ) : (
                        ''
                      )}
                    </p>
                    <p className="text-xs font-normal text-gray-600">
                      Apártalo con solo 30%:
                    </p>
                    <p className="text-xl text-black font-bodyFont">
                      <FormattedPrice amount={product?.price * 0.3} />
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  className=" font-bodyFont description-class"
                >
                  {product?.description ? product?.description : ''}
                </motion.div>
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.7 }}
                  className="text-sm text-lightText flex flex-col"
                >
                  <span>
                    SKU: <span className=" font-bodyFont">{product?._id}</span>
                  </span>
                  <span>
                    Existencias:{' '}
                    <span className=" font-bodyFont">{product?.stock}</span>
                  </span>
                  <span>
                    Categoría:{' '}
                    <span className="t font-bodyFont">{product?.category}</span>
                  </span>
                  <span>
                    Marca:{' '}
                    <span className="t font-bodyFont">{product?.brand}</span>
                  </span>
                  <span>
                    Genero:{' '}
                    <span className="t font-bodyFont">{product?.gender}</span>
                  </span>
                  <span>
                    Colores:{' '}
                    {product?.colors.map((color, index) => (
                      <span key={index} className="t font-bodyFont">
                        {color?.value},
                      </span>
                    ))}
                  </span>
                  <span>
                    Tallas:{' '}
                    {product?.sizes.map((size, index) => (
                      <span key={index} className="t font-bodyFont">
                        {size?.value},
                      </span>
                    ))}
                  </span>
                </motion.div>
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  className="flex items-center cursor-pointer group"
                >
                  {/* add to cart button */}
                  {product?.stock <= 0 ? (
                    <span className="  border-[1px] border-black font-medium text-xl py-1 px-3 rounded-sm bg-black text-slate-100 ">
                      SOLD OUT
                    </span>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.07 }}
                      whileTap={{ scale: 0.9 }}
                      className="bg-gold-gradient border border-black drop-shadow-md flex flex-row items-center justify-between px-4 py-2 text-sm gap-x-4 tracking-wide rounded-full text-black hover:bg-darkText ease-in-out  duration-500"
                      onClick={() =>
                        dispatch(addToCart(product)) &&
                        toast.success(
                          `${product?.title.substring(
                            0,
                            15
                          )}... se agrego al carrito`,
                          {
                            position: toast.POSITION.TOP_CENTER,
                            className: 'foo-bar',
                            theme: 'dark',
                            transition: Bounce,
                          }
                        ) &&
                        router.push('/carrito')
                      }
                    >
                      Agregar a carrito
                      <span className="text-xl text-slate-400 w-12 flex items-center justify-center group-hover:bg-black hover:text-white duration-200  rounded-full py-2">
                        <IoMdCart />
                      </span>
                    </motion.button>
                  )}
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetailsComponent;
