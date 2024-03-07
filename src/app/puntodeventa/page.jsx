import DashComponent from '@/components/admin/dashboard/DashComponent';
import { getPOSDashboard } from '../_actions';
import AdminProfile from '@/components/admin/profile/AdminProfile';
import POSDashComponent from '@/components/pos/POSDashComponent';

const POSPage = async () => {
  const data = await getPOSDashboard();
  const products = JSON.parse(data?.products);
  const orders = JSON.parse(data?.orders);
  const orderCountPreviousMonth = data?.orderCountPreviousMonth;
  const totalOrderCount = data?.totalOrderCount;
  const totalProductCount = data?.totalProductCount;
  return (
    <>
      <AdminProfile />
      <POSDashComponent
        orders={orders}
        products={products}
        orderCountPreviousMonth={orderCountPreviousMonth}
        totalOrderCount={totalOrderCount}
        totalProductCount={totalProductCount}
      />
    </>
  );
};

export default POSPage;
