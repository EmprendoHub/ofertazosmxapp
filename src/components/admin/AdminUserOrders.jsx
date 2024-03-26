"use client";
import { formatDate, formatTime, getTotalFromItems } from "@/backend/helpers";
import FormattedPrice from "@/backend/helpers/FormattedPrice";
import Link from "next/link";
import { useState } from "react";
import { FaEye } from "react-icons/fa6";
import { TfiMoney } from "react-icons/tfi";
import Modal from "../modals/Modal";

const AdminUserOrders = ({ orders, filteredOrdersCount, client }) => {
  const [showModal, setShowModal] = useState(false);
  const [usedOrderId, setUsedOrderId] = useState("");
  const updateOrderStatus = async (orderId) => {
    setUsedOrderId(orderId);
    setShowModal(true);
  };
  return (
    <>
      <Modal
        showModal={showModal}
        setShowModal={setShowModal}
        orderId={usedOrderId}
      />
      <div className="pl-3 relative overflow-x-auto shadow-md sm:rounded-lg">
        <h1 className="text-3xl my-5 ml-4 font-bold font-EB_Garamond">
          {`${filteredOrdersCount}
        Pedidos para ${client.name}`}
        </h1>
        <p>{client?.email}</p>
        <p>{client?.phone}</p>
        <table className="w-full text-sm text-left">
          <thead className="text-l text-gray-700 uppercase">
            <tr>
              <th scope="col" className="px-6 maxsm:px-1 py-3">
                No.
              </th>
              <th scope="col" className="px-6 maxsm:px-1 py-3">
                Cliente
              </th>
              <th scope="col" className="px-6 maxsm:px-1 maxsm:hidden py-3">
                Total
              </th>
              <th scope="col" className="px-6 maxsm:px-1 py-3">
                Pagado
              </th>
              <th scope="col" className="px-6 maxsm:px-1 py-3">
                Estado
              </th>
              <th scope="col" className="px-6 maxsm:px-0 py-3">
                Ubicación
              </th>
              <th scope="col" className="px-6 maxsm:px-1  maxsm:hidden py-3">
                Fecha
              </th>
              <th scope="col" className="px-2 maxsm:px-1 py-3 text-center">
                ...
              </th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((order, index) => (
              <tr className="bg-white" key={index}>
                <td className="px-6 maxsm:px-1 py-2">
                  <Link
                    href={`/admin/pedido/${order._id}`}
                    className="px-2 py-2 inline-block text-black shadow-sm border border-gray-200 rounded-md bg-gray-100 cursor-pointer mr-2"
                  >
                    {order?.orderId}
                  </Link>
                </td>
                <td className="px-6 maxsm:px-1 py-2">{order?.customerName}</td>
                <td className="px-6 maxsm:px-1  maxsm:hidden py-2">
                  <FormattedPrice
                    amount={getTotalFromItems(order.orderItems)}
                  />
                </td>
                <td className="px-6 maxsm:px-1 py-2 ">
                  <b>
                    <FormattedPrice amount={order?.paymentInfo?.amountPaid} />
                  </b>
                </td>
                <td
                  className={`px-6 maxsm:px-1 py-2 font-bold ${
                    order.orderStatus === "Apartado"
                      ? "text-amber-700"
                      : order.orderStatus === "En Camino"
                      ? "text-blue-700"
                      : order.orderStatus === "Entregado"
                      ? "text-green-700"
                      : "text-slate-600"
                  }`}
                >
                  {order.orderStatus}
                </td>
                <td
                  className={`px-6 maxsm:px-0 py-2 font-bold ${
                    order.branch === "Sahuayo"
                      ? "text-amber-700"
                      : "text-slate-600"
                  }`}
                >
                  {order.branch}
                </td>
                <td className="px-6 maxsm:px-1  maxsm:hidden py-2">
                  {order?.createdAt &&
                    `${formatDate(
                      order?.createdAt.substring(0, 24)
                    )} a las ${formatTime(order?.createdAt)}`}
                </td>
                <td className="px-2 maxsm:px-1 py-2">
                  <div className="flex items-center">
                    <Link
                      href={`/admin/pedido/${order._id}`}
                      className="px-2 py-2 inline-block text-white hover:text-black bg-black shadow-sm border border-gray-200 rounded-md hover:bg-gray-100 cursor-pointer mr-2"
                    >
                      <FaEye className="" />
                    </Link>
                    {order?.paymentInfo?.amountPaid >=
                      getTotalFromItems(order.orderItems) ===
                    true ? (
                      ""
                    ) : (
                      <button
                        onClick={() => updateOrderStatus(order._id)}
                        className={`px-2 py-2 inline-block text-black hover:text-black ${
                          order?.paymentInfo?.amountPaid >=
                            getTotalFromItems(order.orderItems) ===
                          true
                            ? ""
                            : "bg-emerald-700"
                        }  shadow-sm border border-gray-200 rounded-md hover:scale-110 cursor-pointer mr-2 duration-200 ease-in-out`}
                      >
                        {order?.paymentInfo?.amountPaid >=
                          getTotalFromItems(order.orderItems) ===
                        true ? (
                          ""
                        ) : (
                          <TfiMoney className="text-white" />
                        )}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AdminUserOrders;
