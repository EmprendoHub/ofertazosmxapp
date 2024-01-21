import axios from 'axios';

export const getAffiliateDashboard = async (currentCookies, email) => {
  const URL = `${process.env.NEXTAUTH_URL}/api/affiliate/dashboard`;
  const { data } = await axios.get(
    URL,
    {
      headers: {
        Cookie: currentCookies,
        userEmail: email,
      },
    },
    { cache: 'no-cache' }
  );

  return data;
};
