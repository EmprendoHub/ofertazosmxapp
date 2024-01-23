import dbConnect from '@/lib/db';
import { getToken } from 'next-auth/jwt';
import Affiliate from '@/backend/models/Affiliate';
import { NextResponse } from 'next/server';
import APIAffiliateFilters from '@/lib/APIAffiliateFilters';

export async function GET(request) {
  const token = await getToken({ req: request });

  if (!token) {
    // Not Signed in
    const notAuthorized = 'You are not authorized no no no';
    return new Response(JSON.stringify(notAuthorized), {
      status: 400,
    });
  }

  try {
    await dbConnect();
    let affiliateQuery;
    affiliateQuery = Affiliate.find({});

    const resPerPage = Number(request.headers.get('perpage')) || 5;
    // Extract page and per_page from request URL
    const page = Number(request.nextUrl.searchParams.get('page')) || 1;
    // total number of documents in database
    const affiliatesCount = await Affiliate.countDocuments();

    // Apply search Filters
    const apiAffiliateFilters = new APIAffiliateFilters(
      affiliateQuery,
      request.nextUrl.searchParams
    )
      .searchAllFields()
      .filter();

    let affiliatesData = await apiAffiliateFilters.query;

    const filteredAffiliatesCount = affiliatesData.length;

    apiAffiliateFilters.pagination(resPerPage, page);
    affiliatesData = await apiAffiliateFilters.query.clone();

    // If you want a new sorted array without modifying the original one, use slice
    // const sortedObj1 = obj1
    //   .slice()
    //   .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    // descending order
    // descending order
    const sortedAffiliates = affiliatesData
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const affiliates = {
      affiliates: sortedAffiliates,
    };

    const dataPacket = {
      affiliates,
      affiliatesCount,
      filteredAffiliatesCount,
    };
    return new Response(JSON.stringify(dataPacket), { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Affiliates loading error',
      },
      { status: 500 }
    );
  }
}
