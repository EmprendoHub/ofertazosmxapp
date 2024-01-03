import AllClientsComponent from '@/components/clients/AllClientsComponent';
import React from 'react';

const getClients = async () => {
  const URL = `${process.env.NEXTAUTH_URL}/api/clients`;
  try {
    const res = await fetch(URL, { cache: 'no-cache' });
    const data = await res.json();
    return data.clients;
  } catch (error) {
    console.log(error);
  }
};

const ClientsPage = async () => {
  const data = await getClients();
  return <AllClientsComponent clients={data} />;
};

export default ClientsPage;
