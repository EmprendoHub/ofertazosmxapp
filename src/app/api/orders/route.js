import Address from '@/backend/models/Address';
import Order from '@/backend/models/Order';
import User from '@/backend/models/User';
import APIOrderFilters from '@/lib/APIOrderFilters';
import dbConnect from '@/lib/db';
import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export const GET = async (request, res) => {
  const token = await getToken({ req: request });
  console.log(token, 'token');
  console.log(request.headers, 'request');
  if (!token) {
    // Not Signed in
    return new Response('You are not authorized, eh eh eh, no no no', {
      status: 400,
    });
  }

  try {
    await dbConnect();
    let orderQuery;
    if (token?.user?.role === 'manager') {
      orderQuery = Order.find();
    } else {
      orderQuery = Order.find({ user: token._id });
    }

    const resPerPage = 5;
    // Extract page and per_page from request URL
    const page = Number(request.nextUrl.searchParams.get('page')) || 1;
    const orderCount = await Order.countDocuments();

    // Apply search Filters including order_id and orderStatus
    const apiOrderFilters = new APIOrderFilters(
      orderQuery,
      request.nextUrl.searchParams
    )
      .searchAllFields()
      .filter();
    let ordersData = await apiOrderFilters.query;

    const filteredOrdersCount = ordersData.length;

    apiOrderFilters.pagination(resPerPage, page);
    ordersData = await apiOrderFilters.query.clone();

    await Promise.all(
      ordersData.map(async (order) => {
        let shippingInfo = await Address.findOne({
          _id: order.shippingInfo,
        });
        let user = await User.findOne({ _id: order.user });
        order.shippingInfo = shippingInfo;
        order.user = user;
      })
    );

    // If you want a new sorted array without modifying the original one, use slice
    // const sortedObj1 = obj1
    //   .slice()
    //   .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    // descending order
    // descending order
    const sortedOrders = ordersData
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const orders = {
      orders: sortedOrders,
    };

    const dataPacket = {
      orders,
      orderCount,
      filteredOrdersCount,
    };
    return new Response(JSON.stringify(dataPacket), { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Orders loading error',
      },
      { status: 500 }
    );
  }
};
