'use client';
import { addToPOSCart } from '@/redux/shoppingSlice';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

const POSScannerComponent = ({ product, variation }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  useEffect(() => {
    if (product) {
      dispatch(addToPOSCart(variation));
      router.push('/pos/carrito');
    }
  }, [product]);

  return <div>POSScannerComponent</div>;
};

export default POSScannerComponent;
