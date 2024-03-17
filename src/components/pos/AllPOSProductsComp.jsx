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
  const [selectAll, setSelectAll] = useState(false); // New state to track select all checkbox

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
      price: product?.variations[0].price,
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

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    setSelectedProducts(
      selectedProducts.map((product) => {
        dispatch(
          saveQRToPrint({
            id: product._id,
            name: product.name,
            price: product.variations[0].price,
          })
        );
        return {
          ...product,
          isSelected: !selectAll,
        };
      })
    );
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
            <tr className="flex flex-row items-center">
              <th>
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                />
              </th>
              <th
                scope="col"
                className="w-full px-6 maxsm:px-0 py-3 maxmd:hidden"
              >
                SKU
              </th>
              <th
                scope="col"
                className="w-full px-6 maxsm:px-0 py-3 maxsm:hidden"
              >
                Titulo
              </th>
              <th scope="col" className="w-full px-6 maxsm:px-0 py-3 ">
                Img
              </th>
              <th scope="col" className="w-full px-6 maxsm:px-0 py-3 ">
                Precio
              </th>
              <th scope="col" className="w-full px-1 py-3 ">
                Exst.
              </th>
            </tr>
          </thead>
          <tbody>
            {selectedProducts?.map((product, index) => (
              <tr
                className={`flex flex-row items-center ${
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
                <td className="w-full px-6 maxsm:px-2 py-0 maxmd:hidden">
                  {product._id.substring(0, 8)}...
                </td>
                <td
                  className={`w-full px-6 maxsm:px-0 py-0 font-bold maxsm:hidden`}
                >
                  {product.title}
                </td>
                <td className="w-full px-6 maxsm:px-0 py-0 relative">
                  <span className="relative flex items-center justify-center text-black w-20 h-20 maxsm:w-8 maxsm:h-8 shadow mt-2 overflow-hidden">
                    <Image
                      src={product?.images[0].url}
                      alt="Title"
                      width={200}
                      height={200}
                      className="w-20 object-cover h-20 maxsm:w-20 rounded-md "
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
                <td className="w-full px-6 maxsm:px-0 py-0 ">
                  <b>
                    <FormattedPrice amount={product?.variations[0].price} />
                  </b>
                </td>

                <td className="w-full px-1 py-0 ">{product.stock}</td>
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
