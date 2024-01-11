import Address from '@/backend/models/Address';
import Order from '@/backend/models/Order';
import User from '@/backend/models/User';
import dbConnect from '@/lib/db';
import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const token = await getToken({ req: request });
  if (token) {
    try {
      await dbConnect();
      const _id = await request.url.split('?')[1];
      let ordersData = await Order.find({ user: _id });
      const obj1 = Object.assign(ordersData);

      await Promise.all(
        obj1.map(async (order) => {
          let shippingInfo = await Address.findOne({
            _id: order.shippingInfo,
          });
          let user = await User.findOne({ _id: order.user });
          order.shippingInfo = shippingInfo;
          order.user = user;
        })
      );

      // descending order
      const sortedObj1 = obj1
        .slice()
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      const orders = {
        orders: sortedObj1,
      };
      return new Response(JSON.stringify(orders), { status: 201 });
    } catch (error) {
      return NextResponse.json(
        {
          error: 'Orders loading error',
          message: error,
        },
        { status: 500 }
      );
    }
  } else {
    // Not Signed in
    return new Response('You are not authorized, eh eh eh, no no no', {
      status: 400,
    });
  }
}
