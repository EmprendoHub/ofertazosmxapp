import AdminOneOrder from '@/components/admin/profile/AdminOneOrder';
import { getOneOrder } from '@/app/_actions';
import POSOneOrder from '@/components/pos/POSOneOrder';

const AdminOneOrderPage = async ({ params }) => {
  const data = await getOneOrder(params.id);
  const order = JSON.parse(data.order);
  const deliveryAddress = JSON.parse(data.deliveryAddress);
  return (
    <div className="m-2 ">
      <POSOneOrder
        order={order}
        id={params?.id}
        deliveryAddress={deliveryAddress}
      />
    </div>
  );
};

export default AdminOneOrderPage;
