import { options } from '@/app/api/auth/[...nextauth]/options';
import AllAffiliatesAdmin from '@/components/afiliados/AllAffiliatesAdmin';
import ServerPagination from '@/components/pagination/ServerPagination';
import { getServerSession } from 'next-auth';
import React from 'react';

async function getAllAffiliates(searchParams, session) {
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
    const URL = `${process.env.NEXTAUTH_URL}/api/affiliates?${searchQuery}`;
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

const AffiliatesPage = async ({ searchParams }) => {
  const session = await getServerSession(options);
  const data = await getAllAffiliates(searchParams, session);
  const filteredAffiliatesCount = data?.filteredAffiliatesCount;
  const affiliates = data?.affiliates.affiliates;
  let page = parseInt(searchParams.page, 10);
  page = !page || page < 1 ? 1 : page;
  const perPage = Number(data?.resPerPage);
  const totalPages = Math.ceil(data?.filteredAffiliatesCount / perPage);
  const prevPage = page - 1 > 0 ? page - 1 : 1;
  const nextPage = page + 1;
  const isPageOutOfRange = page > totalPages;
  const pageNumbers = [];
  const offsetNumber = 1;
  for (let i = page - offsetNumber; i <= page + offsetNumber; i++) {
    if (i >= 1 && i <= totalPages) {
      pageNumbers.push(i);
    }
  }
  return (
    <>
      <AllAffiliatesAdmin
        affiliates={affiliates}
        filteredAffiliatesCount={filteredAffiliatesCount}
      />
      <ServerPagination
        isPageOutOfRange={isPageOutOfRange}
        page={page}
        pageNumbers={pageNumbers}
        prevPage={prevPage}
        nextPage={nextPage}
        totalPages={totalPages}
      />
    </>
  );
};

export default AffiliatesPage;
