import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import {
  HiAnnotation,
  HiArrowNarrowUp,
  HiDocumentText,
  HiOutlineUserGroup,
} from 'react-icons/hi';

const DashComponent = ({
  clients,
  affiliates,
  orders,
  products,
  posts,
  orderCountPreviousMonth,
  affiliateCountPreviousMonth,
  postCountPreviousMonth,
  clientCountPreviousMonth,
  totalOrderCount,
  totalAffiliateCount,
  totalProductCount,
  totalClientCount,
  totalPostCount,
}) => {
  return (
    <div className="p-3 md:mx-auto  text-slate-300">
      <div className="flex-wrap flex gap-4 justify-start">
        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 w-72 maxmd:w-full rounded-md shadow-md">
          <div className="flex justify-between">
            <div className="">
              <h3 className="text-gray-500 text-md uppercase">
                Clientes Totales
              </h3>
              <p className="text-2xl  text-slate-300">{totalClientCount}</p>
            </div>
            <HiOutlineUserGroup className="bg-teal-600  text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
          <div className="flex  gap-2 text-sm">
            <span className="text-green-500 flex items-center">
              <HiArrowNarrowUp />
              {clientCountPreviousMonth}
            </span>
            <div className="text-gray-500">Mes Anterior</div>
          </div>
        </div>
        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 w-72 maxmd:w-full rounded-md shadow-md">
          <div className="flex justify-between">
            <div className="">
              <h3 className="text-gray-500 text-md uppercase">
                Pedidos Totales
              </h3>
              <p className="text-2xl text-slate-300">{totalOrderCount}</p>
            </div>
            <HiOutlineUserGroup className="bg-teal-600  text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
          <div className="flex  gap-2 text-sm">
            <span className="text-green-500 flex items-center">
              <HiArrowNarrowUp />
              {orderCountPreviousMonth}
            </span>
            <div className="text-gray-500">Mes Anterior</div>
          </div>
        </div>
        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 w-72 maxmd:w-full rounded-md shadow-md">
          <div className="flex justify-between">
            <div className="">
              <h3 className="text-gray-500 text-md uppercase">
                Total de Afiliados
              </h3>
              <p className="text-2xl  text-slate-300">{totalAffiliateCount}</p>
            </div>
            <HiAnnotation className="bg-indigo-600  text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
          <div className="flex  gap-2 text-sm">
            <span className="text-green-500 flex items-center">
              <HiArrowNarrowUp />
              {affiliateCountPreviousMonth}
            </span>
            <div className="text-gray-500">Mes Anterior</div>
          </div>
        </div>
        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 w-72 maxmd:w-full rounded-md shadow-md">
          <div className="flex justify-between">
            <div className="">
              <h3 className="text-gray-500 text-md uppercase">
                Total de Publicaciones
              </h3>
              <p className="text-2xl  text-slate-300">{totalPostCount}</p>
            </div>
            <HiDocumentText className="bg-lime-600 text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
          <div className="flex  gap-2 text-sm">
            <span className="text-green-500 flex items-center">
              <HiArrowNarrowUp />
              {postCountPreviousMonth}
            </span>
            <div className="text-gray-500">Mes Anterior</div>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-4 py-3 mx-auto justify-start">
        <div className="flex flex-col w-72 maxmd:w-full shadow-md p-5 rounded-md dark:bg-gray-800">
          <div className="flex justify-between  p-5 text-sm font-semibold">
            <h1 className="text-center p-2">Clientes Recientes</h1>
            <button>
              <Link href={'/admin/clientes'}>Ver Todos</Link>
            </button>
          </div>
          <table>
            <thead className=" text-slate-300">
              <tr className="flex justify-between items-center">
                <th>Img.</th>
                <th>Nombre</th>
              </tr>
            </thead>
            {clients &&
              clients.map((client) => (
                <tbody key={client._id} className="divide-y">
                  <tr className="bg-white dark:border-gray-700 dark:bg-gray-800 flex justify-between items-center">
                    <td>
                      <Image
                        src={client.avatar || '/next.svg'}
                        alt="client"
                        width={400}
                        height={400}
                        className="w-10 h-10 rounded-full bg-gray-500"
                      />
                    </td>
                    <td className=" text-slate-300">
                      {client.name.substring(0, 14)}...
                    </td>
                  </tr>
                </tbody>
              ))}
          </table>
        </div>
        <div className="flex flex-col w-72 maxmd:w-full shadow-md p-5 rounded-md dark:bg-gray-800">
          <div className="flex justify-between  p-3 text-sm font-semibold">
            <h1 className="text-center">Pedidos recientes</h1>
            <button>
              <Link href={'/admin/pedidos'}>Ver todos</Link>
            </button>
          </div>
          <table>
            <thead>
              <tr className="flex justify-between mb-4">
                <th>No.</th>
                <th>Status</th>
              </tr>
            </thead>
            {orders &&
              orders.map((order) => (
                <tbody key={order._id} className="divide-y">
                  <tr className="bg-white flex justify-between dark:border-gray-700 dark:bg-gray-800">
                    <td>{order.orderId}</td>
                    <td>{order.orderStatus}</td>
                  </tr>
                </tbody>
              ))}
          </table>
        </div>
        <div className="flex flex-col w-72 maxmd:w-full shadow-md p-5 rounded-md dark:bg-gray-800">
          <div className="flex justify-between text-sm font-semibold">
            <h1 className="text-center">Afiliados Recientes</h1>
            <button>
              <Link href={'/admin/asociados'}>Ver Todos</Link>
            </button>
          </div>
          <table>
            {affiliates &&
              affiliates.map((affiliate) => (
                <tbody key={affiliate._id} className="divide-y">
                  <tr className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <td>
                      <p className="line-clamp-2">{affiliate.fullName}</p>
                    </td>
                  </tr>
                </tbody>
              ))}
          </table>
        </div>
        <div className="flex flex-col w-auto shadow-md p-5 rounded-md dark:bg-gray-800">
          <div className="flex justify-between  p-3 text-sm font-semibold">
            <h1 className="text-center">Publicaciones recientes</h1>
            <button>
              <Link href={'/admin/blog'}>Ver todas</Link>
            </button>
          </div>
          <table>
            <thead>
              <tr className="flex justify-between mb-4">
                <th>Img.</th>
                <th>Titulo</th>
              </tr>
            </thead>
            {posts &&
              posts?.map((post) => (
                <tbody key={post?._id} className="divide-y">
                  <tr className="bg-white flex justify-between dark:border-gray-700 dark:bg-gray-800">
                    <td>
                      <Image
                        src={post?.mainImage || '/next.svg'}
                        alt="user"
                        width={400}
                        height={400}
                        className="w-14 h-10 rounded-md bg-gray-500"
                      />
                    </td>
                    <td>{post.mainTitle.substring(0, 20)}...</td>
                  </tr>
                </tbody>
              ))}
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashComponent;
