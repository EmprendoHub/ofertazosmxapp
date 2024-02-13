import Link from 'next/link';
import { FaPencilAlt } from 'react-icons/fa';
import { formatDate, formatTime } from '@/backend/helpers';
import { getTotalFromItems } from '@/backend/helpers';
import FormattedPrice from '@/backend/helpers/FormattedPrice';
import AdminOrderSearch from '@/components/layout/AdminOrderSearch';

const AdminOrders = ({ orders, filteredOrdersCount }) => {
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <div className=" flex flex-row maxsm:flex-col maxsm:items-start items-center justify-between">
        <h1 className="text-3xl w-full maxsm:text-xl my-5 maxsm:my-1 ml-4 maxsm:ml-0 font-bold font-EB_Garamond">
          {`${filteredOrdersCount} Pedidos `}
        </h1>
        <AdminOrderSearch />
      </div>
      <table className="w-full text-sm maxsm:xs text-left">
        <thead className=" text-gray-700 uppercase">
          <tr>
            <th scope="col" className="px-6 maxsm:px-0 py-3">
              No.
            </th>
            <th scope="col" className="px-6 py-3 maxmd:hidden">
              Total
            </th>
            <th scope="col" className="px-6 maxsm:px-0 py-3">
              Pagado
            </th>
            <th scope="col" className="px-6 maxsm:px-0 py-3">
              Estado
            </th>
            <th scope="col" className="px-6 py-3 maxsm:hidden">
              Fecha
            </th>
            <th scope="col" className="w-5 px-1 py-3 text-center">
              ...
            </th>
          </tr>
        </thead>
        <tbody>
          {orders?.map((order, index) => (
            <tr className="bg-white" key={index}>
              <td className="px-6 maxsm:px-2 py-2">
                <Link key={index} href={`/admin/pedidos/${order._id}`}>
                  {order.orderId}
                </Link>
              </td>
              <td className="px-6 py-2 maxmd:hidden">
                <FormattedPrice amount={getTotalFromItems(order.orderItems)} />
              </td>
              <td className="px-6 maxsm:px-0 py-2 ">
                <b>
                  <FormattedPrice amount={order?.paymentInfo?.amountPaid} />
                </b>
              </td>
              <td
                className={`px-6 maxsm:px-0 py-2 font-bold ${
                  order.orderStatus === 'Apartado'
                    ? 'text-amber-700'
                    : order.orderStatus === 'En Camino'
                    ? 'text-blue-700'
                    : order.orderStatus === 'Entregado'
                    ? 'text-green-700'
                    : 'text-slate-600'
                }`}
              >
                {order.orderStatus.substring(0, 6)}...
              </td>
              <td className="px-6 py-2 maxsm:hidden">
                {order?.createdAt &&
                  `${formatDate(
                    order?.createdAt.substring(0, 24)
                  )} a las ${formatTime(order?.createdAt)}`}
              </td>
              <td className="px-1 py-2">
                <div>
                  <Link
                    href={`/admin/pedidos/${order._id}`}
                    className="px-2 py-2 inline-block text-white hover:text-black bg-black shadow-sm border border-gray-200 rounded-md hover:bg-gray-100 cursor-pointer mr-2"
                  >
                    <FaPencilAlt className="" />
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrders;
