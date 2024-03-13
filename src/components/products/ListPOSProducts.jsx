'use client';
import POSSearch from '../layout/POSearch';
import POSProductCard from './POSProductCard';

const ListPOSProducts = ({ products }) => {
  const filteredProducts = products?.filter((product) => product.stock > 0);
  return (
    <section className="py-4 mx-auto maxlg:px-2 flex flex-col justify-center items-center">
      <div>
        <POSSearch />
      </div>

      <div className=" mx-auto flex justify-center items-center w-full">
        <div className="w-full justify-center items-center gap-x-5">
          <main className=" flex flex-row gap-4 flex-wrap items-center w-full pl-5">
            {filteredProducts?.map((product, index) => (
              <POSProductCard item={product} key={index} />
            ))}
          </main>
        </div>
      </div>
    </section>
  );
};

export default ListPOSProducts;
