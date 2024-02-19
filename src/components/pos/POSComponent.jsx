'use client';
import React, { useEffect, useRef, useState } from 'react';
import { ComponentToPrint } from './ComponentToPrint';
import { useReactToPrint } from 'react-to-print';
import { useDispatch, useSelector } from 'react-redux';
import { addToPOSCart, deletePOSProduct } from '@/redux/shoppingSlice';
import Image from 'next/image';
import POSCheckOutForm from './POSCheckOutForm';

function POSComponent({ products }) {
  const { productsPOS } = useSelector((state) => state?.compras);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const addProductToCart = async (product) => {
    // check if the adding product exist
    dispatch(addToPOSCart(product));
  };

  const removeProduct = async (product) => {
    dispatch(deletePOSProduct(product._id));
  };

  const componentRef = useRef();

  const handleReactToPrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const handlePrint = () => {
    handleReactToPrint();
  };

  return (
    <>
      <div style={{ display: 'none' }}>
        <ComponentToPrint />
      </div>
      <div className="flex flex-row items-center">
        <div className="w-full">
          {isLoading ? (
            'Loading'
          ) : (
            <div className="flex flex-wrap gap-3">
              {products.map((product, key) => (
                <div key={key} className="col-lg-4 mb-4">
                  <div
                    className="px-3 border cursor-pointer"
                    onClick={() => addProductToCart(product)}
                  >
                    <Image
                      src={product.variations[0].image}
                      className="img-fluid"
                      alt={product.title}
                      width={250}
                      height={250}
                    />
                    <p className="relative">{product.title}</p>
                    <p>${product.variations[0].price}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="">
          <div className="flex flex-col items-start justify-start p-5  w-full">
            <div className="table-responsive bg-dark relative w-full">
              <table className="table  w-full table-dark table-hover pl-5">
                <thead>
                  <tr className="w-full flex flex-row items-center justify-between gap-4">
                    <td>Name</td>
                    <td>Price</td>
                    <td>Qty</td>
                    <td>Total</td>
                    <td>Action</td>
                  </tr>
                </thead>
                <tbody>
                  {productsPOS
                    ? productsPOS.map((cartProduct, key) => (
                        <tr key={key}>
                          <td>{cartProduct.title}</td>
                          <td>{cartProduct.variations[0].price}</td>
                          <td>{cartProduct.variations[0].quantity}</td>
                          <td>
                            {cartProduct.variations[0].price *
                              cartProduct.quantity}
                          </td>
                          <td>
                            <button
                              className="btn btn-danger btn-sm bg-red-500 text-white px-3"
                              onClick={() => removeProduct(cartProduct)}
                            >
                              x
                            </button>
                          </td>
                        </tr>
                      ))
                    : 'No Item in Cart'}
                </tbody>
              </table>
              <h2 className="px-2 text-white">Total Amount: $0</h2>
            </div>

            <div className="relative">
              <POSCheckOutForm />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default POSComponent;
