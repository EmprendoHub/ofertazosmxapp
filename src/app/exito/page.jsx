import React from "react";
import Link from "next/link";

const SuccessPage = () => {
  return (
    <>
      <div
        className={
          "bg-white h-[80vh] flex items-center justify-center text-center mx-auto"
        }
      >
        <div className='w-[90%]'>
          <p className='font-raleway text-slate-500 text-lg mt-3'>
            Tu pago fue aceptado exitosamente
          </p>
          <h2 className='text-7xl font-EB_Garamond'>Gracias</h2>

          <h3 className='font-EB_Garamond text-2xl mt-3'>
            Por Comprar En Shopout MX
          </h3>
          <p className='text-base text-slate-600 mt-5'>
            En breve uno de nuestros representantes comenzara a procesar tu
            pedido. Ahora puedes ver tus pedidos o continuar explorando nuestros
            servicios.
          </p>
          <div className='flex maxsm:flex-col gap-4 items-center gap-x-5 justify-center mt-10'>
            <Link href={"/perfil/pedidos"}>
              <button className='bg-black text-slate-100 hover:text-black w-44 h-12 rounded-full text-base font-semibold hover:bg-gray-200 duration-500'>
                Ver Ordenes
              </button>
            </Link>
            <Link href={"/tienda"}>
              <button className='bg-black text-slate-100 hover:text-black w-44 h-12 rounded-full text-base font-semibold hover:bg-gray-200 duration-500'>
                Explorar Tienda
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default SuccessPage;
