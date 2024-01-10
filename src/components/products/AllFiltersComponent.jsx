import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AiOutlineClose } from 'react-icons/ai';
import styles from './boxfilterstyle.module.scss';
import { getPriceQueryParams } from '@/backend/helpers';
import Search from '../layout/Search';

const AllFiltersComponent = ({
  allBrands,
  allCategories,
  SetIsActive,
  isActive,
}) => {
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const router = useRouter();
  let queryParams;

  function handleClick(checkbox) {
    if (typeof window !== 'undefined') {
      queryParams = new URLSearchParams(window.location.search);
    }

    const checkboxes = document.getElementsByName(checkbox.name);

    checkboxes.forEach((item) => {
      if (item !== checkbox) item.checked = false;
    });

    if (checkbox.checked === false) {
      //delete filter
      queryParams.delete(checkbox.name);
    } else {
      //set query filter
      if (queryParams.has(checkbox.name)) {
        queryParams.set(checkbox.name, checkbox.value);
      } else {
        queryParams.append(checkbox.name, checkbox.value);
        SetIsActive(!isActive);
      }
    }
    const path = window.location.pathname + '?' + queryParams.toString();
    router.push(path);
  }

  function checkHandler(checkBoxType, checkBoxValue) {
    if (typeof window !== 'undefined') {
      queryParams = new URLSearchParams(window.location.search);

      const value = queryParams.get(checkBoxType);
      if (checkBoxValue === value) {
        return true;
      }
      return false;
    }
  }

  function handlePriceButtonClick() {
    if (typeof window !== 'undefined') {
      queryParams = new URLSearchParams(window.location.search);

      queryParams = getPriceQueryParams(queryParams, 'min', minAmount);
      queryParams = getPriceQueryParams(queryParams, 'max', maxAmount);

      const path = window.location.pathname + '?' + queryParams.toString();
      SetIsActive(!isActive);
      router.push(path);
    }
  }

  return (
    <>
      <aside>
        <div
          className={` burger-class flex flex-row text-gray-600 items-center absolute right-1 top-1 cursor-pointer p-4`}
        >
          <div
            onClick={() => {
              SetIsActive(!isActive);
            }}
            className={'button-class'}
          >
            <AiOutlineClose />
          </div>
        </div>
        <div className=" mb-2  w-full text-center px-4 py-2 inline-block text-lg text-gray-200 bg-black shadow-sm border border-gray-200 rounded-md ">
          Filtrar por
        </div>
        {/* Search Filter */}

        <Search />
        {/* Price Filter */}

        <div className="flex flex-col px-6 py-4 border border-gray-200 bg-white rounded shadow-sm">
          <h3 className="font-semibold mb-2 text-black">Precio ($)</h3>

          <div className="grid maxsm:grid-cols-3 gap-x-2 text-black">
            <div className="mb-4">
              <input
                name="min"
                className="appearance-none border border-gray-200 bg-gray-100 rounded-md py-2 px-3 hover:border-gray-400 focus:outline-none focus:border-gray-400 w-full"
                type="number"
                placeholder="Min"
                value={minAmount}
                onChange={(e) => setMinAmount(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <input
                name="max"
                className="appearance-none border border-gray-200 bg-gray-100 rounded-md py-2 px-3 hover:border-gray-400 focus:outline-none focus:border-gray-400 w-full"
                type="number"
                placeholder="Max"
                value={maxAmount}
                onChange={(e) => setMaxAmount(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <button
                className="px-1 py-2 text-center w-full inline-block text-white bg-black border border-transparent rounded-md hover:bg-slate-200 hover:text-black"
                onClick={handlePriceButtonClick}
              >
                Filtrar
              </button>
            </div>
          </div>
        </div>
        {/* Category Filter */}
        <div className="p-5 pt-4  mb-2 sm:p-1 border border-gray-200 bg-white rounded shadow-sm">
          <h3 className="font-semibold mb-2 text-gray-700">Categoría</h3>
          <ul className="space-y-1">
            {allCategories?.map((category, index) => (
              <li key={index}>
                <div className={`box py-[1px]  ${styles.box}`}>
                  <input
                    name="category"
                    type="checkbox"
                    value={category}
                    defaultChecked={checkHandler('category', `${category}`)}
                    onClick={(e) => handleClick(e.target)}
                    className={`checkboxBipolarInput ${styles.checkboxBipolarInput}`}
                    id={category}
                  />
                  <label
                    htmlFor={category}
                    className="flex flex-row items-center cursor-pointer"
                  >
                    <span
                      className={`checkboxBipolar ${styles.checkboxBipolar}`}
                    >
                      <span className={`on ${styles.on}`}>I</span>
                      <span className={`off ${styles.off}`}>O</span>
                    </span>
                    <span className="brandName ml-2 text-gray-500 capitalize">
                      {' '}
                      {category}{' '}
                    </span>
                  </label>
                </div>
              </li>
            ))}
          </ul>
        </div>
        {/* Brand Filter */}
        <div className="p-5 pt-4 sm:p-1 border border-gray-200 bg-white rounded shadow-sm">
          <h3 className="font-semibold mb-2 text-gray-700">Marca</h3>
          <ul className="space-y-1">
            {allBrands?.map((brand, index) => (
              <li key={index}>
                <div className={`box  py-[1px]  ${styles.box}`}>
                  <input
                    name="brand"
                    type="checkbox"
                    value={brand}
                    defaultChecked={checkHandler('brand', `${brand}`)}
                    onClick={(e) => handleClick(e.target)}
                    className={`checkboxBipolarInput ${styles.checkboxBipolarInput}`}
                    id={brand}
                  />
                  <label
                    htmlFor={brand}
                    className="flex flex-row items-center cursor-pointer"
                  >
                    <span
                      className={`checkboxBipolar ${styles.checkboxBipolar}`}
                    >
                      <span className={`on ${styles.on}`}>I</span>
                      <span className={`off ${styles.off}`}>O</span>
                    </span>
                    <span className="brandName ml-2 text-gray-500 capitalize">
                      {' '}
                      {brand}{' '}
                    </span>
                  </label>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </>
  );
};

export default AllFiltersComponent;
