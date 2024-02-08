'use client';
import { useEffect, useRef } from 'react';
import './productstyles.css';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import ProductCard from './ProductCard';
import { IoMdCart } from 'react-icons/io';
import FormattedPrice from '@/backend/helpers/FormattedPrice';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { calculatePercentage } from '@/backend/helpers';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/redux/shoppingSlice';
import { Bounce, toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

const ProductComponent = ({ product, trendingProducts }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const images = product?.images;
  const slideRef = useRef(null);

  useEffect(() => {
    if (slideRef.current) {
      appendClone();
    }
  }, [images]);

  const appendClone = () => {
    const lists = slideRef.current.querySelectorAll('.item');
    const lastItem = lists[lists.length - 1];

    slideRef.current.prepend(lastItem);
    if (lists.length > 1) {
      slideRef.current.prepend(lastItem.cloneNode(true));
      slideRef.current.removeChild(lists[lists.length - 1]);
    }
  };

  const moveNext = () => {
    const lists = slideRef.current.querySelectorAll('.item');
    const lastItem = lists[lists.length - 1];

    // Clone the last item
    const clonedItem = lastItem.cloneNode(true);

    // Add click event to the cloned item
    clonedItem.addEventListener('click', () =>
      clickImage(clonedItem.getAttribute('data-image-id'))
    );

    // Prepend the cloned item
    slideRef.current.prepend(clonedItem);

    if (lists.length > 1) {
      // Remove the last original item
      slideRef.current.removeChild(lists[lists.length - 1]);
    }
  };

  const movePrev = () => {
    const lists = slideRef.current.querySelectorAll('.item');
    const firstItem = lists[0];

    // Clone the first item
    const clonedItem = firstItem.cloneNode(true);

    // Add click event to the cloned item
    clonedItem.addEventListener('click', () =>
      clickImage(clonedItem.getAttribute('data-image-id'))
    );

    // Append the cloned item
    slideRef.current.appendChild(clonedItem);

    if (lists.length > 1) {
      // Remove the first original item
      slideRef.current.removeChild(firstItem);
    }
  };

  const clickImage = (imageId) => {
    const lists = slideRef.current.children;

    // Find the clicked item using imageId
    const clickedItem = Array.from(lists).find((item) => {
      const itemId = item.getAttribute('data-image-id');
      return itemId === imageId;
    });

    if (clickedItem && lists.length > 1) {
      // Reorder the items in the list
      slideRef.current.insertBefore(clickedItem, slideRef.current.firstChild);
    }
  };

  const handleClick = () => {
    dispatch(addToCart(product));
    toast.success(
      `${product?.title.substring(0, 15)}... se agrego al carrito`,
      {
        position: toast.POSITION.TOP_CENTER,
        className: 'foo-bar',
        theme: 'dark',
        transition: Bounce,
      }
    );
    router.push('/carrito');
  };

  return (
    <div className="container-class maxsm:py-8 h-full">
      <main className="bg-gray-100 flex min-h-screen flex-col items-center justify-between">
        <div className="w-full mx-auto wrapper-class gap-5 bg-slate-100 text-black bg-opacity-80 rounded-lg">
          <div className="flex flex-row maxsm:flex-col items-start justify-start gap-x-5 px-20 py-8 maxmd:py-4  maxsm:px-0">
            <div className="image-class w-1/2 maxsm:w-full flex flex-col items-center justify-center ">
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.7 }}
                className="p-2 w-full relative"
              >
                <h2 className="hidden maxsm:block maxlg:text-5xl font-semibold font-EB_Garamond mb-5">
                  BRAND
                </h2>
                <div className="container body  " ref={slideRef}>
                  {images.map((image, index) => (
                    <div
                      key={image._id}
                      data-image-id={image._id}
                      onClick={() => clickImage(image._id)}
                      className={`item cursor-pointer ${
                        index === 0 && 'active'
                      }`}
                      style={{
                        backgroundImage: `url('${image.url}')`,
                      }}
                    ></div>
                  ))}
                </div>

                <div className="buttons left-[10%] maxsm:left-[20%]">
                  <button id="prev" onClick={movePrev}>
                    <FaAngleLeft />
                  </button>
                  <button id="next" onClick={moveNext}>
                    <FaAngleRight />
                  </button>
                </div>
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
                  className="text-slate-600 description-class tracking-wider"
                >
                  {product?.description ? product?.description : ''}
                </motion.div>
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.7 }}
                  className="text-sm text-lightText flex flex-col"
                >
                  {product?.colors.length > 0 ? (
                    <span className="text-black">
                      Colores:{' '}
                      <select
                        className="block appearance-none border border-gray-300 bg-gray-100 rounded-md py-2 px-3 focus:outline-none focus:border-gray-400 w-full"
                        name="color"
                      >
                        {product?.colors.map((color, index) => (
                          <option key={index + 1} value={color?.value}>
                            {color?.value}
                          </option>
                        ))}
                      </select>
                    </span>
                  ) : (
                    <div className="grid maxxsm:grid-cols-1 maxmd:grid-cols-2 grid-cols-4 gap-4 mt-2">
                      {product?.colors?.map((color, index) => (
                        <p key={index} className="text-black">
                          {color.value}
                        </p>
                      ))}
                    </div>
                  )}
                  <span className="w-80 mt-5">
                    Tallas:{' '}
                    <select
                      className="block appearance-none border border-gray-300 bg-gray-100 rounded-md py-2 px-3 focus:outline-none focus:border-gray-400 w-full"
                      name="i_color-${index + 1}"
                    >
                      {product?.sizes.map((size, index) => (
                        <option key={index} value={size.value}>
                          {size.value}
                        </option>
                      ))}
                    </select>
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
                      className="bg-gold-gradient border border-black drop-shadow-md flex flex-row items-center justify-between px-6 py-3 text-sm gap-x-4 rounded-sm  bg-black text-white ease-in-out  duration-300 w-80 uppercase tracking-wider"
                      onClick={handleClick}
                    >
                      Agregar a carrito
                      <span className="text-xl text-slate-400 w-12 flex items-center justify-center group-hover:bg-black hover:text-white duration-200  rounded-full py-2">
                        <IoMdCart />
                      </span>
                    </motion.button>
                  )}
                </motion.div>
                <div className="flex flex-col">
                  <span>
                    SKU:{' '}
                    <span className=" font-bodyFont">
                      <b>{product?._id}</b>
                    </span>
                  </span>
                  <span>
                    Existencias:{' '}
                    <span className=" font-bodyFont">
                      <b>{product?.stock}</b>
                    </span>
                  </span>
                  <span>
                    Categoría:{' '}
                    <span className="t font-bodyFont">
                      <b>{product?.category}</b>
                    </span>
                  </span>
                  <span>
                    Genero:{' '}
                    <span className="t font-bodyFont">{product?.gender}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className=" maxsm:px-4 mb-10 mt-10 w-[90%] mx-auto h-full">
          <p className="text-5xl maxsm:text-4xl font-EB_Garamond pb-5 font-semibold">
            {'Productos destacados'}
          </p>
          <div className="grid maxxsm:grid-cols-1 maxmd:grid-cols-2 grid-cols-4 gap-4 mt-2">
            {trendingProducts?.map((product) => (
              <ProductCard key={product._id} item={product} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductComponent;
