import React from "react";
import ProductCard from "./ProductCard";
import { FaFilter } from "react-icons/fa";
import MobileFilterComponet from "./MobileFilterComponet";

const ListProducts = ({
  products,
  productsCount,
  allBrands,
  allCategories,
}) => {
  return (
    <section className='py-12 mx-auto px-20 maxmd:px-2 mb-40 flex flex-col justify-center items-center'>
      <MobileFilterComponet
        allBrands={allBrands}
        allCategories={allCategories}
      />
      {/* <div className="w-[90%] mb-10 bg-gray-200 flex flex-row items-center justify-between pr-5 py-5">
        <span className="flex flex-row items-center gap-2 pl-3 cursor-pointer">
          <FaFilter /> Filtrar
        </span>
        <span>Productos Disponibles: {productsCount}</span>
      </div> */}
      <div className=' mx-auto flex justify-center items-center w-full'>
        <div className='flex maxmd:flex-col flex-row  w-[90%]'>
          <div className=' maxmd:w-full justify-center items-center gap-x-5'>
            <main className=' grid grid-cols-5 maxlg:grid-cols-3 maxmd:grid-cols-2 maxsm:grid-cols-1 gap-8 '>
              {products?.map((product, index) => (
                <ProductCard item={product} key={index} />
              ))}
            </main>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ListProducts;
