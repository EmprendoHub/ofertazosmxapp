'use client';
import React, { useEffect, useState } from 'react';
import { addToCart } from '@/redux/shoppingSlice';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';

const PedidoCancelado = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { orderData } = useSelector((state) => state?.compras);
  const [products, setProducts] = useState(orderData.order);

  useEffect(() => {
    orderData.order.forEach((product) => {
      console.log(product, 'product');
      dispatch(addToCart(product));
    });
    router.replace('/carrito');
  }, [orderData]);
  return <div className="text-black"></div>;
};

export default PedidoCancelado;
