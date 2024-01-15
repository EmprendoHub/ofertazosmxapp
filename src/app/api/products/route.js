import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/backend/models/Product';
import APIFilters from '@/lib/APIFilters';
import { getToken } from 'next-auth/jwt';

export const GET = async (request, res) => {
  const token = await request.headers.get('cookie');

  if (!token) {
    // Not Signed in
    const notAuthorized = 'You are not authorized no no no';
    return new Response(JSON.stringify(notAuthorized), {
      status: 400,
    });
  }

  try {
    await dbConnect();
    let productQuery;
    productQuery = Product.find();

    const resPerPage = Number(request.headers.get('perpage')) || 5;
    // Extract page and per_page from request URL
    const page = Number(request.nextUrl.searchParams.get('page')) || 1;
    // total number of documents in database
    const productsCount = await Product.countDocuments();
    // Extract all possible categories
    const allCategories = await Product.distinct('category');
    // Extract all possible categories
    const allBrands = await Product.distinct('brand');

    // Apply search Filters
    const apiProductFilters = new APIFilters(
      productQuery,
      request.nextUrl.searchParams
    )
      .searchAllFields()
      .filter();

    let productsData = await apiProductFilters.query;

    const filteredProductsCount = productsData.length;

    apiProductFilters.pagination(resPerPage, page);
    productsData = await apiProductFilters.query.clone();

    // If you want a new sorted array without modifying the original one, use slice
    // const sortedObj1 = obj1
    //   .slice()
    //   .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    // descending order
    // descending order
    const sortedProducts = productsData
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const products = {
      products: sortedProducts,
    };

    const dataPacket = {
      products,
      productsCount,
      filteredProductsCount,
      allCategories,
      allBrands,
    };
    return new Response(JSON.stringify(dataPacket), { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Products loading error',
      },
      { status: 500 }
    );
  }
};
