import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { MdAttachMoney } from 'react-icons/md';
import { IoArrowRedoSharp } from 'react-icons/io5';
import { HiArrowNarrowUp } from 'react-icons/hi';
import { GiClothes } from 'react-icons/gi';
import FormattedPrice from '@/backend/helpers/FormattedPrice';
const POSDashComponent = ({
  clients,
  orders,
  products,
  orderCountPreviousMonth,
  clientCountPreviousMonth,
  totalOrderCount,
  totalProductCount,
  totalClientCount,
  productsCountPreviousMonth,
  thisWeekOrderTotals,
  thisWeeksOrder,
  dailyOrdersTotals,
}) => {
  return (
    <div className="p-3 md:mx-auto  text-slate-700">
      <div className="flex-row maxsm:flex-col flex gap-4 justify-start w-full">
        <div className="w-full flex flex-row maxmd:flex-col gap-4 justify-start items-start">
          <div className="flex flex-col p-3 dark:bg-slate-300 gap-4 w-full rounded-md shadow-md">
            <div className="flex justify-between">
              <div className="">
                <h3 className="text-gray-500 text-md uppercase">
                  Ventas del Dia
                </h3>
                <p className="text-2xl  text-slate-700">
                  <FormattedPrice amount={dailyOrdersTotals} />
                </p>
              </div>
              <MdAttachMoney className="bg-blue-600  text-white rounded-full text-5xl p-3 shadow-lg" />
            </div>
            <div className="flex  gap-2 text-sm">
              <span className="text-green-700 flex items-center">
                <HiArrowNarrowUp />
                <FormattedPrice amount={dailyOrdersTotals} />
              </span>
              <div className="text-gray-500">Mes Anterior</div>
            </div>
          </div>
          <div className="flex flex-col p-3 dark:bg-slate-300 gap-4 w-full rounded-md shadow-md">
            <div className="flex justify-between">
              <div className="">
                <h3 className="text-gray-500 text-md uppercase">
                  Ventas de La Semana
                </h3>
                <p className="text-2xl  text-slate-700">
                  <FormattedPrice amount={thisWeekOrderTotals} />
                </p>
              </div>
              <MdAttachMoney className="bg-blue-600  text-white rounded-full text-5xl p-3 shadow-lg" />
            </div>
            <div className="flex  gap-2 text-sm">
              <span className="text-green-700 flex items-center">
                <HiArrowNarrowUp />
                <FormattedPrice amount={thisWeekOrderTotals} />
              </span>
              <div className="text-gray-500">Mes Anterior</div>
            </div>
          </div>
        </div>

        <div className="w-full flex flex-row maxmd:flex-col gap-4 justify-start items-start">
          <div className="flex flex-col p-3 dark:bg-slate-300 gap-4 w-full rounded-md shadow-md">
            <div className="flex justify-between">
              <div className="">
                <h3 className="text-gray-500 text-md uppercase">
                  Ventas del Mes
                </h3>
                <p className="text-2xl  text-slate-700">
                  <FormattedPrice amount={thisWeekOrderTotals} />
                </p>
              </div>
              <MdAttachMoney className="bg-blue-600  text-white rounded-full text-5xl p-3 shadow-lg" />
            </div>
            <div className="flex  gap-2 text-sm">
              <span className="text-green-700 flex items-center">
                <HiArrowNarrowUp />
                <FormattedPrice amount={thisWeekOrderTotals} />
              </span>
              <div className="text-gray-500">Mes Anterior</div>
            </div>
          </div>
          <div className="flex flex-col p-3 dark:bg-slate-300 gap-4 w-full rounded-md shadow-md">
            <div className="flex justify-between">
              <div className="">
                <h3 className="text-gray-500 text-md uppercase">
                  Ventas del Mes Anterior
                </h3>
                <p className="text-2xl  text-slate-700">
                  <FormattedPrice amount={thisWeekOrderTotals} />
                </p>
              </div>
              <MdAttachMoney className="bg-blue-600  text-white rounded-full text-5xl p-3 shadow-lg" />
            </div>
            <div className="flex  gap-2 text-sm">
              <span className="text-green-700 flex items-center">
                <HiArrowNarrowUp />
                <FormattedPrice amount={thisWeekOrderTotals} />
              </span>
              <div className="text-gray-500">Mes Anterior</div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-row maxsm:flex-col gap-4 py-3 mx-auto justify-start">
        <div className="w-full flex flex-row maxmd:flex-col gap-4 justify-start items-start">
          <div className="flex flex-col w-full shadow-md p-5 rounded-md dark:bg-slate-300">
            <div className="flex justify-between py-3 text-base font-black font-EB_Garamond">
              <h1>Pedidos recientes</h1>
              <button>
                <Link href={'/admin/pedidos'}>Ver todos</Link>
              </button>
            </div>
            <table>
              <thead>
                <tr className="flex justify-between mb-4">
                  <th>No.</th>
                  <th>Status</th>
                  <th>...</th>
                </tr>
              </thead>
              {orders &&
                orders.map((order) => (
                  <tbody key={order._id} className="divide-y">
                    <tr className="bg-white flex justify-between dark:border-gray-700 dark:bg-slate-300 mb-4">
                      <td>{order.orderId}</td>
                      <td>{order.orderStatus}</td>
                      <td>
                        <Link href={`/admin/pedido/${order._id}`}>
                          <IoArrowRedoSharp className=" text-teal-600 " />
                        </Link>
                      </td>
                    </tr>
                  </tbody>
                ))}
            </table>
          </div>
        </div>

        <div className="w-full flex flex-row maxmd:flex-col gap-4 justify-start items-start">
          <div className="flex flex-col w-full shadow-md p-5 rounded-md dark:bg-slate-300">
            <div className="flex justify-between py-3 text-base font-black font-EB_Garamond">
              <h1>Productos Recientes</h1>
              <button>
                <Link href={'/admin/productos'}>Ver Todos</Link>
              </button>
            </div>
            <table>
              <thead>
                <tr className="flex justify-between mb-4">
                  <th>Img.</th>
                  <th>Nombre</th>
                  <th>...</th>
                </tr>
              </thead>
              {products &&
                products.map((product) => (
                  <tbody key={product._id} className="divide-y">
                    <tr className="bg-white flex justify-between dark:border-gray-700 dark:bg-slate-300 mb-2">
                      <td>
                        <Image
                          src={
                            product?.images[0].url ||
                            '/images/avatar_placeholder.jpg'
                          }
                          alt="producto"
                          width={400}
                          height={400}
                          className="w-10 h-10 rounded-full bg-gray-500"
                        />
                      </td>
                      <td>
                        <p className="line-clamp-2 capitalize">
                          {product.title.substring(0, 12)}...
                        </p>
                      </td>
                      <td>
                        <Link href={`/admin/productos/editar/${product.slug}`}>
                          <IoArrowRedoSharp className=" text-indigo-500 " />
                        </Link>
                      </td>
                    </tr>
                  </tbody>
                ))}
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default POSDashComponent;
