'use client';
import React, { useState } from 'react';
import MotionHeaderComponent from './MotionHeaderComponent';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'next/navigation';
import { addAffiliate } from '@/redux/shoppingSlice';
import ModalSubscribe from '../modals/ModalSubscribe';

const HeaderComponent = ({ cookie }) => {
  const params = useSearchParams();
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();
  const referralSuccess = params.get('alink');
  if (referralSuccess) {
    console.log(referralSuccess);
    dispatch(addAffiliate(referralSuccess));
  }

  const handleSubscribe = async () => {
    setShowModal(true);
  };

  return (
    <>
      {/* <ModalSubscribe
        showModal={showModal}
        setShowModal={setShowModal}
        cookie={cookie}
      /> */}
      {/* <button onClick={handleSubscribe}>Susbcribe</button> */}
      <MotionHeaderComponent />
    </>
  );
};

export default HeaderComponent;
