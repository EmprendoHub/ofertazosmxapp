import DashComponent from '@/components/admin/dashboard/DashComponent';
import { getDashboard } from '../_actions';

const ProfilePage = async () => {
  const data = await getDashboard();
  const clients = JSON.parse(data?.clients);
  const products = JSON.parse(data?.products);
  const affiliates = JSON.parse(data?.affiliates);
  const orders = JSON.parse(data?.orders);
  const posts = JSON.parse(data?.posts);
  const orderCountPreviousMonth = data?.orderCountPreviousMonth;
  const affiliateCountPreviousMonth = data?.affiliateCountPreviousMonth;
  const postCountPreviousMonth = data?.postCountPreviousMonth;
  const clientCountPreviousMonth = data?.clientCountPreviousMonth;
  const totalOrderCount = data?.totalOrderCount;
  const totalAffiliateCount = data?.totalAffiliateCount;
  const totalProductCount = data?.totalProductCount;
  const productsCountPreviousMonth = data?.productsCountPreviousMonth;
  const totalClientCount = data?.totalClientCount;
  const totalPostCount = data?.totalPostCount;

  return (
    <>
      <DashComponent
        clients={clients}
        affiliates={affiliates}
        orders={orders}
        products={products}
        posts={posts}
        orderCountPreviousMonth={orderCountPreviousMonth}
        affiliateCountPreviousMonth={affiliateCountPreviousMonth}
        postCountPreviousMonth={postCountPreviousMonth}
        clientCountPreviousMonth={clientCountPreviousMonth}
        totalOrderCount={totalOrderCount}
        totalAffiliateCount={totalAffiliateCount}
        totalProductCount={totalProductCount}
        totalClientCount={totalClientCount}
        totalPostCount={totalPostCount}
        productsCountPreviousMonth={productsCountPreviousMonth}
      />
    </>
  );
};

export default ProfilePage;
