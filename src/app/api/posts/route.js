import Post from '@/backend/models/Post';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import PostsFilters from '@/lib/PostsFilters';

export const GET = async (req, res) => {
  await dbConnect();

  // result to display per page
  //const resPerPage = 2;
  // total number of documents in database
  const postsCount = await Post.countDocuments();

  try {
    // Extract all possible categories
    const allCategories = await Post.distinct('category');

    // Apply search Filters
    const postFilters = new PostsFilters(Post.find(), req.nextUrl.searchParams)
      .searchAllFields()
      .filter();

    let posts = await postFilters.query;
    const filteredPostsCount = posts.length;

    //postFilters.pagination(resPerPage);
    //posts = await postFilters.query.clone();
    const response = NextResponse.json({
      message: 'Posts fetched successfully',
      success: true,
      postsCount,
      filteredPostsCount,
      posts,
      allCategories,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Posts loading error',
      },
      { status: 500 }
    );
  }
};
