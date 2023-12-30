import React from 'react';
import Link from 'next/link';

const SuccessPage = () => {
  return (
    <>
      <div
        className={
          'bg-white h-[80vh] flex items-center justify-center text-center mx-auto'
        }
      >
        <div>
          <h2 className="text-7xl font-EB_Garamond">Gracias por tu pago</h2>
          <h3 className="font-bodyFont text-2xl mt-3">
            El pago fue aceptado exitosamente por Shopout MX
          </h3>
          <p className="text-lg">
            Ahora puedes ver tus pedidos o continuar explorando nuestros
            servicios.
          </p>
          <div className="flex items-center gap-x-5 justify-center mt-10">
            <Link href={'/perfil/pedidos'}>
              <button className="bg-black text-slate-100 w-44 h-12 rounded-full text-base font-semibold hover:bg-yellow-600 duration-500">
                Ver Ordenes
              </button>
            </Link>
            <Link href={'/tienda'}>
              <button className="bg-black text-slate-100 w-44 h-12 rounded-full text-base font-semibold hover:bg-yellow-600 duration-500">
                Ir a Tienda
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default SuccessPage;
