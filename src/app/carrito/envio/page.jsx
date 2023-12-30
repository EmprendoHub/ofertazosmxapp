import { options } from '@/app/api/auth/[...nextauth]/options';
import Shipping from '@/components/cart/Shipping';
import { getServerSession } from 'next-auth';
import React from 'react';

const getAddresses = async () => {
  const session = await getServerSession(options);
  const URL = `${process.env.NEXTAUTH_URL}/api/addresses`;
  const res = await fetch(URL, {
    headers: {
      'X-Mysession-Key': JSON.stringify(session),
    },
  });
  const data = await res.json();
  return data.addresses;
};

const ShippingPage = async () => {
  const addresses = await getAddresses();
  return <Shipping addresses={addresses} />;
};

export default ShippingPage;
