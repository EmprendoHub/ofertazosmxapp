import React from 'react';
import { getServerSession } from 'next-auth/next';
import { options } from '@/app/api/auth/[...nextauth]/options';
import AllLotteries from '@/components/lotteries/AllLotteries';

const getLotteries = async () => {
  const session = await getServerSession(options);
  const URL = `${process.env.NEXTAUTH_URL}/api/lotteries`;
  const res = await fetch(URL, {
    headers: {
      'X-Mysession-Key': JSON.stringify(session),
    },
  });
  const data = await res.json();
  return data.lotteries;
};

const ProfilePage = async () => {
  const lotteries = await getLotteries();
  return <AllLotteries lotteries={lotteries} />;
};

export default ProfilePage;
