'use client';
import React from 'react';
import BreadCrumbs from '../layout/BreadCrumbs';
import POSPaymentForm from './POSPaymentForm';

const DrawerComponent = () => {
  const breadCrumbs = [
    {
      name: 'Home',
      url: '/',
    },
    {
      name: `pos`,
      url: `/pos`,
    },
    {
      name: `carrito`,
      url: `/pos/carrito`,
    },
    {
      name: `caja`,
      url: `/pos/carrito/caja`,
    },
  ];

  return (
    <div>
      <BreadCrumbs breadCrumbs={breadCrumbs} />
      <section className="py-10 bg-gray-50">
        <div className=" max-w-screen-xl mx-auto px-4">
          <div className="flex flex-col items-center gap-4">
            <main className="md:w-2/3">
              <POSPaymentForm />
            </main>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DrawerComponent;
