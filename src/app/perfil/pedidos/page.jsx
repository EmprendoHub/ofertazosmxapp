import { options } from '@/app/api/auth/[...nextauth]/options';
import Orders from '@/components/admin/profile/Orders';
import { getServerSession } from 'next-auth';
import React from 'react';

const getCustomerOrders = async () => {
  const session = await getServerSession(options);
  const _id = session?.user._id;
  const URL = `${process.env.NEXTAUTH_URL}/api/orders?${_id}`;
  const res = await fetch(URL);
  const data = await res.json();
  return data.orders;
};

const UserOrdersPage = async () => {
  const orders = await getCustomerOrders();
  return <Orders orders={orders} />;
};

export default UserOrdersPage;
