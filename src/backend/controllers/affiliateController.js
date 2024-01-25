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

export async function getAllOrders(searchParams, session) {
  try {
    const urlParams = {
      keyword: searchParams.keyword,
      page: searchParams.page,
    };
    const stringSession = JSON.stringify(session);
    // Filter out undefined values
    const filteredUrlParams = Object.fromEntries(
      Object.entries(urlParams).filter(([key, value]) => value !== undefined)
    );
    const searchQuery = new URLSearchParams(filteredUrlParams).toString();
    const URL = `${process.env.NEXTAUTH_URL}/api/orders?${searchQuery}`;
    const res = await fetch(URL, {
      headers: {
        Session: stringSession,
        'Content-Type': 'application/json; charset=utf-8',
      },
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error.message);
  }
}
