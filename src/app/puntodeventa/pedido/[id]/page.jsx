import AdminOneOrder from '@/components/admin/profile/AdminOneOrder';
import { getOneOrder } from '@/app/_actions';

const AdminOneOrderPage = async ({ params }) => {
  const data = await getOneOrder(params.id);
  const order = JSON.parse(data.order);
  const deliveryAddress = JSON.parse(data.deliveryAddress);
  return (
    <div>
      <AdminOneOrder
        order={order}
        id={params?.id}
        deliveryAddress={deliveryAddress}
      />
    </div>
  );
};

export default AdminOneOrderPage;
