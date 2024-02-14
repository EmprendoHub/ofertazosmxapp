import { getAllUserOrder } from '@/app/_actions';
import ViewUserOrders from '@/components/orders/ViewUserOrders';
import ServerPagination from '@/components/pagination/ServerPagination';
import Profile from '@/components/user/profile/Profile';
import UserProfile from '@/components/user/profile/UserProfile';

const ClientDetailsPage = async ({ searchParams, params }) => {
  const urlParams = {
    keyword: searchParams.keyword,
    page: searchParams.page,
  };
  const filteredUrlParams = Object.fromEntries(
    Object.entries(urlParams).filter(([key, value]) => value !== undefined)
  );
  const searchQuery = new URLSearchParams(filteredUrlParams).toString();
  const data = await getAllUserOrder(searchQuery, params.id);
  const orders = JSON.parse(data.orders);
  const client = JSON.parse(data.client);
  const filteredOrdersCount = data?.itemCount;
  //Pagination
  let page = parseInt(searchParams.page, 10);
  page = !page || page < 1 ? 1 : page;
  const perPage = 5;
  const totalPages = Math.ceil(data.itemCount / perPage);
  const prevPage = page - 1 > 0 ? page - 1 : 1;
  const nextPage = page + 1;
  const isPageOutOfRange = page > totalPages;
  const pageNumbers = [];
  const offsetNumber = 1;
  for (let i = page - offsetNumber; i <= page + offsetNumber; i++) {
    if (i >= 1 && i <= totalPages) {
      pageNumbers.push(i);
    }
  }

  return (
    <>
      <UserProfile user={client} />
      <ViewUserOrders
        orders={orders}
        client={client}
        filteredOrdersCount={filteredOrdersCount}
      />
      <ServerPagination
        isPageOutOfRange={isPageOutOfRange}
        page={page}
        pageNumbers={pageNumbers}
        prevPage={prevPage}
        nextPage={nextPage}
        totalPages={totalPages}
      />
    </>
  );
};

export default ClientDetailsPage;
