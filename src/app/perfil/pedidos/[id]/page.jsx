import OneOrder from '@/components/user/profile/OneOrder';
import React from 'react';

const UserOneOrderPage = async ({ params }) => {
  return (
    <div>
      <OneOrder id={params.id} />
    </div>
  );
};

export default UserOneOrderPage;
