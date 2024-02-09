import OneOrder from '@/components/user/profile/OneOrder';
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
        'Content-Type': 'application/json; charset=utf-8',
        Id: `${id}`,
      },
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error.message);
  }
}

const UserOneOrderPage = async ({ params }) => {
  const session = await getServerSession(options);
  const data = await getOneOrder(params.id, session);
  const order = data?.order;
  return (
    <div>
      <OneOrder order={order} id={params?.id} session={session} />
    </div>
  );
};

export default UserOneOrderPage;
