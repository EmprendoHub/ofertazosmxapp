import UpdateAddress from '@/components/user/profile/UpdateAddress';
import React from 'react';

const UserAddressPage = async ({ params }) => {
  return <UpdateAddress id={params.id} />;
};

export default UserAddressPage;
