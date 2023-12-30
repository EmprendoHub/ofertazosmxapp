import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Product from "@/backend/models/Product";
import APIFilters from "@/lib/APIFilters";

export const GET = async (req, res) => {
  await dbConnect();

  // result to display per page
  //const resPerPage = 2;
  // total number of documents in database
  const productsCount = await Product.countDocuments();

  try {
    // Extract all possible categories
    const allCategories = await Product.distinct("category");
    // Extract all possible categories
    const allBrands = await Product.distinct("brand");

    // Apply search Filters
    const apiFilters = new APIFilters(Product.find(), req.nextUrl.searchParams)
      .searchAllFields()
      .filter();

    let products = await apiFilters.query;
    const filteredProductsCount = products.length;

    //apiFilters.pagination(resPerPage);
    //products = await apiFilters.query.clone();
    const response = NextResponse.json({
      message: "Products fetched successfully",
      success: true,
      productsCount,
      filteredProductsCount,
      products,
      allCategories,
      allBrands,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        error: "Products loading error",
      },
      { status: 500 }
    );
  }
};
