import AdminOneOrder from '@/components/admin/profile/AdminOneOrder';
import React from 'react';

const UserOneOrderPage = async ({ params }) => {
  return (
    <div>
      <AdminOneOrder id={params.id} />
    </div>
  );
};

export default UserOneOrderPage;
