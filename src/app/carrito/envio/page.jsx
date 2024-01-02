'use client';
import Shipping from '@/components/cart/Shipping';
import AuthContext from '@/context/AuthContext';
import React, { useContext, useEffect, useState } from 'react';

const ShippingPage = () => {
  const { getAllAddresses } = useContext(AuthContext);
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    async function getAddresses() {
      const addressesGet = await getAllAddresses();
      setAddresses(addressesGet);
    }
    getAddresses();
  }, [getAllAddresses]);

  return <Shipping addresses={addresses} />;
};

export default ShippingPage;
