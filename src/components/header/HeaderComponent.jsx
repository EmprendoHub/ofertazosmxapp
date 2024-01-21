'use client';
import React from 'react';
import MotionHeaderComponent from './MotionHeaderComponent';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'next/navigation';
import { addAffiliate } from '@/redux/shoppingSlice';

const HeaderComponent = () => {
  const params = useSearchParams();
  const dispatch = useDispatch();
  const referralSuccess = params.get('alink');
  if (referralSuccess) {
    console.log(referralSuccess);
    dispatch(addAffiliate(referralSuccess));
  }

  return <MotionHeaderComponent />;
};

export default HeaderComponent;
