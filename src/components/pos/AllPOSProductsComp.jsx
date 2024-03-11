'use client';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { saveQRToPrint } from '@/redux/shoppingSlice';
import POSProductSearch from '../layout/POSProductSearch';
import FormattedPrice from '@/backend/helpers/FormattedPrice';
import { FaStar } from 'react-icons/fa6';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

const AllPOSProductsComp = ({ products, filteredProductsCount }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { qrListData } = useSelector((state) => state.compras);
  const [selectedProducts, setSelectedProducts] = useState([]);
  useEffect(() => {
    // Map through qrListData and extract only the ids
    const qrIds = qrListData.map((data) => data.id);

    // Filter through products and update the selectedProducts state array
    const updatedSelectedProducts = products.map((product) => ({
      ...product,
      isSelected: qrIds.includes(product._id),
    }));

    setSelectedProducts(updatedSelectedProducts);
  }, [qrListData, products]);

  const handleCheckBox = (product) => {
    // If the product with the same ID doesn't exist, add it to the list
    const receiver = {
      id: product?._id,
      name: product?.name,
    };
    dispatch(saveQRToPrint(receiver));
  };

  const handleGenerateQR = () => {
    if (pathname.includes('admin')) {
      router.push('/admin/pos/qr/generador');
    } else {
      router.push('/puntodeventa/qr/generador');
    }
  };

  return (
    <>
      <hr className="my-4" />
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <div className=" flex flex-row maxsm:flex-col maxsm:items-start items-center justify-between">
          <h1 className="text-2xl mb-5 ml-1 font-bold font-EB_Garamond">
            {`${filteredProductsCount} Productos Con Existencias`}
          </h1>
          <POSProductSearch />
        </div>
        <button className="bg-black text-white p-4" onClick={handleGenerateQR}>
          Generar QRs
        </button>
        <table className="w-full text-sm  text-left">
          <thead className="text-l text-gray-700 uppercase">
            <tr>
              <th></th>

              <th scope="col" className="px-6 maxsm:px-0 py-3 maxmd:hidden">
                SKU
              </th>
              <th scope="col" className="px-6 maxsm:px-0 py-3 maxsm:hidden">
                Titulo
              </th>
              <th scope="col" className="px-6 maxsm:px-0 py-3 maxmd:hidden">
                slug
              </th>
              <th scope="col" className="px-6 maxsm:px-0 py-3 ">
                Precio
              </th>
              <th scope="col" className="px-6 maxsm:px-0 py-3 ">
                Img
              </th>
              <th scope="col" className="px-1 py-3 ">
                Exst.
              </th>
            </tr>
          </thead>
          <tbody>
            {selectedProducts?.map((product, index) => (
              <tr
                className={` ${
                  product?.active === true
                    ? 'bg-slate-100'
                    : 'bg-slate-200 text-slate-400'
                }`}
                key={index}
              >
                <td>
                  <input
                    type="checkbox"
                    id={product._id}
                    checked={product.isSelected} // Bind the checked attribute based on isSelected
                    onChange={() => handleCheckBox(product)}
                  />
                </td>
                <td className="px-6 maxsm:px-2 py-2 maxmd:hidden">
                  {product._id.substring(0, 10)}...
                </td>
                <td className={`px-6 maxsm:px-0 py-2 font-bold maxsm:hidden`}>
                  {product.title.substring(0, 15)}
                </td>
                <td className="px-6 maxsm:px-2 py-2 maxmd:hidden">
                  {product.slug.substring(0, 10)}...
                </td>

                <td className="px-6 maxsm:px-0 py-2 ">
                  <b>
                    <FormattedPrice amount={product?.variations[0].price} />
                  </b>
                </td>
                <td className="px-6 maxsm:px-0 py-2 relative ">
                  <span className="relative flex items-center justify-center text-black w-12 h-12 maxsm:w-8 maxsm:h-8 shadow mt-2">
                    <Image
                      src={product?.images[0].url}
                      alt="Title"
                      width={100}
                      height={100}
                      className="w-10 h-auto maxsm:w-10 "
                    />
                    {product?.featured === 'Si' ? (
                      <span className="absolute -top-3 -right-1 z-20">
                        <FaStar className="text-xl text-amber-600" />
                      </span>
                    ) : (
                      ''
                    )}
                  </span>
                </td>
                <td className="px-1 py-2 ">{product.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <hr className="my-4" />
    </>
  );
};

export default AllPOSProductsComp;
