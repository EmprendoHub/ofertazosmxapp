import AdminOneOrder from '@/components/admin/profile/AdminOneOrder';
import { getOneOrder } from '@/app/_actions';

const AdminOneOrderPage = async ({ params }) => {
  const data = await getOneOrder(params.id);
  const order = JSON.parse(data.order);
  const deliveryAddress = JSON.parse(data.deliveryAddress);
  const orderPayments = JSON.parse(data.orderPayments);
  const customer = JSON.parse(data.customer);
  return (
    <div>
      <AdminOneOrder
        order={order}
        customer={customer}
        id={params?.id}
        deliveryAddress={deliveryAddress}
        orderPayments={orderPayments}
      />
    </div>
  );
};

export default AdminOneOrderPage;
