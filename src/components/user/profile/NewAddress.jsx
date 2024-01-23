'use client';
import React, { useContext, useState } from 'react';
import { countries } from 'countries-list';
import AuthContext from '@/context/AuthContext';
import { toast } from 'react-toastify';
import { MdCancel } from 'react-icons/md';

const NewAddress = () => {
  const provincias = [
    { clave: 'AGS', nombre: 'AGUASCALIENTES' },
    { clave: 'BC', nombre: 'BAJA CALIFORNIA' },
    { clave: 'BCS', nombre: 'BAJA CALIFORNIA SUR' },
    { clave: 'CHI', nombre: 'CHIHUAHUA' },
    { clave: 'CHS', nombre: 'CHIAPAS' },
    { clave: 'CMP', nombre: 'CAMPECHE' },
    { clave: 'CMX', nombre: 'CIUDAD DE MEXICO' },
    { clave: 'COA', nombre: 'COAHUILA' },
    { clave: 'COL', nombre: 'COLIMA' },
    { clave: 'DGO', nombre: 'DURANGO' },
    { clave: 'GRO', nombre: 'GUERRERO' },
    { clave: 'GTO', nombre: 'GUANAJUATO' },
    { clave: 'HGO', nombre: 'HIDALGO' },
    { clave: 'JAL', nombre: 'JALISCO' },
    { clave: 'MCH', nombre: 'MICHOACAN' },
    { clave: 'MEX', nombre: 'ESTADO DE MEXICO' },
    { clave: 'MOR', nombre: 'MORELOS' },
    { clave: 'NAY', nombre: 'NAYARIT' },
    { clave: 'NL', nombre: 'NUEVO LEON' },
    { clave: 'OAX', nombre: 'OAXACA' },
    { clave: 'PUE', nombre: 'PUEBLA' },
    { clave: 'QR', nombre: 'QUINTANA ROO' },
    { clave: 'QRO', nombre: 'QUERETARO' },
    { clave: 'SIN', nombre: 'SINALOA' },
    { clave: 'SLP', nombre: 'SAN LUIS POTOSI' },
    { clave: 'SON', nombre: 'SONORA' },
    { clave: 'TAB', nombre: 'TABASCO' },
    { clave: 'TLX', nombre: 'TLAXCALA' },
    { clave: 'TMS', nombre: 'TAMAULIPAS' },
    { clave: 'VER', nombre: 'VERACRUZ' },
    { clave: 'YUC', nombre: 'YUCATAN' },
    { clave: 'ZAC', nombre: 'ZACATECAS' },
  ];
  const { user, addNewAddress, clearErrors, error } = useContext(AuthContext);
  const countriesList = Object.values(countries);
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [country, setCountry] = useState(countriesList[156].name);
  const [zipcode, setZipcode] = useState('');
  const [phone, setPhone] = useState('');

  const submitHandler = (e) => {
    const phoneRegex = /^(\+\d{2}\s?)?(\d{3}[-\s]?\d{3}[-\s]?\d{4})$/;
    e.preventDefault();

    if (street === '') {
      toast.error(
        'Por favor complete el nombre y numero de la calle para continuar.'
      );
      return;
    }
    if (city === '') {
      toast.error('Por favor agregar ciudad para continuar.');
      return;
    }
    if (province === '') {
      toast.error('Por favor selecciona una provincia  para continuar.');
      return;
    }
    if (zipcode === '') {
      toast.error('Por favor agregar el código postal para continuar.');
      return;
    }
    if (phone === '' || !phoneRegex.test(phone)) {
      toast.error(
        'Por favor agregar un teléfono válido para continuar. El formato correcto es: 331 235 4455'
      );
      return;
    }
    if (country === '') {
      toast.error('Por favor agregue un país para continuar.');
      return;
    }

    const newAddress = {
      street,
      city,
      province,
      zipcode,
      country,
      phone,
      user,
    };
    addNewAddress(newAddress);
  };

  return (
    <>
      <div className=" relative mt-1 mb-20 p-4 md:p-7 mx-auto rounded bg-white shadow-lg ">
        <form onSubmit={submitHandler} className="relative w-full">
          {error && (
            <div
              onClick={clearErrors}
              className="absolute drop-shadow-lg border border-slate-300 top-1/3 left-1/3 bg-white p-10 w-[350px] z-40"
            >
              <MdCancel className="absolute top-2 right-2 text-red-500 cursor-pointer" />
              <h3 className="text-xl text-red-600 ">Error:</h3>
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}
          <h2 className="mb-5 text-2xl font-semibold font-EB_Garamond">
            Agregar Nueva Dirección
          </h2>

          <div className="mb-4 md:col-span-2">
            <label className="block mb-1"> Calle* </label>
            <input
              className="appearance-none border border-gray-200 bg-gray-100 rounded-md py-2 px-3 hover:border-gray-400 focus:outline-none focus:border-gray-400 w-full"
              type="text"
              placeholder="Ingresa tu dirección"
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
                placeholder="Ingresa tu Ciudad"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>

            <div className="mb-4 maxmd:col-span-2">
              <label className="block mb-1"> Provincia </label>
              <select
                className="appearance-none border border-gray-200 bg-gray-100 rounded-md py-2 px-3 hover:border-gray-400 focus:outline-none focus:border-gray-400 w-full"
                value={province}
                onChange={(e) => setProvince(e.target.value)}
              >
                {provincias.map((province) => (
                  <option key={province.nombre} value={province.nombre}>
                    {province.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-x-2">
            <div className="mb-4 md:col-span-1">
              <label className="block mb-1"> Código Postal </label>
              <input
                className="appearance-none border border-gray-200 bg-gray-100 rounded-md py-2 px-3 hover:border-gray-400 focus:outline-none focus:border-gray-400 w-full"
                type="number"
                placeholder="Ingresa tu código postal"
                value={zipcode}
                onChange={(e) => setZipcode(e.target.value)}
              />
            </div>

            <div className="mb-4 md:col-span-1">
              <label className="block mb-1"> Teléfono </label>
              <input
                className="appearance-none border border-gray-200 bg-gray-100 rounded-md py-2 px-3 hover:border-gray-400 focus:outline-none focus:border-gray-400 w-full"
                type="tel"
                placeholder="Ingresa tu teléfono"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <p className="text-sm text-slate-500">331 235 4455</p>
            </div>
          </div>

          <div className="mb-4 md:col-span-2 ">
            <label className="block mb-1"> País </label>
            <select
              disabled
              className=" appearance-none border border-gray-200 bg-gray-100 rounded-md py-2 px-3 hover:border-gray-400 focus:outline-none focus:border-gray-400 w-full "
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
            Agregar Domicilio
          </button>
        </form>
      </div>
    </>
  );
};

export default NewAddress;
