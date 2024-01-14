import Post from '@/backend/models/Post';
import { NextResponse } from 'next/server';
import APIPostsFilters from '@/lib/APIPostsFilters';
import dbConnect from '@/lib/db';
import { getToken } from 'next-auth/jwt';

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
    let postQuery;
    if (token?.user?.role === 'manager') {
      postQuery = Post.find();
    } else {
      postQuery = Post.find({ published: true });
    }

    const resPerPage = 5;
    // Extract page and per_page from request URL
    const page = Number(request.nextUrl.searchParams.get('page')) || 1;
    // total number of documents in database
    const postsCount = await Post.countDocuments();
    // Extract all possible categories
    const allCategories = await Post.distinct('category');

    // Apply search Filters
    const apiPostFilters = new APIPostsFilters(
      postQuery,
      request.nextUrl.searchParams
    )
      .searchAllFields()
      .filter();

    let postsData = await apiPostFilters.query;
    const filteredPostsCount = postsData.length;

    // Pagination filter
    apiPostFilters.pagination(resPerPage, page);
    postsData = await apiPostFilters.query.clone();

    // If you want a new sorted array without modifying the original one, use slice
    // const sortedObj1 = obj1
    //   .slice()
    //   .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    // descending order
    // descending order
    const sortedPosts = postsData
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const posts = {
      posts: sortedPosts,
    };

    const dataPacket = {
      posts,
      postsCount,
      filteredPostsCount,
    };
    return new Response(JSON.stringify(dataPacket), { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Posts loading error',
      },
      { status: 500 }
    );
  }
}
