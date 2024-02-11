import AdminOneOrder from '@/components/admin/profile/AdminOneOrder';
import React from 'react';
import { getServerSession } from 'next-auth';
import { options } from '@/app/api/auth/[...nextauth]/options';

async function getOneOrder(id, session) {
  try {
    const stringSession = JSON.stringify(session);
    // Filter out undefined values
    const URL = `${process.env.NEXTAUTH_URL}/api/order`;
    const res = await fetch(URL, {
      headers: {
        Session: stringSession,
        Id: `${id}`,
        'Content-Type': 'application/json; charset=utf-8',
      },
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error.message);
  }
}

const AdminOneOrderPage = async ({ searchParams, params }) => {
  const session = await getServerSession(options);
  const data = await getOneOrder(params.id, session);
  console.log(data);
  const order = data?.order;
  return (
    <div>
      <AdminOneOrder order={order} id={params?.id} />
    </div>
  );
};

export default AdminOneOrderPage;
