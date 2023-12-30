'use client';
import React, { useContext, useState } from 'react';
import { countries } from 'countries-list';
import AuthContext from '@/context/AuthContext';

const NewAddress = () => {
  const { user, addNewAddress, clearErrors } = useContext(AuthContext);
  const countriesList = Object.values(countries);
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [country, setCountry] = useState('');
  const [zipcode, setZipcode] = useState('');
  const [phone, setPhone] = useState('');

  const submitHandler = (e) => {
    e.preventDefault();

    const newAddress = {
      street,
      city,
      province,
      zipcode,
      country,
      phone,
      user,
    };
    console.log(newAddress);
    addNewAddress(newAddress);
  };

  return (
    <>
      <div className="mt-1 mb-20 p-4 md:p-7 mx-auto rounded bg-white shadow-lg max-w-[580px]">
        <form onSubmit={submitHandler}>
          <h2 className="mb-5 text-2xl font-semibold">
            Agregar Nueva Dirección
          </h2>

          <div className="mb-4 md:col-span-2">
            <label className="block mb-1"> Calle* </label>
            <input
              className="appearance-none border border-gray-200 bg-gray-100 rounded-md py-2 px-3 hover:border-gray-400 focus:outline-none focus:border-gray-400 w-full"
              type="text"
              placeholder="Type your address"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-x-3">
            <div className="mb-4 md:col-span-1">
              <label className="block mb-1"> Ciudad </label>
              <input
                className="appearance-none border border-gray-200 bg-gray-100 rounded-md py-2 px-3 hover:border-gray-400 focus:outline-none focus:border-gray-400 w-full"
                type="text"
                placeholder="Type your city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>

            <div className="mb-4 md:col-span-1">
              <label className="block mb-1"> Estado </label>
              <input
                className="appearance-none border border-gray-200 bg-gray-100 rounded-md py-2 px-3 hover:border-gray-400 focus:outline-none focus:border-gray-400 w-full"
                type="text"
                placeholder="Type state here"
                value={province}
                onChange={(e) => setProvince(e.target.value)}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-x-2">
            <div className="mb-4 md:col-span-1">
              <label className="block mb-1"> Código Postal </label>
              <input
                className="appearance-none border border-gray-200 bg-gray-100 rounded-md py-2 px-3 hover:border-gray-400 focus:outline-none focus:border-gray-400 w-full"
                type="number"
                placeholder="Type zip code here"
                value={zipcode}
                onChange={(e) => setZipcode(e.target.value)}
              />
            </div>

            <div className="mb-4 md:col-span-1">
              <label className="block mb-1"> Teléfono </label>
              <input
                className="appearance-none border border-gray-200 bg-gray-100 rounded-md py-2 px-3 hover:border-gray-400 focus:outline-none focus:border-gray-400 w-full"
                type="number"
                placeholder="Type phone no here"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-4 md:col-span-2">
            <label className="block mb-1"> País </label>
            <select
              className="appearance-none border border-gray-200 bg-gray-100 rounded-md py-2 px-3 hover:border-gray-400 focus:outline-none focus:border-gray-400 w-full"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              {countriesList.map((country) => (
                <option key={country.name} value={country.name}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="my-2 px-4 py-2 text-center w-full inline-block text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
          >
            Crear
          </button>
        </form>
      </div>
    </>
  );
};

export default NewAddress;
