import DashComponent from '@/components/admin/dashboard/DashComponent';
import { getPOSDashboard } from '../_actions';
import AdminProfile from '@/components/admin/profile/AdminProfile';
import POSDashComponent from '@/components/pos/POSDashComponent';

const POSPage = async () => {
  const data = await getPOSDashboard();
  const clients = JSON.parse(data?.clients);
  const products = JSON.parse(data?.products);
  const orders = JSON.parse(data?.orders);
  const orderCountPreviousMonth = data?.orderCountPreviousMonth;
  const clientCountPreviousMonth = data?.clientCountPreviousMonth;
  const totalOrderCount = data?.totalOrderCount;
  const totalProductCount = data?.totalProductCount;
  const totalClientCount = data?.totalClientCount;
  return (
    <>
      <AdminProfile />
      <POSDashComponent
        clients={clients}
        orders={orders}
        products={products}
        orderCountPreviousMonth={orderCountPreviousMonth}
        clientCountPreviousMonth={clientCountPreviousMonth}
        totalOrderCount={totalOrderCount}
        totalProductCount={totalProductCount}
        totalClientCount={totalClientCount}
      />
    </>
  );
};

export default POSPage;
