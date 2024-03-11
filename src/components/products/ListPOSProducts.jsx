'use client';
import React, { useEffect } from 'react';
import POSProductCard from './POSProductCard';

const ListPOSProducts = ({ products }) => {
  const filteredProducts = products.filter((product) => product.stock > 0);
  console.log(filteredProducts);
  return (
    <section className="py-12 mx-auto px-20 maxmd:px-2  flex flex-col justify-center items-center">
      <div className=" mx-auto flex justify-center items-center w-full">
        <div className="flex maxmd:flex-col flex-row  w-[90%]">
          <div className=" maxmd:w-full justify-center items-center gap-x-5">
            <main className=" grid grid-cols-5 maxlg:grid-cols-3 maxmd:grid-cols-2 maxsm:grid-cols-1 gap-8 ">
              {filteredProducts?.map((product, index) => (
                <POSProductCard item={product} key={index} />
              ))}
            </main>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ListPOSProducts;
