'use client';
import Image from 'next/image';
import React from 'react';

const StoreMainHero = () => {
  return (
    <section className="container flex flex-col items-center justify-center min-h-[400px] maxsm:h-full">
      <div className="relative flex flex-row maxsm:flex-col items-center w-full bg-slate-300 h-[400px] maxsm:h-full">
        <div className="relative flex flex-row maxsm:flex-col maxsm:w-full  w-3/4 bg-teal-100 h-full">
          <div className="p-10 flex flex-col items-start justify-end h-[400px] maxsm:h-full maxsm:w-full w-6/12 oferta">
            <p className=" text-3xl maxsm:text-lg uppercase">
              La Oferta del Mes
            </p>
            <h2 className=" text-6xl maxsm:text-4xl font-black font-EB_Garamond mb-20">
              MAS OFERTAS ADENTRO...
            </h2>
            <p className="text-xl maxsm:text-base tracking-widest font-bold font-raleway">
              Lista de deseos {'>>'}
            </p>
          </div>
          <div className="p-8 maxsm:p-4 maxsm:pb-0 relative flex items-center justify-center h-[400px] w-6/12 maxsm:w-full maxsm:h-full">
            <Image
              src={`/images/main_stylish_model.png`}
              alt="img"
              width={300}
              height={300}
              className="object-cover "
            />
          </div>
        </div>
        <div className="w-1/4 maxsm:w-full  p-8 flex flex-col items-start justify-start  bg-slate-100 min-h-[300px] maxsm:h-full">
          <h3 className="text-bold text-2xl">Sugerencias de Michelle</h3>
        </div>
      </div>
      <div className="container flex flex-row maxsm:flex-col items-center w-full bg-slate-300 h-[400px] maxsm:h-full">
        <div className="w-1/4 maxsm:w-full p-4 maxsm:pb-0 relative flex flex-col items-start justify-start bg-red-200 h-full">
          <h3 className="text-bold text-2xl">Hasta un 30%</h3>
          <p>En todas las bolsas de mano.</p>
          <Image
            alt="img"
            width={250}
            height={250}
            src={`/images/main_stylish_model.png`}
            className="absolute maxsm:relative object-cover bottom-0"
          />
        </div>
        <div className="w-1/4 maxsm:w-full p-8 maxsm:p-4 maxsm:pb-0 relative flex flex-col items-start justify-start  bg-slate-200 h-full">
          <h3 className="text-bold text-2xl">Explora las marcas </h3>
          <p>Gucci, Fendi, Versace, etc...</p>
          <Image
            alt="img"
            width={250}
            height={250}
            src={`/images/main_stylish_model.png`}
            className="absolute maxsm:relative object-cover bottom-0"
          />
        </div>
        <div className="w-1/4 maxsm:w-full p-8 maxsm:p-4 maxsm:pb-0 relative flex flex-col items-start justify-end  bg-green-200 h-full">
          <h3 className="text-bold text-2xl">No te pierdas</h3>
          <p>Las ofertas de temporada.</p>
          <Image
            alt="img"
            width={220}
            height={220}
            src={`/images/main_stylish_model.png`}
            className="absolute maxsm:relative object-cover top-0"
          />
        </div>
        <div className="w-1/4 maxsm:w-full p-8 maxsm:p-4 maxsm:pb-0 flex flex-col items-start justify-start  bg-slate-100 h-full">
          <h3 className="text-bold text-2xl">Hasta un 30%</h3>
          <p>En todas las bolsas de mano.</p>
        </div>
      </div>
    </section>
  );
};

export default StoreMainHero;
