'use client';
import React, { useEffect } from 'react';
import ProductCard from './ProductCard';
import MobileFilterComponet from './MobileFilterComponet';
import AdminPagination from '../pagination/AdminPagination';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const ListProducts = ({
  products,
  allBrands,
  allCategories,
  filteredProductsCount,
  per_page,
  start,
  end,
}) => {
  const { data: session } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (session?.user?.role === 'manager') {
      router.push('/admin');
    }
  }, [session?.user?.role]);

  return (
    <section className="py-12 mx-auto px-20 maxmd:px-2 mb-40 flex flex-col justify-center items-center">
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
      <div className=" mx-auto flex justify-center items-center w-full">
        <div className="flex maxmd:flex-col flex-row  w-[90%]">
          <div className=" maxmd:w-full justify-center items-center gap-x-5">
            <main className=" grid grid-cols-5 maxlg:grid-cols-3 maxmd:grid-cols-2 maxsm:grid-cols-1 gap-8 ">
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
