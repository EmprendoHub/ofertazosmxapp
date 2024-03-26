"use client";
import Image from "next/image";
import Link from "next/link";
import { MdAttachMoney } from "react-icons/md";
import { IoArrowRedoSharp } from "react-icons/io5";
import {
  HiArrowNarrowUp,
  HiArrowRight,
  HiDocumentText,
  HiOutlineUserGroup,
} from "react-icons/hi";
import { GiClothes } from "react-icons/gi";
import FormattedPrice from "@/backend/helpers/FormattedPrice";
import { FaTags } from "react-icons/fa6";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

const DashComponent = ({ data }) => {
  const weeklyData = JSON.parse(data?.weeklyData);
  const sortedData = weeklyData
    .map((item, index) => ({ index, item }))
    .sort((a, b) => new Date(a.item.date) - new Date(b.item.date))
    .map(({ index }) => weeklyData[index]);
  weeklyData.sort((a, b, c) => new Date(c) - new Date(c));
  console.log(sortedData, "weeklyData");
  // Prepare the labels and data for the chart
  const chartLabels = sortedData.map((data) => data.date);
  const chartData = sortedData.map((data) => data.Total);
  const clients = JSON.parse(data?.clients);
  const products = JSON.parse(data?.products);
  const affiliates = JSON.parse(data?.affiliates);
  const orders = JSON.parse(data?.orders);
  const posts = JSON.parse(data?.posts);
  const totalPostCount = data?.totalPostCount;
  const orderCountPreviousMonth = data?.orderCountPreviousMonth;
  const affiliateCountPreviousMonth = data?.affiliateCountPreviousMonth;
  const postCountPreviousMonth = data?.postCountPreviousMonth;
  const clientCountPreviousMonth = data?.clientCountPreviousMonth;
  const totalOrderCount = data?.totalOrderCount;
  const totalAffiliateCount = data?.totalAffiliateCount;
  const totalProductCount = data?.totalProductCount;
  const productsCountPreviousMonth = data?.productsCountPreviousMonth;
  const totalCustomerCount = data?.totalCustomerCount;
  const totalPaymentsThisWeek = data?.totalPaymentsThisWeek;
  const dailyPaymentsTotals = data?.dailyPaymentsTotals;
  const yesterdaysOrdersTotals = data?.yesterdaysOrdersTotals;
  const monthlyOrdersTotals = data?.monthlyOrdersTotals;
  const yearlyOrdersTotals = data?.yearlyOrdersTotals;
  const lastWeeksPaymentsTotals = data?.lastWeeksPaymentsTotals;
  const lastMonthsPaymentsTotals = data?.lastMonthsPaymentsTotals;
  // Assuming `weeklyData` is your fetched dataset

  const weeklyDataWithColors = {
    labels: chartLabels,
    datasets: [
      {
        label: "Total de dia",
        data: chartData,
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.5)",
          "rgba(153, 102, 255, 0.5)",
          "rgba(255, 159, 64, 0.5)",
          "rgba(131, 201, 139, 0.5)", // Example colors for 7 data points
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(131, 201, 139, 1)", // Example border colors for 7 data points
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      title: {
        display: true,
        text: "Ventas de los últimos 7 días",
      },
    },
  };

  return (
    <div className="p-3 md:mx-auto  text-slate-700">
      <div className="flex-row maxsm:flex-col flex gap-4 justify-start w-full">
        <div className="w-full flex flex-row maxmd:flex-col gap-4 justify-start items-start">
          <div className="flex flex-col p-3 bg-slate-300 shadow-lg dark:bg-slate-300 gap-4 w-full rounded-md">
            <div className="flex justify-between ">
              <div className="">
                <h3 className="text-gray-500 text-md uppercase">
                  Ventas del Dia
                </h3>
                <p className="text-2xl  text-slate-700">
                  <FormattedPrice amount={dailyPaymentsTotals || 0} />
                </p>
              </div>
              <MdAttachMoney className="bg-blue-600  text-white rounded-full text-5xl p-3 shadow-lg" />
            </div>
            <div className="flex  gap-2 text-sm">
              <span className="text-green-700 flex items-center">
                <HiArrowNarrowUp />
                <FormattedPrice amount={yesterdaysOrdersTotals || 0} />
              </span>
              <div className="text-gray-500">Dia Anterior</div>
            </div>
          </div>
          <div className="flex flex-col p-3 bg-slate-300 shadow-lg dark:bg-slate-300 gap-4 w-full rounded-md">
            <div className="flex justify-between">
              <div className="">
                <h3 className="text-gray-500 text-md uppercase">
                  Venta Semanal
                </h3>
                <p className="text-2xl  text-slate-700">
                  <FormattedPrice amount={totalPaymentsThisWeek || 0} />
                </p>
              </div>
              <MdAttachMoney className="bg-teal-600  text-white rounded-full text-5xl p-3 shadow-lg" />
            </div>
            <div className="flex  gap-2 text-sm">
              <span className="text-green-700 flex items-center">
                <HiArrowNarrowUp />
                <FormattedPrice amount={lastWeeksPaymentsTotals || 0} />
              </span>
              <div className="text-gray-500">Semana Anterior</div>
            </div>
          </div>
        </div>

        <div className="w-full flex flex-row maxmd:flex-col gap-4 justify-start items-start">
          <div className="flex flex-col p-3 bg-slate-300 shadow-lg dark:bg-slate-300 gap-4 w-full rounded-md ">
            <div className="flex justify-between">
              <div className="">
                <h3 className="text-gray-500 text-md uppercase">
                  Venta Mensual
                </h3>
                <p className="text-2xl  text-slate-700">
                  <FormattedPrice amount={monthlyOrdersTotals || 0} />
                </p>
              </div>
              <MdAttachMoney className="bg-indigo-600  text-white rounded-full text-5xl p-3 shadow-lg" />
            </div>
            <div className="flex  gap-2 text-sm">
              <span className="text-green-700 flex items-center">
                <HiArrowNarrowUp />
                <FormattedPrice amount={lastMonthsPaymentsTotals || 0} />
              </span>
              <div className="text-gray-500">Mes Anterior</div>
            </div>
          </div>
          <div className="flex flex-col p-3 bg-slate-300 shadow-lg dark:bg-slate-300 gap-4 w-full rounded-md ">
            <div className="flex justify-between">
              <div className="">
                <h3 className="text-gray-500 text-md uppercase">Venta Anual</h3>
                <p className="text-2xl  text-slate-700">
                  <FormattedPrice amount={yearlyOrdersTotals || 0} />
                </p>
              </div>
              <MdAttachMoney className=" bg-orange-500 text-white rounded-full text-5xl p-3 shadow-lg" />
            </div>
            <div className="flex  gap-2 text-sm">
              <span className="text-green-700 flex items-center">
                <HiArrowNarrowUp />
                <FormattedPrice amount={lastMonthsPaymentsTotals || 0} />
              </span>
              <div className="text-gray-500">Año Anterior</div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full min-h-[400px] bg-slate-300 p-5  mt-4">
        {/* Chart to display daily totals for the last 7 days */}
        <div className="chart-container h-[400px] maxsm:h-[200px]">
          <h2>Totales diarios de los últimos 7 días</h2>
          <Bar data={weeklyDataWithColors} options={options} />
        </div>
      </div>
      <div className="flex-row maxsm:flex-col flex gap-4 justify-start w-full mt-4">
        <div className="w-full flex flex-row maxmd:flex-col gap-4 justify-start items-start">
          <div className="flex flex-col p-3 dark:bg-slate-300 gap-4 w-full rounded-md shadow-lg bg-slate-300">
            <div className="flex justify-between">
              <div className="">
                <h3 className="text-gray-500 text-md uppercase">
                  Clientes Totales
                </h3>
                <p className="text-2xl  text-slate-700">{totalCustomerCount}</p>
              </div>
              <HiOutlineUserGroup className="bg-blue-600  text-white rounded-full text-5xl p-3 shadow-lg" />
            </div>
            <Link href={"/admin/clientes"} className="flex  gap-2 text-sm">
              <span className="text-green-700 flex items-center">
                <HiArrowRight />
              </span>
              <div className="text-gray-500">Explorar Clientes</div>
            </Link>
          </div>
          <div className="flex flex-col p-3 dark:bg-slate-300 gap-4 w-full rounded-md shadow-lg bg-slate-300">
            <div className="flex justify-between">
              <div className="">
                <h3 className="text-gray-500 text-md uppercase">
                  Pedidos Totales
                </h3>
                <p className="text-2xl text-slate-700">{totalOrderCount}</p>
              </div>
              <FaTags className="bg-teal-600  text-white rounded-full text-5xl p-3 shadow-lg" />
            </div>
            <div className="flex  gap-2 text-sm">
              <span className="text-green-700 flex items-center">
                <HiArrowNarrowUp />
                {orderCountPreviousMonth}
              </span>
              <div className="text-gray-500">Mes Anterior</div>
            </div>
          </div>
        </div>

        <div className="w-full flex flex-row maxmd:flex-col gap-4 justify-start items-start">
          <div className="flex flex-col p-3 dark:bg-slate-300 gap-4 w-full rounded-md shadow-lg bg-slate-300">
            <div className="flex justify-between">
              <div className="">
                <h3 className="text-gray-500 text-md uppercase">
                  Total de Productos
                </h3>
                <p className="text-2xl  text-slate-700">{totalProductCount}</p>
              </div>
              <GiClothes className="bg-indigo-600  text-white rounded-full text-5xl p-3 shadow-lg" />
            </div>
            <div className="flex  gap-2 text-sm">
              <span className="text-green-700 flex items-center">
                <HiArrowNarrowUp />
                {productsCountPreviousMonth}
              </span>
              <div className="text-gray-500">Mes Anterior</div>
            </div>
          </div>
          <div className="flex flex-col p-3 dark:bg-slate-300 gap-4 w-full rounded-md shadow-lg bg-slate-300">
            <div className="flex justify-between">
              <div className="">
                <h3 className="text-gray-500 text-md uppercase">
                  Total de Publicaciones
                </h3>
                <p className="text-2xl  text-slate-700">{totalPostCount}</p>
              </div>
              <HiDocumentText className=" bg-orange-500 text-white rounded-full text-5xl p-3 shadow-lg" />
            </div>
            <div className="flex  gap-2 text-sm">
              <span className="text-green-700 flex items-center">
                <HiArrowNarrowUp />
                {postCountPreviousMonth}
              </span>
              <div className="text-gray-500">Mes Anterior</div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-row maxsm:flex-col gap-4 py-3 mx-auto justify-start">
        <div className="w-full flex flex-row maxmd:flex-col gap-4 justify-start items-start">
          <div className="flex flex-col w-full shadow-md p-5 rounded-md bg-slate-300">
            <div className="flex justify-between py-3 text-base font-black font-EB_Garamond">
              <h1>Clientes Recientes</h1>
              <button>
                <Link href={"/admin/clientes"}>Ver Todos</Link>
              </button>
            </div>
            <table>
              <thead className=" text-slate-700">
                <tr className="flex justify-between items-center">
                  <th>Img.</th>
                  <th>Nombre</th>
                  <th>...</th>
                </tr>
              </thead>
              {clients &&
                clients.map((client) => (
                  <tbody key={client._id} className="divide-y">
                    <tr className=" dark:border-gray-700 dark:bg-slate-300 flex justify-between items-center mb-2">
                      <td>
                        <Image
                          src={
                            client.avatar || "/images/avatar_placeholder.jpg"
                          }
                          alt="client"
                          width={400}
                          height={400}
                          className="w-10 h-10 rounded-full bg-gray-500"
                        />
                      </td>
                      <td className="capitalize text-slate-700">
                        {client.name.substring(0, 14)}...
                      </td>
                      <td>
                        <Link href={`/admin/cliente/${client._id}`}>
                          <IoArrowRedoSharp className=" text-blue-500 " />
                        </Link>
                      </td>
                    </tr>
                  </tbody>
                ))}
            </table>
          </div>
          <div className="flex flex-col w-full shadow-md p-5 rounded-md bg-slate-300">
            <div className="flex justify-between py-3 text-base font-black font-EB_Garamond">
              <h1>Pedidos recientes</h1>
              <button>
                <Link href={"/admin/pedidos"}>Ver todos</Link>
              </button>
            </div>
            <table>
              <thead>
                <tr className="flex justify-between mb-4">
                  <th>No.</th>
                  <th>Status</th>
                  <th>Cliente</th>
                  <th>...</th>
                </tr>
              </thead>
              {orders &&
                orders.map((order) => (
                  <tbody key={order._id} className="divide-y">
                    <tr className=" flex justify-between dark:border-gray-700 dark:bg-slate-300 mb-4">
                      <td>{order.orderId}</td>
                      <td>{order.orderStatus}</td>
                      <td>{order.customerName}</td>
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
          <div className="flex flex-col w-full shadow-md p-5 rounded-md bg-slate-300">
            <div className="flex justify-between py-3 text-base font-black font-EB_Garamond">
              <h1>Productos Recientes</h1>
              <button>
                <Link href={"/admin/productos"}>Ver Todos</Link>
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
                    <tr className=" flex justify-between dark:border-gray-700 dark:bg-slate-300 mb-2">
                      <td>
                        <Image
                          src={
                            product?.images[0].url ||
                            "/images/avatar_placeholder.jpg"
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
          <div className="flex flex-col w-full shadow-md p-5 rounded-md bg-slate-300">
            <div className="flex justify-between py-3 text-base font-black font-EB_Garamond">
              <h1>Publicaciones recientes</h1>
              <button>
                <Link href={"/admin/blog"}>Ver todas</Link>
              </button>
            </div>
            <table>
              <thead>
                <tr className="flex justify-between mb-4">
                  <th>Img.</th>
                  <th>Titulo</th>
                  <th>...</th>
                </tr>
              </thead>
              {posts &&
                posts?.map((post) => (
                  <tbody key={post?._id} className="divide-y">
                    <tr className=" flex justify-between dark:border-gray-700 dark:bg-slate-300 mb-2">
                      <td>
                        <Image
                          src={post?.mainImage || "/next.svg"}
                          alt="user"
                          width={400}
                          height={400}
                          className="w-14 h-10 rounded-md bg-gray-500"
                        />
                      </td>
                      <td>{post.mainTitle.substring(0, 20)}...</td>
                      <td>
                        <Link href={`/admin/blog/editar/${post.slug}`}>
                          <IoArrowRedoSharp className=" text-orange-500 " />
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

export default DashComponent;
